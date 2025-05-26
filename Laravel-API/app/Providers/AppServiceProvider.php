<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        // Register the observers for the User and Post models
        \App\Models\User::observe(\App\Observers\UserObserver::class);
        \App\Models\Post::observe(\App\Observers\PostObserver::class);
    }
}
