<?php

namespace App\Console\Commands;

use App\Models\TutorChat;
use Carbon\Carbon;
use Illuminate\Console\Command;

class PruneTutorChats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'chats:prune {--hours=120 : Hours after which chats should be deleted}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete tutor chats older than specified hours (default: 120 hours / 5 days)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $hours = (int) $this->option('hours');
        $cutoff = Carbon::now()->subHours($hours);

        $deletedCount = TutorChat::where('created_at', '<', $cutoff)->delete();

        $this->info("Successfully deleted {$deletedCount} tutor chat(s) older than {$hours} hours (before {$cutoff->toDateTimeString()}).");

        return Command::SUCCESS;
    }
}
