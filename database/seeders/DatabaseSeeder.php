<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        /** @var Tenant $tenant */
        $tenant = Tenant::query()->create([
            'id' => 'gratech',
        ]);

        $tenant->domains()->create([
            'domain' => 'gratech.localhost',
        ]);

        Tenant::all()->runForEach(function (Tenant $tenant) {
            User::factory()->create([
                'name' => 'Gratech',
                'email' => 'gratech@gmail.com',
            ]);
        });

    }
}
