<?php

namespace App\Services;

use Exception;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\RateLimiter;
use App\Exceptions\TooManyAttemptsException;
use App\Exceptions\InvalidCredentialsException;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Log;

class AuthService
{
    protected $rateLimiter;
    protected $hash;
    protected $config;

    public function __construct(RateLimiter $rateLimiter, Hash $hash, Config $config)
    {
        $this->rateLimiter = $rateLimiter;
        $this->hash = $hash;
        $this->config = $config;
    }

    public function login($request)
    {
        $throttleKey = $this->getThrottleKey($request);

        $maxAttempts = 3;
        $decaySeconds = 60;

        try {
            $this->checkRateLimiting($throttleKey, $maxAttempts);

            $user = User::where('email', $request->email)->first();

            if ($user && $this->hash::check($request->password, $user->password)) {
                $tokenExpirationMinutes = $this->config::get('auth.token_expiration_time');
                $token = $user->createToken('authToken', ['*'], now()->addMinutes($tokenExpirationMinutes))->plainTextToken;

                return [
                    "message" => $this->config::get('messages.auth.login_success'),
                    'user' => $user,
                    'token' => $token,
                    'expires_in' => now()->addMinutes($tokenExpirationMinutes)->format('Y-m-d H:i:s'),
                    'status' => 200
                ];
            }

            $this->rateLimiter::hit($throttleKey, $decaySeconds);

            throw new InvalidCredentialsException($this->config::get('messages.auth.login_failed'));
        } catch (TooManyAttemptsException $e) {
            return [
                'message' => $e->getMessage(),
                'status' => 429
            ];
        } catch (InvalidCredentialsException $e) {
            return [
                'message' => $e->getMessage(),
                'status' => 422
            ];
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return [
                'message' => $this->config::get('messages.auth.login_error'),
                'status' => 500
            ];
        }
    }



    public function logout(Request $request)
    {
        try {
            //deleting current user token
            $request->user()->currentAccessToken()->delete();

            //deleting all user tokens
            //$request->user()->tokens()->delete();

            return ['message' => $this->config::get('messages.auth.logout_success'), 'status' => 200];
        } catch (Exception $e) {
            Log::error($e->getMessage());

            return [
                'message' => $this->config::get('messages.auth.logout_error'),
                'status' => 500
            ];
        }
    }

    public function register(array $validated)
    {
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
        $token = $user->createToken('auth_token')->plainTextToken;
        return [
            'token' => $token,
            'user' => $user,
            'status' => 201,
        ];
    }

    public function updatePassword(User $user, array $data)
    {
        if (!Hash::check($data['current_password'], $user->password)) {
            return [
                'error' => $this->config::get('messages.auth.login_failed'),
                'status' => 401,
            ];
        }

        $user->password = bcrypt($data['new_password']);
        $user->save();

        // activitylog
        activity()
            ->causedBy($user)
            ->withProperties([
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ])
            ->log('User password updated');

        return [
            'message' => $this->config::get('messages.user.updated'),
            'status' => 200,
        ];
    }

    /**
     * Generate a unique throttle key for the request.
     *
     * @param  \Illuminate\Http\Request|object  $request
     * @return string
     */
    protected function getThrottleKey(Request $request)
    {
        return Str::lower($request->input('email')) . '|' . $request->ip();
    }

    protected function checkRateLimiting($throttleKey, $maxAttempts)
    {
        if ($this->rateLimiter::tooManyAttempts($throttleKey, $maxAttempts)) {
            $seconds = $this->rateLimiter::availableIn($throttleKey);
            throw new TooManyAttemptsException(str_replace(':seconds', $seconds, $this->config::get('messages.auth.too_many_attempts')));
        }
    }
}
