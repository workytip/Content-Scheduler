<?php

namespace App\Services;

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Exception;
use Illuminate\Support\Facades\Log;

class PostService
{
    public function getUserPosts(User $user, $filters = [])
    {
        return Post::with('platforms')
            ->where('user_id', $user->id)
            ->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status))
            ->when($filters['date'] ?? null, fn($q, $date) => $q->whereDate('scheduled_time', $date))
            ->orderByDesc('created_at')
            ->paginate(10);
    }

    public function canSchedulePost(User $user, $scheduledTime)
    {
        $scheduledCount = Post::where('user_id', $user->id)
            ->whereDate('scheduled_time', date('Y-m-d', strtotime($scheduledTime)))
            ->where('status', 'scheduled')
            ->count();

        return $scheduledCount < 10;
    }

    public function createPost(User $user, array $validated)
    {
        try {
            $post = $user->posts()->create([
                'title' => $validated['title'],
                'content' => $validated['content'],
                'image_url' => $validated['imageUrl'],
                'scheduled_time' => $validated['scheduledTime'],
                'status' => $validated['status'],
            ]);
            $post->platforms()->attach($validated['platforms']);
            return $post;
        } catch (Exception $e) {
            Log::error($e->getMessage());
            throw new Exception(Config::get('messages.posts.failed_to_create', 'Failed to create post.'));
        }
    }

    public function updatePost(Post $post, array $validated)
    {
        try {
            $post->update([
                'title' => $validated['title'],
                'content' => $validated['content'],
                'image_url' => $validated['imageUrl'],
                'scheduled_time' => $validated['scheduledTime'],
                'status' => $validated['status'],
            ]);
            $post->platforms()->sync($validated['platforms']);
            return $post;
        } catch (Exception $e) {
            Log::error($e->getMessage());
            throw new Exception(Config::get('messages.posts.failed_to_update', 'Failed to update post.'));
        }
    }

    public function deletePost(Post $post)
    {
        try {
            $post->delete();
        } catch (Exception $e) {
            Log::error($e->getMessage());
            throw new Exception(Config::get('messages.posts.failed_to_delete', 'Failed to delete post.'));
        }
    }
}