<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'collection' => 'required|string|in:featured,gallery,attachments',
            'post_id' => 'nullable|exists:posts,id'
        ]);

        $file = $request->file('file');
        $collection = $request->collection;

        // Générer un nom unique
        $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs("temp/{$collection}", $fileName, 'public');

        // Retourner une réponse JSON pour Inertia
        return response()->json([
            'media' => [
                'id' => 'temp_' . Str::random(13),
                'url' => Storage::url($path),
                'thumb_url' => Storage::url($path),
                'medium_url' => Storage::url($path),
                'name' => $file->getClientOriginalName(),
                'file_name' => $fileName,
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'collection_name' => $collection,
                'temp_path' => $path,
            ]
        ]);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        if (Storage::disk('public')->exists($request->path)) {
            Storage::disk('public')->delete($request->path);
        }

        return response()->json(['success' => true]);
    }
}
