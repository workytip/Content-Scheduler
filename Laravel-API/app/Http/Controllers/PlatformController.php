<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use Illuminate\Http\Request;

class PlatformController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function getPlatformsWithStatus(Request $request)
    {
        $user = $request->user();
        $platforms = $user->platforms()->wherePivot('is_active', true)->get();

        return response()->json(['platforms' => $platforms], 200);
    }

    /**
     * Toggle the active status of a platform for the authenticated user.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Platform $platform
     * @return \Illuminate\Http\JsonResponse
     */
    public function togglePlatform(Request $request, Platform $platform)
    {
        $user = $request->user();
        $platformId = $platform->id;

        $platform = Platform::find($platformId);

        if (!$platform) {
            return response()->json(['message' => 'Platform not found'], 404);
        }

        $pivot = $user->platforms()->where('platform_id', $platformId)->first();

        if ($pivot) {
            $current = (bool) $pivot->pivot->is_active;
            $user->platforms()->updateExistingPivot($platformId, ['is_active' => !$current]);
            return response()->json([
                'message' => $current ? 'Platform deactivated successfully' : 'Platform activated successfully'
            ], 200);
        } else {
            $user->platforms()->attach($platformId, ['is_active' => true]);
            return response()->json(['message' => 'Platform activated successfully'], 200);
        }
    }

    /**
     * Get the platforms for the authenticated user with their active status.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    
    public function getUserPlatforms(Request $request)
    {
        $user = $request->user();
        $platforms = Platform::all()->map(function ($platform) use ($user) {
            $pivot = $user->platforms()->where('platform_id', $platform->id)->first();
            return [
                'id' => $platform->id,
                'name' => $platform->name,
                'is_active' => $pivot ? (bool) $pivot->pivot->is_active : false,
            ];
        });

        return response()->json(['platforms' => $platforms], 200);
    }
}
