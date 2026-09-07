<?php

namespace App\Mail;

use App\Models\LearningSession;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ScheduleReminderMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public LearningSession $session,
        public int $hoursUntil,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Reminder: Sesi Pembelajaran {$this->session->title} dalam {$this->hoursUntil} jam",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.schedule-reminder',
            with: [
                'user' => $this->user,
                'session' => $this->session,
                'hoursUntil' => $this->hoursUntil,
                'sessionUrl' => route('user.session.detail', $this->session->id),
            ],
        );
    }
}
