<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use Illuminate\Http\Request;
use App\Services\PlatformService;

class PlatformController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    private $platformService;

    public function __construct(PlatformService $platformService)
    {
        $this->platformService = $platformService;
    }

    public function getPlatformsWithStatus(Request $request)
    {
        $user = $request->user();
        $platforms = $this->platformService->getActivePlatforms($user);

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
        $result = $this->platformService->togglePlatform($user, $platform);

        if (isset($result['error'])) {
            return response()->json(['message' => $result['error']], $result['status']);
        }

        return response()->json(['message' => $result['message']], $result['status']);
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
        $platforms = $this->platformService->getUserPlatforms($user);

        return response()->json(['platforms' => $platforms], 200);
    }
}
