<?php

namespace App\Console\Commands;

use App\Models\Post;
use App\Jobs\PublishPostJob;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class PublishScheduledPosts extends Command
{
    protected $signature = 'posts:publish-scheduled';
    protected $description = 'Publish posts scheduled for now or earlier';

    public function handle()
    {
        $now = now();
        $count = 0;

        Post::with('platforms') // Eager load platforms
            ->where('status', 'scheduled')
            ->where('scheduled_time', '<=', $now)
            ->chunk(100, function ($posts) use (&$count) {
                foreach ($posts as $post) {
                    PublishPostJob::dispatch($post); // Send to queue
                    $count++;
                }
            });

        Log::info("Dispatched {$count} posts for publishing.");
        $this->info("Dispatched {$count} posts.");
    }
}