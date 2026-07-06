<?php
require 'vendor/autoload.php';
require 'bootstrap/app.php';
$app = app();
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

tenancy()->initialize('a21bfddb-7d62-4123-a5d4-697552c7c180');
$user = \App\Models\User::first();
echo "User ID: " . $user->id . "\n";
echo "Class: " . get_class($user) . "\n";

$count = \Illuminate\Support\Facades\DB::table('notifications')
    ->where('notifiable_id', $user->id)
    ->where('notifiable_type', get_class($user))
    ->count();

echo "Count: " . $count . "\n";
