from django.shortcuts import render
from django.db.models import Count
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Post, Comment
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

    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)
