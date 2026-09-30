<?php

namespace App\Providers;

use App\Models\GradeEntry;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\StudentComment;
use App\Models\User;
use App\Observers\ActivityObserver;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
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
        Vite::prefetch(concurrency: 3);

        if (config('app.env') === 'production' || env('FORCE_HTTPS', false)) {
            URL::forceScheme('https');
        }

        // Register activity logging observers
        User::observe(ActivityObserver::class);
        Module::observe(ActivityObserver::class);
        GradeEntry::observe(ActivityObserver::class);
        LearningSession::observe(ActivityObserver::class);
        StudentComment::observe(ActivityObserver::class);
    }
}
