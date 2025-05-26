<?php
namespace App\Services;

class FileUploadService
{
    public function handleUpload($request, $folder = 'uploads')
    {

        $file = $request->file('file');
        $path = $file->store($folder, 'public');
        $url = asset('storage/' . $path);

        return [
            'message' => 'File uploaded successfully',
            'data' => ['url' => $url]
        ];
    }
}