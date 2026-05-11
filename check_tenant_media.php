<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Médias dans la connexion par défaut (pgsql):\n";
$defaultMedia = \App\Models\Media::on('pgsql')->get();
echo "Nombre: " . $defaultMedia->count() . "\n\n";

echo "Médias dans la connexion tenant:\n";
try {
    $tenantMedia = \App\Models\Media::on('tenant')->get();
    echo "Nombre: " . $tenantMedia->count() . "\n\n";
} catch (\Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n\n";
}

echo "Médias sans connexion spécifique:\n";
$allMedia = \App\Models\Media::all();
echo "Nombre: " . $allMedia->count() . "\n";
