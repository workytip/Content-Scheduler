<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Services\FileUploadService;
use App\Http\Requests\UploadRequest;
use App\Http\Resources\UserResource;
use App\Http\Requests\UpdateUserRequest;

class UserController extends Controller
{

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

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->image_url = $validated['imageUrl'];
        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }

        $user->save();

        return response()->json([
            'user' => new UserResource($user),
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
        // Delete the user
        $user->delete();
        // Return a success response
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

    public function fileUpload(UploadRequest $request, FileUploadService $uploader)
    {
        $result = $uploader->handleUpload($request);
        return response()->json($result, 200);
    }

    
}
