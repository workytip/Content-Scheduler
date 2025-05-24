<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformPost extends Model
{
    use HasFactory;
    protected $fillable = [
        'platform_id',
        'post_id',
        'platform_status',
    ];
    
    protected $table = 'platform_post';

}
