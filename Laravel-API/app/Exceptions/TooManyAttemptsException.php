<?php

namespace App\Exceptions;

use Exception;

class TooManyAttemptsException extends Exception
{
    protected $message = 'Too many login attempts. Please try again later.';
}