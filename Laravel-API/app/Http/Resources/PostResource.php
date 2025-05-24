<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'imageUrl' => $this->image_url,
            'scheduledTime' => $this->scheduled_time->format('Y-m-d H:i:s'),
            'status' => $this->status,
            'platforms' => $this->whenLoaded('platforms', function () {
                return $this->platforms->map(function ($platform) {
                    return [
                        'id' => $platform->id,
                        'name' => $platform->name,
                    ];
                });
            }),
        ];
    }
}
