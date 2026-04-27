<?php

namespace Database\Factories;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Tenant>
 */
class TenantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $raison_sociale = fake()->company();

        return [
            'raison_sociale' => $raison_sociale,
            'slug' => Str::slug($raison_sociale),
            'statut' => Tenant::STATUT_ACTIF,
            'data' => null,
        ];
    }
}
