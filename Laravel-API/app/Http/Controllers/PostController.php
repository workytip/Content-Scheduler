<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Requests\PostRequest;
use App\Services\FileUploadService;
use App\Http\Requests\UploadRequest;
use App\Http\Resources\PostResource;

class PostController extends Controller
{
    //
    public function index(Request $request)
    {
        $user = $request->user();

        $posts = Post::with('platforms')
            ->where('user_id', $user->id)
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->date, fn($q, $date) => $q->whereDate('scheduled_time', $date))
            ->orderByDesc('created_at')
            ->paginate(10);


        return response()->json([
            'message' => 'Posts retrieved successfully',
            'data' => PostResource::collection($posts)
        ], 200);
    }

    public function store(PostRequest $request)
    {

        $validated = $request->validated();
        $user = $request->user();

        // Count scheduled posts for this user on the same day
        $scheduledCount = Post::where('user_id', $user->id)
            ->whereDate('scheduled_time', date('Y-m-d', strtotime($validated['scheduledTime'])))
            ->where('status', 'scheduled')
            ->count();

        if ($scheduledCount >= 10) {
            return response()->json([
                'message' => 'You have reached the daily limit of 10 scheduled posts.'
            ], 429);
        }
        $post = $user->posts()->create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'image_url' => $validated['imageUrl'],
            'scheduled_time' => $validated['scheduledTime'],
            'status' => $validated['status'],
        ]);

        $post->platforms()->attach($validated['platforms']);

        return response()->json([
            'message' => 'Post created successfully',
            'data' => new PostResource($post)
        ], 200);
    }


    public function update(PostRequest $request, Post $post)
    {
        $validated = $request->validated();

        $post->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'image_url' => $validated['imageUrl'],
            'scheduled_time' => $validated['scheduledTime'],
            'status' => $validated['status'],
        ]);

        $post->platforms()->sync($validated['platforms']);

        return response()->json([
            'message' => 'Post updated successfully',
            'data' => new PostResource($post)
        ], 200);
    }


    public function destroy(Post $post)
    {
        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully'
        ], 200);
    }


    public function show(Post $post)
    {
        return response()->json([
            'message' => 'Post retrieved successfully',
            'data' => new PostResource($post)
        ], 200);
    }

    public function fileUpload(UploadRequest $request, FileUploadService $uploader)
    {
        $result = $uploader->handleUpload($request);
        return response()->json($result, 200);
    }
}
