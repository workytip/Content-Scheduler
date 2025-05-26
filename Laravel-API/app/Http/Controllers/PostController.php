<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Requests\PostRequest;
use App\Services\FileUploadService;
use App\Http\Requests\UploadRequest;
use App\Http\Resources\PostResource;
use App\Services\PostService;

class PostController extends Controller
{
    //
    private $postService;
    private $uploader;

    public function __construct(PostService $postService, FileUploadService $uploader)
    {
        $this->postService = $postService;
        $this->uploader = $uploader;
    }
   
    public function index(Request $request)
    {
        $user = $request->user();
        $filters = [
            'status' => $request->status,
            'date' => $request->date,
        ];
        $posts = $this->postService->getUserPosts($user, $filters);

        return response()->json([
            'message' => 'Posts retrieved successfully',
            'data' => PostResource::collection($posts)
        ], 200);
    }

    public function store(PostRequest $request)
    {

        $validated = $request->validated();
        $user = $request->user();

        if (!$this->postService->canSchedulePost($user, $validated['scheduledTime'])) {
            return response()->json([
                'message' => 'You have reached the daily limit of 10 scheduled posts.'
            ], 429);
        }

        $post = $this->postService->createPost($user, $validated);

        return response()->json([
            'message' => 'Post created successfully',
            'data' => new PostResource($post)
        ], 200);
    }


    public function update(PostRequest $request, Post $post)
    {
        $validated = $request->validated();
        $post = $this->postService->updatePost($post, $validated);

        return response()->json([
            'message' => 'Post updated successfully',
            'data' => new PostResource($post)
        ], 200);
    }


    public function destroy(Post $post)
    {
        $this->postService->deletePost($post);

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

    public function fileUpload(UploadRequest $request)
    {
        $result = $this->uploader->handleUpload($request);
        return response()->json($result, 200);
    }
}
