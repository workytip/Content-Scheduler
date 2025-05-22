<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    //
    //stateless jwt login auth
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (auth()->attempt($credentials)) {
            $user = auth()->user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => new UserResource($user),
            ], 200);
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }


    public function logout(Request $request)
    {
        $user = auth()->user();
        $user->tokens()->delete();

        return response()->json(['message' => 'Successfully logged out'], 200);
    }
}
