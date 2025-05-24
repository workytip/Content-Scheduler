<?php

namespace App\Models;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Platform extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'type',
    ];

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'platform_post')
            ->withPivot('platform_status')
            ->withTimestamps();
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_platform')
            ->withPivot('is_active')
            ->withTimestamps();
    }
}
