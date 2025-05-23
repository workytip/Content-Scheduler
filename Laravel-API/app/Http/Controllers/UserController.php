<?php

namespace App\Http\Controllers;

use App\Models\User;
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
}
