<?php

namespace App\Observers;

use App\Models\Post;

class PostObserver
{
    //
    public function created(Post $post)
    {
       activity()
        ->causedBy(auth()->user())
        ->performedOn($post)
        ->withProperties([
            'title' => $post->title,])
        ->log('Created post');
    }

    public function updated(Post $post)
    {
        activity()
            ->causedBy(auth()->user())
            ->performedOn($post)
             ->withProperties([
            'title' => $post->title,])
            ->log('Updated post');
    }

    public function deleted(Post $post)
    {
        activity()
            ->causedBy(auth()->user())
            ->performedOn($post)
             ->withProperties([
            'title' => $post->title,])
            ->log('Deleted post');
    }
}
