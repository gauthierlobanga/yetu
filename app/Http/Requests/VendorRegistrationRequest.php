<?php

// app/Http/Requests/VendorRegistrationRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class VendorRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            // Plan
            'plan_id' => ['required', 'exists:plans,id'],

            // Informations de base
            'shop_name' => [
                'required', 'string', 'min:3', 'max:100',
                Rule::unique('tenants', 'raison_sociale'),
            ],
            'shop_slug' => [
                'required', 'string', 'min:3', 'max:50',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('tenants', 'slug'),
                Rule::unique('vendor_requests', 'shop_slug'),
            ],
            'shop_description' => ['nullable', 'string', 'max:500'],

            // Contact
            'contact_email' => ['required', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:20'],

            // Localisation & préférences
            'currency' => ['nullable', 'string', 'max:3'],
            'language' => ['nullable', 'string', 'max:5'],

            // Logo
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'],

            // Réseaux sociaux
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'twitter_url' => ['nullable', 'url', 'max:255'],
            'youtube_url' => ['nullable', 'url', 'max:255'],
            'tiktok_url' => ['nullable', 'url', 'max:255'],

            // ✅ Documents légaux (ajout)
            'documents' => ['nullable', 'array'],
            'documents.*.type_document_id' => [
                'required', 'uuid', 'exists:type_documents_legaux,id',
            ],
            'documents.*.numero_document' => ['nullable', 'string', 'max:100'],
            'documents.*.date_delivrance' => ['nullable', 'date', 'before_or_equal:today'],
            'documents.*.date_expiration' => ['nullable', 'date', 'after:documents.*.date_delivrance'],
            'documents.*.lieu_delivrance' => ['nullable', 'string', 'max:255'],
            'documents.*.autorite_delivrance' => ['nullable', 'string', 'max:255'],

            // Conditions
            'accept_terms' => ['required', 'accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'shop_name.required' => 'Le nom de la boutique est requis.',
            'shop_name.unique' => 'Ce nom de boutique est déjà utilisé.',
            'shop_slug.required' => 'Le sous-domaine est requis.',
            'shop_slug.regex' => 'Le sous-domaine ne peut contenir que des lettres minuscules, chiffres et tirets.',
            'shop_slug.unique' => 'Ce sous-domaine est déjà utilisé.',
            'contact_email.required' => "L'email de contact est requis.",
            'accept_terms.accepted' => 'Vous devez accepter les conditions générales.',
            'documents.*.type_document_id.required' => 'Le type de document est requis.',
            'documents.*.type_document_id.exists' => "Le type de document sélectionné n'existe pas.",
            'documents.*.date_expiration.after' => "La date d'expiration doit être postérieure à la date de délivrance.",
            'documents.*.date_delivrance.before_or_equal' => 'La date de délivrance ne peut pas être dans le futur.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'shop_slug' => strtolower($this->shop_slug),
        ]);
    }
}
