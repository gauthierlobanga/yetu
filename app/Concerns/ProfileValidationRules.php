<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>>
     */
     protected function profileRules(int|string|null $userId = null): array
    {
        return [
            'name'    => $this->nameRules(),
            'email'   => $this->emailRules($userId),
            'avatar'  => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:2048'],
            // Nouveaux champs
            'phone'   => ['nullable', 'string', 'max:20'],
            'city'    => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'locale'  => ['nullable', 'string', 'in:fr,en,es'],
            'currency'=> ['nullable', 'string', 'in:XOF,EUR,USD'],
            'notifications_email'  => ['nullable', 'boolean'],
            'notifications_offers' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function emailRules(int|string|null $userId = null): array
    {
        $uniqueRule = $userId === null
            ? Rule::unique(User::class)
            : Rule::unique(User::class)->ignore($userId);

        // Supprimez complètement le bloc avec ->connection()
        // Le modèle User utilise déjà la bonne connexion (centrale ou tenant)

        return [
            'required',
            'string',
            'email',
            'max:255',
            $uniqueRule,
        ];
    }
}
