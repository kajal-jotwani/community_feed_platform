from django.shortcuts import render
from django.db.models import Count
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction, IntegrityError
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from .models import Post, Comment, Like, KarmaEvent
from .serializers import PostSerializer, CommentSerializer

@api_view(["GET"])
def health_check(request):
    return Response({"status": "ok"})

@api_view(["GET"])
def post_list(request):
    posts = (
        Post.objects
        .select_related("author")            
        .annotate(like_count=Count("likes"))  
        .order_by("-created_at")
    )

    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def post_comments(request, post_id):
    comments = (
        Comment.objects
        .filter(post_id=post_id)
        .select_related("author")
        .order_by("created_at")
    )

    comment_map = {}
    root_comments = []

    for comment in comments:
        comment.children = []
        comment_map[comment.id] = comment

    for comment in comments:
        if comment.parent_id:
            parent = comment_map.get(comment.parent_id)
            if parent:
                parent.children.append(comment)
        else:
            root_comments.append(comment)

    serializer = CommentSerializer(root_comments, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def like_post(request, post_id):
    user = User.objects.first()  # assume authenticated user
    post = get_object_or_404(Post, id=post_id)

    try:
        with transaction.atomic():
            Like.objects.create(
                user=user,
                post=post
            )

            KarmaEvent.objects.create(
                user=post.author,
                points=5,
                source_type="post_like"
            )

    except IntegrityError:
        return Response(
            {"detail": "Post already liked"},
            status=400
        )

    return Response({"detail": "Post liked successfully"})

@api_view(["POST"])
def like_comment(request, comment_id):
    user = User.objects.first()  # assume authenticated user
    comment = get_object_or_404(Comment, id=comment_id)

    try:
        with transaction.atomic():
            Like.objects.create(
                user=user,
                comment=comment
            )

            KarmaEvent.objects.create(
                user=comment.author,
                points=1,
                source_type="comment_like"
            )

    except IntegrityError:
        return Response(
            {"detail": "Comment already liked"},
            status=400
        )

    return Response({"detail": "Comment liked successfully"})
