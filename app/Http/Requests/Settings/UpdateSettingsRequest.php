<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        // L’autorisation fine est déjà faite dans le contrôleur
        return true;
    }

    public function rules(): array
    {
        $centralConnection = config('tenancy.database.central_connection', config('database.default'));

        return [
            'raison_sociale' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('tenants', 'email', $centralConnection)
                    ->ignore(tenant()->id),
            ],
            'telephone' => ['nullable', 'string', 'max:30'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
            'forme_juridique' => ['required', 'string', Rule::in([
                'toutes',
                'societe_commerciale',
                'petit_commercant',
                'organisation_sans_but_lucratif',
            ])],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'twitter_url' => ['nullable', 'url', 'max:255'],
            'youtube_url' => ['nullable', 'url', 'max:255'],
            'tiktok_url' => ['nullable', 'url', 'max:255'],
            'remove_logo' => ['nullable', 'boolean'],
            'documents' => ['nullable', 'array'],
            'documents.*.type_document_id' => [
                'required',
                Rule::exists('type_documents_legaux', 'id', $centralConnection),
            ],
            'documents.*.numero_document' => ['nullable', 'string', 'max:255'],
            'documents.*.date_delivrance' => ['nullable', 'date'],
            'documents.*.date_expiration' => ['nullable', 'date', 'after_or_equal:documents.*.date_delivrance'],
            'documents.*.lieu_delivrance' => ['nullable', 'string', 'max:255'],
            'documents.*.autorite_delivrance' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'raison_sociale.required' => 'Le nom de la boutique est obligatoire.',
            'raison_sociale.max' => 'Le nom de la boutique ne doit pas dépasser 255 caractères.',
            'description.max' => 'La description ne doit pas dépasser 500 caractères.',
            'email.required' => 'L\'adresse email est obligatoire.',
            'email.email' => 'Veuillez fournir une adresse email valide.',
            'email.unique' => 'Cette adresse email est déjà utilisée par une autre boutique.',
            'email.max' => 'L\'adresse email ne doit pas dépasser 255 caractères.',
            'telephone.max' => 'Le numéro de téléphone ne doit pas dépasser 30 caractères.',
            'logo.image' => 'Le logo doit être une image.',
            'logo.mimes' => 'Le logo doit être au format : jpeg, png ou webp.',
            'logo.max' => 'Le logo ne doit pas dépasser 2 Mo.',
            'forme_juridique.required' => 'La forme juridique est obligatoire.',
            'forme_juridique.in' => 'La forme juridique sélectionnée n\'est pas valide.',
            'facebook_url.url' => 'L\'URL Facebook n\'est pas valide.',
            'instagram_url.url' => 'L\'URL Instagram n\'est pas valide.',
            'twitter_url.url' => 'L\'URL Twitter n\'est pas valide.',
            'youtube_url.url' => 'L\'URL YouTube n\'est pas valide.',
            'tiktok_url.url' => 'L\'URL TikTok n\'est pas valide.',
            'documents.*.type_document_id.required' => 'Le type de document est obligatoire.',
            'documents.*.type_document_id.exists' => 'Le type de document sélectionné n\'existe pas.',
            'documents.*.numero_document.max' => 'Le numéro de document ne doit pas dépasser 255 caractères.',
            'documents.*.date_delivrance.date' => 'La date de délivrance n\'est pas valide.',
            'documents.*.date_expiration.date' => 'La date d\'expiration n\'est pas valide.',
            'documents.*.date_expiration.after_or_equal' => 'La date d\'expiration doit être postérieure ou égale à la date de délivrance.',
            'documents.*.lieu_delivrance.max' => 'Le lieu de délivrance ne doit pas dépasser 255 caractères.',
            'documents.*.autorite_delivrance.max' => 'L\'autorité de délivrance ne doit pas dépasser 255 caractères.',
        ];
    }
}
