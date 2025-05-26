<?php

namespace App\Services;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;

class UserService
{
    public function updateUser(User $user, array $validated)
    {
        try {
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->image_url = $validated['imageUrl'] ?? $user->image_url;
            if (!empty($validated['password'])) {
                $user->password = bcrypt($validated['password']);
            }
            $user->save();
            return $user;
        } catch (Exception $e) {
            Log::error($e->getMessage());
            throw new Exception(Config::get('messages.user.failed_to_update', 'Failed to update user.'));
        }
    }

    public function deleteUser(User $user)
    {
        try {
            $user->delete();
        } catch (Exception $e) {
            Log::error($e->getMessage());
            throw new Exception(Config::get('messages.user.failed_to_delete', 'Failed to delete user.'));
        }
    }
}