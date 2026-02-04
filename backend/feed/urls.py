from django.urls import path
from .views import (
    health_check,
    post_list,
    post_comments,
    like_post,
    like_comment,
    leaderboard,
    leaderboard_full,
    post_create,
    comment_create,
)

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("posts/", post_list, name="post-list"),
    path("posts/create/", post_create, name="post-create"),
    path("posts/<int:post_id>/comments/", post_comments, name="post-comments"),
    path("posts/<int:post_id>/comments/create/", comment_create, name="comment-create"),
    path("posts/<int:post_id>/like/", like_post, name="like-post"),
    path("comments/<int:comment_id>/like/", like_comment, name="like-comment"),
    path("leaderboard/", leaderboard, name="leaderboard"),
    path("leaderboard/full/", leaderboard_full, name="leaderboard-full"),
]
