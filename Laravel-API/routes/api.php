<?php

use Illuminate\Http\Request;
//impoert user model class
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//create login endpoint
Route::post('login', function(Request $request){
    $credentials = $request->only('email', 'password');
    if (Auth::attempt($credentials)) {
        //return jwt token
        $token = auth()->user()->createToken('token-name')->plainTextToken;
        return response()->json(['token' => $token], 200);
    }
    return response()->json(['message' => 'Login Failed'], 401);
});

Route::middleware('auth:sanctum')->get('/test', function (Request $request) {
    // return $request->user();
  
        User::create([
            'name' => 'test1',
            'email' => 'a1@m.com',
            'password' => Hash::make('password1')
        ]);
        return 'done';
  
});


