<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\Controller;
use App\Http\Requests\VendorRegistrationRequest;
use App\Models\Plan;
use App\Models\Tenant;
use App\Models\TypeDocumentLegal;
use App\Services\VendorRegistrationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Nnjeim\World\Models\Currency;
use Nnjeim\World\Models\Language;

class VendorRegistrationController extends Controller
{
    public function __construct(
        private readonly VendorRegistrationService $vendorService
    ) {}

    /**
     * Étape 1 : Choix du plan.
     */
    public function vendeurIndex()
    {
        $user = Auth::user();

        if ($tenant = $user->tenants()->wherePivot('is_owner', true)->first()) {
            return redirect()->away($this->vendorService->getVendeurUrl($tenant));
        }

        $plans = Plan::active()->ordered()->get()->map(fn ($plan) => [
            'id' => $plan->id,
            'name' => $plan->name,
            'description' => $plan->description,
            'highlight' => $plan->highlight,
            'price' => $plan->price,
            'currency' => $plan->currency,
            'interval' => $plan->interval,
            'trial_days' => $plan->trial_days,
            'is_featured' => $plan->is_featured,
            'is_recommended' => $plan->is_recommended,
            'features' => $plan->features,
            'limits' => $plan->limits,
            'badge' => $plan->badge,
            'badge_color' => $plan->badge_color,
            'button_text' => $plan->button_text,
        ]);

        return Inertia::render('Vendor/Plans', [
            'plans' => $plans,
            'canBecomeVendor' => $this->vendorService->canBecomeVendor($user),
        ]);
    }

    /**
     * Étape 2 : Configuration de la boutique.
     */
    public function vendeurConfigure(Request $request)
    {
        $planId = $request->input('plan_id') ?? session('selected_plan_id');

        if (! $planId) {
            return redirect()->route('vendor.register')->with('error', 'Veuillez sélectionner un plan.');
        }

        session(['selected_plan_id' => $planId]);

        $plan = Plan::findOrFail($planId);

        // Récupérer les devises depuis nnjeim/world
        $currencies = Currency::select('code', 'symbol', 'name')
            ->orderBy('code')
            ->get()
            ->map(fn ($c) => [
                'code' => $c->code,
                'symbol' => $c->symbol,
                'name' => $c->name,
            ]);

        // Récupérer les langues depuis nnjeim/world
        $languages = Language::select('code', 'name')
            ->orderBy('name')
            ->get()
            ->map(fn ($l) => [
                'code' => $l->code,
                'name' => $l->name,
                'flag' => $this->getFlagEmoji($l->code),
            ]);

        // Récupérer les types de documents légaux
        $documentTypes = TypeDocumentLegal::orderBy('ordre', 'asc')
            ->get()
            ->map(fn ($doc) => [
                'id' => $doc->id,
                'code' => $doc->code,
                'nom' => $doc->nom,
                'description' => $doc->description,
                'est_obligatoire' => $doc->est_obligatoire,
            ]);

        return Inertia::render('Vendor/Configure', [
            'plan' => [
                'id' => $plan->id,
                'name' => $plan->name,
                'formatted_price' => $plan->price > 0 ? $plan->formatted_price : 'Gratuit',
                'price' => $plan->price,
            ],
            'currencies' => $currencies,
            'languages' => $languages,
            'documentTypes' => $documentTypes,
        ]);
    }

    /**
     * Vérifier la disponibilité d'un domaine (retour JSON).
     */
    public function checkDomain(Request $request)
    {
        $request->validate(['slug' => 'required|string|min:3|max:63']);
        $slug = Str::lower(trim($request->slug));
        $service = $this->vendorService;

        // Nettoyage automatique
        $cleanedSlug = preg_replace('/[^a-z0-9-]/', '', $slug);
        $cleanedSlug = trim($cleanedSlug, '-');
        $cleanedSlug = preg_replace('/-+/', '-', $cleanedSlug);

        $formatErrors = $service->validateSlugFormat($cleanedSlug);
        $available = empty($formatErrors) && $service->isShopSlugAvailable($cleanedSlug);

        $suggestions = [];
        if (! $available && empty($formatErrors)) {
            $suggestions = $service->suggestAlternativeSlugs($cleanedSlug, 5);
        }

        return response()->json([
            'available' => $available,
            'cleaned_slug' => $cleanedSlug,
            'errors' => $formatErrors,
            'suggestions' => $suggestions,
        ]);
    }

    /**
     * Suggérer des domaines à partir du nom de la boutique.
     */
    public function suggestDomain(Request $request)
    {
        $request->validate(['shop_name' => 'required|string|min:2']);
        $shopName = $request->shop_name;
        $service = $this->vendorService;

        // Génération de variantes
        $baseSlug = Str::slug($shopName);
        $variants = $this->generateDomainVariants($baseSlug);

        $suggestions = [];
        foreach ($variants as $variant) {
            if ($service->isShopSlugAvailable($variant)) {
                $suggestions[] = [
                    'slug' => $variant,
                    'domain' => $variant.'.'.config('app.domain'),
                ];
                if (count($suggestions) >= 5) {
                    break;
                }
            }
        }

        return response()->json(['suggestions' => $suggestions]);
    }

    private function generateDomainVariants(string $baseSlug): array
    {
        $variants = [$baseSlug];
        $prefixes = ['shop', 'store', 'boutique', 'mon', 'my'];
        $suffixes = ['shop', 'store', 'boutique', 'online', 'cd', 'rdc'];
        foreach ($prefixes as $p) {
            $variants[] = $p.'-'.$baseSlug;
        }
        foreach ($suffixes as $s) {
            $variants[] = $baseSlug.'-'.$s;
        }

        return array_unique($variants);
    }

    /**
     * Étape 3 : Soumettre la demande.
     */
    public function vendeurStore(VendorRegistrationRequest $request)
    {
        $user = Auth::user();
        $plan = Plan::findOrFail($request->plan_id);

        if (! $this->vendorService->canBecomeVendor($user)) {
            return back()->with('error', 'Vous avez déjà une demande en cours.');
        }

        if (! $this->vendorService->isShopSlugAvailable($request->shop_slug)) {
            return back()->withErrors(['shop_slug' => 'Ce sous-domaine est déjà utilisé.']);
        }

        $vendorRequest = $this->vendorService->initiateRegistration($user, $request->validated());
        session()->forget('selected_plan_id');

        if ($plan->price > 0) {
            session(['vendor_request_id' => $vendorRequest->id]);

            return redirect()->route('vendor.payment');
        }

        $tenant = $this->vendorService->approve($vendorRequest);

        // Au lieu de renvoyer directement la vue, on redirige vers la route de succès
        return redirect()->route('vendor.success', ['tenant' => $tenant->slug]);
    }

    /**
     * Page de succès après approbation du vendeur.
     *
     * @return void
     */
    public function vendeurSuccess(Tenant $tenant)
    {
        return Inertia::render('Vendor/Success', [
            'tenant' => [
                'id' => $tenant->id,
                'raison_sociale' => $tenant->raison_sociale,
                'slug' => $tenant->slug,
                'url' => $this->vendorService->getShopUrl($tenant),
                'admin_url' => $this->vendorService->getVendeurUrl($tenant),
            ],
        ]);
    }

    private function getFlagEmoji(string $code): string
    {
        $flags = [
            'fr' => '🇫🇷', 'en' => '🇬🇧', 'es' => '🇪🇸', 'de' => '🇩🇪',
            'it' => '🇮🇹', 'pt' => '🇵🇹', 'nl' => '🇳🇱', 'ar' => '🇸🇦',
            'sw' => '🇹🇿', 'ln' => '🇨🇩', 'rw' => '🇷🇼', 'pt-BR' => '🇧🇷',
        ];

        return $flags[$code] ?? '🌐';
    }
}
