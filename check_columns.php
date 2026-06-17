<?php

use App\Models\Tenant;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Schema;

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

$tenant = Tenant::latest()->first();
if ($tenant) {
    tenancy()->initialize($tenant);
    $columns = Schema::getColumnListing('produit_categories');
    print_r($columns);
    echo "\n";
} else {
    echo "No tenant found\n";
}
