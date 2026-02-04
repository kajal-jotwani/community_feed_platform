from rest_framework import serializers
from .models import Post, Comment

class PostSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.username", read_only=True)
    like_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = ["id", "author", "content", "created_at", "like_count"]

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.username", read_only=True)
    children = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "author",
            "content",
            "created_at",
            "children",
        ]

    def get_children(self, obj):
        return CommentSerializer(obj.children, many=True).data

