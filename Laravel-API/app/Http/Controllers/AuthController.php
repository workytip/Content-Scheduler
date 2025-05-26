<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;

class AuthController extends Controller
{
    //
    public function login(LoginRequest $request, AuthService $authService)
    {
        $result = $authService->login($request);

        if (isset($result['user'])) {
            return response()->json([
                'message' => $result['message'],
                'token' => $result['token'],
                'user' => new UserResource($result['user']),
                'expires_in' => $result['expires_in']
            ], $result['status']);
        }

        // For errors
        return response()->json([
            'message' => $result['message']
        ], $result['status']);
    }


    /**
     * Logout the authenticated user (revoke the token).
     */
    public function logout(Request $request, AuthService $authService)
    {
        $user = auth()->user();
        $result = $authService->logout($user);

        return response()->json(['message' => $result['message']], $result['status']);
    }

    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request, AuthService $authService)
    {
        $validated = $request->validated();
        $result = $authService->register($validated);

        return response()->json([
            'token' => $result['token'],
            'user' => new UserResource($result['user']),
        ], $result['status']);
    }

    /**
     * Update the password of the authenticated user.
     */
    public function updatePassword(Request $request, AuthService $authService)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = auth()->user();
        $result = $authService->updatePassword($user, $request->only('current_password', 'new_password'));

        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], $result['status']);
        }

        return response()->json(['message' => $result['message']], $result['status']);
    }
}
