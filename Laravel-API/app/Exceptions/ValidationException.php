<?php

namespace App\Exceptions;

use Exception;

class ValidationException extends Exception
{
    protected $message = 'Validation error';
    protected $errors;

    public function __construct($errors)
    {
        $this->errors = $errors;
        parent::__construct($this->message);
    }

    public function getErrors()
    {
        return $this->errors;
    }
}