<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule reminder emails every hour
Schedule::command('reminders:send-schedule')
    ->hourly()
    ->withoutOverlapping()
    ->name('send-schedule-reminders')
    ->onOneServer();
