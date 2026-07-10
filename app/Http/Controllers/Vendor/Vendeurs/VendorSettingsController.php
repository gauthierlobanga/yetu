<?php

namespace App\Http\Controllers\Vendor\Vendeurs;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\TenantDocumentLegal;
use App\Models\TypeDocumentLegal;
use App\Services\TenantPropsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Throwable;

class VendorSettingsController extends Controller
{
    /**
     * Affiche le formulaire des paramètres de la boutique.
     */
    public function edit(TenantPropsService $tenantProps)
    {
        $user = Auth::user();
        $tenant = $this->resolveOwnedTenant($user);

        if (! $tenant) {
            abort(403);
        }

        $documentTypes = tenancy()->central(function () {
            return TypeDocumentLegal::orderBy('ordre', 'asc')->get();
        });

        $existingDocuments = tenancy()->central(function () use ($tenant) {
            $tenant->load('documentsLegaux');
            $docs = [];
            foreach ($tenant->documentsLegaux as $doc) {
                $docs[$doc->pivot->type_document_id] = [
                    'type_document_id' => $doc->pivot->type_document_id,
                    'numero_document' => $doc->pivot->numero_document,
                    'date_delivrance' => $doc->pivot->date_delivrance instanceof Carbon
                        ? $doc->pivot->date_delivrance->format('Y-m-d')
                        : $doc->pivot->date_delivrance,
                    'date_expiration' => $doc->pivot->date_expiration instanceof Carbon
                        ? $doc->pivot->date_expiration->format('Y-m-d')
                        : $doc->pivot->date_expiration,
                    'lieu_delivrance' => $doc->pivot->lieu_delivrance,
                    'autorite_delivrance' => $doc->pivot->autorite_delivrance,
                ];
            }

            return $docs;
        });

        return Inertia::render('Vendor/Settings', [
            'tenant' => $tenantProps->getTenantProps($tenant),
            'documentTypes' => $documentTypes,
            'existingDocuments' => $existingDocuments,
        ]);
    }

    /**
     * Met à jour les informations de la boutique.
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $tenant = $this->resolveOwnedTenant($user);
        if (! $tenant) {
            abort(403);
        }

        // Validation en contexte central
        // Nettoyage des fichiers "null" envoyés par FormData
        $documents = $request->input('documents', []);
        if (is_array($documents)) {
            foreach ($documents as $key => $doc) {
                if (isset($doc['file']) && $doc['file'] === 'null') {
                    $documents[$key]['file'] = null;
                }
            }
            $request->merge(['documents' => $documents]);
        }

        $validated = tenancy()->central(function () use ($request, $tenant) {
            return $request->validate([
                'raison_sociale' => ['required', 'string', 'max:255'],
                'description' => ['nullable', 'string', 'max:500'],
                'email' => [
                    'required',
                    'email',
                    'max:255',
                    Rule::unique('tenants', 'email')->ignore($tenant->id),
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
                'address' => ['nullable', 'string', 'max:255'],
                'tiktok_url' => ['nullable', 'url', 'max:255'],
                'remove_logo' => ['nullable', 'boolean'],
                'documents' => ['nullable', 'array'],
                'documents.*.type_document_id' => [
                    'required',
                    'exists:type_documents_legaux,id',
                ],
                'documents.*.numero_document' => ['nullable', 'string', 'max:255'],
                'documents.*.date_delivrance' => ['nullable', 'date'],
                'documents.*.date_expiration' => ['nullable', 'date', 'after_or_equal:documents.*.date_delivrance'],
                'documents.*.lieu_delivrance' => ['nullable', 'string', 'max:255'],
                'documents.*.autorite_delivrance' => ['nullable', 'string', 'max:255'],
            ], [
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
                'address.max' => 'L\'adresse ne doit pas dépasser :max caractères.',
                'documents.*.type_document_id.required' => 'Le type de document est obligatoire.',
                'documents.*.type_document_id.exists' => 'Le type de document sélectionné n\'existe pas.',
                'documents.*.numero_document.max' => 'Le numéro de document ne doit pas dépasser 255 caractères.',
                'documents.*.date_delivrance.date' => 'La date de délivrance n\'est pas valide.',
                'documents.*.date_expiration.date' => 'La date d\'expiration n\'est pas valide.',
                'documents.*.date_expiration.after_or_equal' => 'La date d\'expiration doit être postérieure ou égale à la date de délivrance.',
                'documents.*.lieu_delivrance.max' => 'Le lieu de délivrance ne doit pas dépasser 255 caractères.',
                'documents.*.autorite_delivrance.max' => 'L\'autorité de délivrance ne doit pas dépasser 255 caractères.',
            ]);
        });

        // Sauvegarde du tenant sur la connexion centrale
        tenancy()->central(function () use ($tenant, $validated) {
            $centralTenant = Tenant::findOrFail($tenant->id);

            $centralTenant->raison_sociale = $validated['raison_sociale'];
            $centralTenant->description = $validated['description'] ?? null;
            $centralTenant->email = $validated['email'];
            $centralTenant->telephone = $validated['telephone'] ?? null;
            $centralTenant->type_entite = $validated['forme_juridique'];

            $centralTenant->setConfiguration('facebook_url', $validated['facebook_url'] ?? null);
            $centralTenant->setConfiguration('instagram_url', $validated['instagram_url'] ?? null);
            $centralTenant->setConfiguration('twitter_url', $validated['twitter_url'] ?? null);
            $centralTenant->setConfiguration('youtube_url', $validated['youtube_url'] ?? null);
            $centralTenant->setConfiguration('tiktok_url', $validated['tiktok_url'] ?? null);
            $centralTenant->setConfiguration('address', $validated['address'] ?? null);

            $centralTenant->save();
        });

        // Logo
        if ($request->hasFile('logo') || $request->boolean('remove_logo')) {
            $this->replaceLogo($tenant, $request);
        }

        // Documents légaux
        if ($request->has('documents')) {
            tenancy()->central(function () use ($request, $tenant) {
                foreach ($request->documents as $docData) {
                    if (empty($docData['numero_document'])) {
                        TenantDocumentLegal::where('tenant_id', $tenant->id)
                            ->where('type_document_id', $docData['type_document_id'])
                            ->delete();

                        continue;
                    }

                    TenantDocumentLegal::updateOrCreate(
                        [
                            'tenant_id' => $tenant->id,
                            'type_document_id' => $docData['type_document_id'],
                        ],
                        [
                            'numero_document' => $docData['numero_document'],
                            'date_delivrance' => $docData['date_delivrance'] ?? null,
                            'date_expiration' => $docData['date_expiration'] ?? null,
                            'lieu_delivrance' => $docData['lieu_delivrance'] ?? null,
                            'autorite_delivrance' => $docData['autorite_delivrance'] ?? null,
                        ]
                    );
                }
            });

            // 🔄 Mise à jour du statut si tous les documents obligatoires sont maintenant fournis
            tenancy()->central(function () use ($tenant) {
                $centralTenant = Tenant::findOrFail($tenant->id);
                if ($centralTenant->statut === Tenant::STATUT_EN_ATTENTE && $centralTenant->documentsObligatoiresComplets()) {
                    $centralTenant->statut = Tenant::STATUT_ACTIF;
                    $centralTenant->save();
                }
            });
        }

        return Redirect::route('vendor.settings')->with('success', 'Paramètres mis à jour avec succès.');
    }

    // ─── Méthodes privées inchangées ───────────────────────
    private function resolveOwnedTenant($user): ?Tenant
    {
        $tenant = function_exists('tenant') ? tenant() : null;
        if (! $tenant || ! $user) {
            return null;
        }

        $ownsTenant = DB::connection($this->centralConnection())
            ->table('user_tenant')
            ->where('tenant_id', $tenant->id)
            ->where('user_id', $user->id)
            ->where('is_owner', true)
            ->exists();

        return $ownsTenant ? $tenant : null;
    }

    private function replaceLogo(Tenant $tenant, Request $request): void
    {
        $this->clearTenantScopedLogoArtifacts($tenant);

        tenancy()->central(function () use ($tenant, $request) {
            $centralTenant = Tenant::query()->findOrFail($tenant->id);
            $centralTenant->clearMediaCollection('tenant_avatar');

            if (! $request->hasFile('logo')) {
                return;
            }

            $file = $request->file('logo');
            $centralTenant
                ->addMedia($file)
                ->usingFileName('logo-'.$centralTenant->id.'-'.Str::uuid().'.'.$file->getClientOriginalExtension())
                ->toMediaCollection('tenant_avatar', 'public');
        });
    }

    private function clearTenantScopedLogoArtifacts(Tenant $tenant): void
    {
        if (! function_exists('tenancy') || ! tenancy()->initialized) {
            return;
        }
        try {
            $tenant->clearMediaCollection('tenant_avatar');
        } catch (Throwable) {
            //
        }
    }

    private function centralConnection(): string
    {
        return config('tenancy.database.central_connection', config('database.default'));
    }
}
