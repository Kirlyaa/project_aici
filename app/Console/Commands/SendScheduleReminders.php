<?php

namespace App\Console\Commands;

use App\Jobs\SendScheduleReminders as SendScheduleRemindersJob;
use Illuminate\Console\Command;

class SendScheduleReminders extends Command
{
    protected $signature = 'reminders:send-schedule';

    protected $description = 'Send schedule reminders to students for upcoming sessions (24 hours before)';

    public function handle(): int
    {
        $this->info('Sending schedule reminders...');

        SendScheduleRemindersJob::dispatch();

        $this->info('Schedule reminders dispatched successfully!');

        return Command::SUCCESS;
    }
}
