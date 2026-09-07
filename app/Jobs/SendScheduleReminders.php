<?php

namespace App\Jobs;

use App\Mail\ScheduleReminderMail;
use App\Models\LearningSession;
use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendScheduleReminders implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Find sessions happening in the next 24 hours
        $now = now();
        $nextDay = $now->copy()->addDay();

        $sessions = LearningSession::where('status', 'akan-datang')
            ->whereBetween('date', [$now->toDateString(), $nextDay->toDateString()])
            ->with(['user'])
            ->get();

        foreach ($sessions as $session) {
            // Check if already sent a notification
            $existing = Notification::where('learning_session_id', $session->id)
                ->where('user_id', $session->user_id)
                ->where('type', 'schedule_reminder')
                ->exists();

            if ($existing) {
                continue;
            }

            $hoursUntil = $session->date->diffInHours($now);

            if ($hoursUntil > 0 && $hoursUntil <= 24) {
                try {
                    // Send email
                    Mail::send(new ScheduleReminderMail(
                        user: $session->user,
                        session: $session,
                        hoursUntil: $hoursUntil,
                    ));

                    // Create in-app notification
                    Notification::create([
                        'user_id' => $session->user_id,
                        'learning_session_id' => $session->id,
                        'type' => 'schedule_reminder',
                        'title' => "Reminder: {$session->title}",
                        'message' => "Sesi pembelajaran Anda '{$session->title}' akan dimulai dalam {$hoursUntil} jam.",
                        'data' => [
                            'session_id' => $session->id,
                            'session_title' => $session->title,
                            'hours_until' => $hoursUntil,
                        ],
                        'sent_at' => now(),
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Failed to send schedule reminder', [
                        'session_id' => $session->id,
                        'user_id' => $session->user_id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        }
    }
}
