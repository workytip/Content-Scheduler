<?php

namespace App\Jobs;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class PublishPostJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Post $post) {}

    public function handle()
    {
        $successCount = 0;
        foreach ($this->post->platforms as $platform) {
            try {
                $this->validateForPlatform($platform);

                // Mark as published
                $this->post->platforms()->updateExistingPivot($platform->id, ['platform_status' => 'published']);

                Log::channel('platform_publishing')->info(
                    "Mock: Successfully published post {$this->post->title} wiht ID {$this->post->id} on {$platform->name}",
                    [
                        'time' => now()->toISOString(),
                        'platform' => $platform->name,
                        'post_length' => strlen($this->post->content),
                        'status' => 'published'
                    ]
                );
                $successCount++;
            } catch (\Exception $e) {
                $this->post->platforms()->updateExistingPivot($platform->id, ['platform_status' => 'failed']);
                Log::channel('platform_publishing')->error(
                    "Mock: Failed to publish post  {$this->post->title} wiht ID {$this->post->id} on {$platform->name}",
                    [
                        'error' => $e->getMessage(),
                        'platform_rules' => $this->getPlatformRules($platform)
                    ]
                );
            }
        }
        $postStatus = ($successCount > 0) ? 'published' : 'scheduled';
        $this->post->update(['status' => $postStatus]);
    }

    // Mock platform validation
    protected function validateForPlatform($platform)
    {
        return match ($platform->name) {
            'twitter' => $this->validateTwitter(),
            'linkedin' => $this->validateLinkedIn(),
            'facebook' => $this->validateFacebook(),
            'instagram' => $this->validateInstagram(),
            'tiktok' => $this->validateTikTok(),
            default => true,
        };
    }

    protected function validateTwitter()
    {
        if (strlen($this->post->content) > 280) {
            throw new \Exception("Twitter: Exceeds 280-character limit");
        }
    }

    protected function validateLinkedIn()
    {
        if (strlen($this->post->content) > 3000) {
            throw new \Exception("LinkedIn: Exceeds 3,000-character limit");
        }
    }

    protected function validateFacebook()
    {
        if (strlen($this->post->content) > 63206) {
            throw new \Exception("Facebook: Exceeds 63,206-character limit");
        }
    }

    protected function validateInstagram()
    {
        if (empty($this->post->image_url)) {
            throw new \Exception("Instagram: Image required");
        }
    }
    protected function validateTikTok()
    {
        if (empty($this->post->image_url)) {
            throw new \Exception("TikTok: Image required");
        }
    }

    // Returns platform-specific rules for logging purposes
    protected function getPlatformRules($platform)
    {
        $rules = [];
        if ($platform->type === 'twitter') {
            $rules[] = 'Max 280 characters';
        }
        if ($platform->type === 'linkedin') {
            $rules[] = 'Max 3,000 characters';
        }
        if ($platform->type === 'facebook') {
            $rules[] = 'Max 63,206 characters';
        }
        if ($platform->type === 'instagram') {
            $rules[] = 'Image required';
        }
        if ($platform->type === 'tiktok') {
            $rules[] = 'Image required';
        }
        return $rules;
    }
}
