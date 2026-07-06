<?php

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;

require 'vendor/autoload.php';
require 'bootstrap/app.php';
$app = app();
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

tenancy()->initialize('a21bfddb-7d62-4123-a5d4-697552c7c180');
$n = DB::table('notifications')->first();
var_dump($n);
