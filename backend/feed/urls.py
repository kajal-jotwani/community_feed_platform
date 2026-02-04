from django.urls import path
from .views import health_check, post_list, post_comments, like_post, like_comment, leaderboard

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("posts/", post_list, name="post-list"),
    path("posts/<int:post_id>/comments/", post_comments, name="post-comments"),
    path("posts/<int:post_id>/like/", like_post, name="like-post"),
    path("comments/<int:comment_id>/like/", like_comment, name="like-comment"),
    path("leaderboard/", leaderboard, name="leaderboard"),
]
