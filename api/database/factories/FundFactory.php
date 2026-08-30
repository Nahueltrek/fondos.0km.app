<?php

namespace Database\Factories;

use App\Models\Fund;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Fund>
 */
class FundFactory extends Factory
{
    public function definition(): array
    {
        $name = 'Fondo de prueba '.$this->faker->unique()->numberBetween(1, 100000);

        return [
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name),
            'institution' => 'Institución de prueba',
            'description' => $this->faker->sentence(),
            'regions' => ['Región Metropolitana'],
            'categories' => ['Tecnología'],
            'status' => 'abierto',
            'verification_status' => 'pending',
        ];
    }
}
