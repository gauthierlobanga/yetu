<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Détails des médias:\n\n";
$medias = \App\Models\Media::all();

foreach ($medias as $media) {
    echo "ID: {$media->id}\n";
    echo "Nom: {$media->name}\n";
    echo "Disk: {$media->disk}\n";
    echo "MIME Type: {$media->mime_type}\n";
    echo "Collection: {$media->collection_name}\n";
    echo "Créé le: {$media->created_at}\n";
    echo "---\n";
}
