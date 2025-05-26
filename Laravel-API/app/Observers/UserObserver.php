<?php

namespace App\Observers;

class UserObserver
{
    //
    public function created($user)
    {
        activity()
            ->causedBy($user)
            ->log('User created: ' . $user->name);
    }
    
    public function updated($user)
    {
        activity()
            ->causedBy($user)
            ->log('User updated: ' . $user->name);
    }


}
