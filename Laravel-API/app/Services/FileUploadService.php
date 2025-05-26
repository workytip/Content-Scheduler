<?php
namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;

class FileUploadService
{
    public function handleUpload($request, $folder = 'uploads')
    {
        try {
            $file = $request->file('file');
            $path = $file->store($folder, 'public');
            $url = asset('storage/' . $path);

            return [
                'message' => Config::get('messages.file.upload_success', 'File uploaded successfully.'),
                'data' => ['url' => $url]
            ];
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return [
                'message' => Config::get('messages.file.upload_failed', 'File upload failed.'),
                'data' => null
            ];
        }
    }
}