from django.urls import path
from .views import health_check, post_list, post_comments

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("posts/", post_list, name="post-list"),
    path("posts/<int:post_id>/comments/", post_comments, name="post-comments"),
]
