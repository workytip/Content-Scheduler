<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Services\FileUploadService;
use App\Http\Requests\UploadRequest;
use App\Http\Resources\UserResource;
use App\Http\Requests\UpdateUserRequest;
use App\Services\UserService;

class UserController extends Controller
{
    private $userService;
    private $uploader;

    public function __construct(UserService $userService, FileUploadService $uploader)
    {
        $this->userService = $userService;
        $this->uploader = $uploader;
    }
    public function show(User $user)
    {
        return response()->json([
            'user' =>  new UserResource($user),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->validated();
        $user = $this->userService->updateUser($user, $validated);

        return response()->json([
            'user' => new UserResource($user),
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->userService->deleteUser($user);
        return response()->json([
            'message' => 'User deleted successfully',
        ], 200);
    }

    public function userActivities(Request $request)
    {
        $activities = \Spatie\Activitylog\Models\Activity::where('causer_id', $request->user()->id)
            ->latest()
            ->limit(20)
            ->get();

        return response()->json(['data' => $activities]);
    }

    public function fileUpload(UploadRequest $request)
    {
        $result = $this->uploader->handleUpload($request);
        return response()->json($result, 200);
    }
}
