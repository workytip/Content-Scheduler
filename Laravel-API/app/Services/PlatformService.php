<?php

namespace App\Services;

use App\Models\Platform;
use App\Models\User;
use Illuminate\Support\Facades\Config;

class PlatformService
{
    public function getActivePlatforms(User $user)
    {
        return $user->platforms()->wherePivot('is_active', true)->get();
    }

    public function togglePlatform(User $user, Platform $platform)
    {
        $platformId = $platform->id;
        $platform = Platform::find($platformId);

        if (!$platform) {
            return [
                'error' => Config::get('messages.platform.not_found', 'Platform not found.'),
                'status' => 404
            ];
        }

        $pivot = $user->platforms()->where('platform_id', $platformId)->first();

        if ($pivot) {
            $current = (bool) $pivot->pivot->is_active;
            $user->platforms()->updateExistingPivot($platformId, ['is_active' => !$current]);
            return [
                'message' => $current
                    ? Config::get('messages.platform.deactivated', 'Platform deactivated successfully.')
                    : Config::get('messages.platform.activated', 'Platform activated successfully.'),
                'status' => 200
            ];
        } else {
            $user->platforms()->attach($platformId, ['is_active' => true]);
            return [
                'message' => Config::get('messages.platform.activated', 'Platform activated successfully.'),
                'status' => 200
            ];
        }
    }

    public function getUserPlatforms(User $user)
    {
        return Platform::all()->map(function ($platform) use ($user) {
            $pivot = $user->platforms()->where('platform_id', $platform->id)->first();
            return [
                'id' => $platform->id,
                'name' => $platform->name,
                'is_active' => $pivot ? (bool) $pivot->pivot->is_active : false,
            ];
        });
    }
}