<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlatformController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });


// Auth routes
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');


// User routes
Route::middleware('auth:sanctum')->group(function () {
    //auth
    Route::get('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::put('/users/{user}/password', [AuthController::class, 'updatePassword']);
    
    //user profile
    Route::get('/user/activities', [UserController::class, 'userActivities'])->name('user.activities');
    Route::apiResource('users', UserController::class)->only(['show', 'update', 'destroy']);
    Route::post('users/upload', [UserController::class, 'fileUpload']);

    //posts
    Route::apiResource('posts', PostController::class);
    Route::post('posts/upload', [PostController::class, 'fileUpload']);
    //platforms
    Route::get('/platforms', [PlatformController::class, 'getPlatformsWithStatus'])->name('platforms.index');
    Route::get('/user/platforms', [PlatformController::class, 'getUserPlatforms']);
    Route::post('/platforms/{platform}/toggle', [PlatformController::class, 'togglePlatform'])->name('platforms.toggle');
});
   

