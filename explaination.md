# Explanation

This document explains how I approached the core backend problems in the Community Feed project, especially around nested comments, leaderboard aggregation, and correctness under concurrency.

Rather than optimizing for shortcuts, the focus was on building something that is easy to reason about, safe under load, and simple to debug.

## 1. The Tree — Nested Comments

### How comments are modeled

For nested comments, I used a self-referential foreign key (adjacency list pattern).

Each comment:

- belongs to a post
- has an author
- may optionally point to another comment as its parent

Top-level comments simply have parent = NULL.

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="replies",
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

I chose this approach because it keeps the schema very small and flexible while still allowing arbitrarily deep nesting. There’s no special casing for depth, and the database stays easy to query.

### Avoiding the N+1 problem

The key constraint here was not blowing up the number of queries when a post has many nested replies.

Instead of fetching comments recursively, the backend:

- Fetches all comments for a post in a single query
- Builds the tree in memory
- Serializes only the final tree

comments = (
    Comment.objects
    .filter(post_id=post_id)
    .select_related("author")
    .order_by("created_at")
)

From there, comments are stored in a dictionary keyed by id, and each comment is attached to its parent’s children list. Only root-level comments are returned from the API.

This approach guarantees:

- exactly one SQL query per post
- predictable O(n) behavior
- no recursive database access

### Serialization approach

The serializer itself does not hit the database again. It only walks the already-built in-memory tree:

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.username")
    children = serializers.SerializerMethodField()

    def get_children(self, obj):
        return CommentSerializer(obj.children, many=True).data

Because all children are attached beforehand, serialization stays cheap even with deep nesting.

## 2. The Math — Last 24h Leaderboard

### Why karma is event-based

Instead of storing a “current karma” or “daily karma” field on the user, karma is recorded as an append-only event log (KarmaEvent).

Each like creates a small, immutable record:

- +5 points when a post is liked
- +1 point when a comment is liked

This makes the system much easier to reason about:

- no counters to keep in sync
- no race conditions from concurrent updates
- historical data is preserved for debugging

### Leaderboard query

The leaderboard is computed dynamically using a rolling 24-hour window:

from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum

since = timezone.now() - timedelta(hours=24)

leaderboard = (
    KarmaEvent.objects
    .filter(created_at__gte=since)
    .values("user__id", "user__username")
    .annotate(total_karma=Sum("points"))
    .order_by("-total_karma")[:5]
)

This query:

- only considers recent activity
- groups by user
- sums karma points
- returns the top 5 users

There is no stored “daily” state — the leaderboard always reflects reality at query time.

## 3. The AI Audit — What I Changed

### What the AI initially suggested

One early AI-generated suggestion was to add a daily_karma integer field on the User model and increment it whenever a like happened.

While this looks simpler at first, it breaks down quickly:

- it violates the requirement to compute karma dynamically
- it introduces race conditions under concurrent likes
- it does not support a rolling 24-hour window cleanly

### How I fixed it

Instead of following that approach, I redesigned karma as an event stream:

- every karma-earning action creates a KarmaEvent
- likes are protected by database-level unique constraints
- aggregation happens only at read time

This made the system:

- safer under concurrency
- easier to debug
- fully aligned with the assignment constraints
