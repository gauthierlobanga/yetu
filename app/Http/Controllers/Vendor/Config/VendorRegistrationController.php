<?php

namespace App\Http\Controllers\Vendor\Config;

use App\Http\Controllers\Controller;
use App\Http\Requests\VendorRegistrationRequest;
use App\Jobs\ApproveVendorRequest;
use App\Models\Plan;
use App\Models\Tenant;
use App\Services\VendorRegistrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Nnjeim\World\Models\Country;
use Nnjeim\World\Models\Currency;
use Nnjeim\World\Models\Language;

/**
 * Contrôleur responsable de l'enregistrement et de la configuration des vendeurs.
 *
 * Permet aux utilisateurs de choisir un plan, de configurer leur boutique,
 * de vérifier la disponibilité d'un domaine et de valider leur inscription.
 */
class VendorRegistrationController extends Controller
{
    /**
     * Constructeur du contrôleur.
     *
     * @param  VendorRegistrationService  $vendorService  Service d'enregistrement des vendeurs.
     */
    public function __construct(
        private readonly VendorRegistrationService $vendorService
    ) {}

    /**
     * Étape 1 : Affiche la page de choix du plan d'abonnement.
     *
     * @return Response|RedirectResponse Vue Inertia pour la sélection du plan.
     */
    public function vendeurIndex()
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('central.login');
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
            'registrationStatus' => $this->vendorService->getVendorRegistrationStatus($user),
        ]);
    }

    /**
     * Étape 2 : Affiche la page de configuration de la boutique.
     *
     * Prépare les données nécessaires telles que les devises, les langues
     * et les indicatifs téléphoniques.
     *
     * @param  Request  $request  La requête contenant potentiellement l'identifiant du plan.
     * @return Response|RedirectResponse Vue Inertia de configuration ou redirection en cas d'erreur.
     */
    public function vendeurConfigure(Request $request)
    {
        $planId = $request->input('plan_id') ?? session('selected_plan_id');

        if (! $planId) {
            return redirect()->route('vendor.register')->with('error', 'Veuillez sélectionner un plan.');
        }

        session(['selected_plan_id' => $planId]);

        $plan = Plan::findOrFail($planId);

        // Devises depuis nnjeim/world
        $currencies = Currency::select('code', 'symbol', 'name')
            ->orderBy('code')
            ->get()
            ->unique('code')
            ->values()
            ->map(fn ($c) => [
                'code' => $c->code,
                'symbol' => $c->symbol,
                'name' => $c->name,
            ]);

        // Langues depuis nnjeim/world
        $languages = Language::select('code', 'name')
            ->orderBy('name')
            ->get()
            ->unique('code')
            ->values()
            ->map(fn ($l) => [
                'code' => $l->code,
                'name' => $l->name,
            ]);

        // Pays pour les codes téléphoniques (nnjeim/world)
        $countries = Country::select('id', 'iso2', 'name', 'phone_code')
            ->whereNotNull('phone_code')
            ->orderBy('name')
            ->get()
            ->map(fn ($c) => [
                'iso2' => strtolower($c->iso2),
                'name' => $c->name,
                'phone_code' => '+'.$c->phone_code,
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
            'countries' => $countries,
        ]);
    }

    /**
     * Vérifie la disponibilité d'un nom de domaine ou sous-domaine (slug).
     *
     * Nettoie le slug fourni, vérifie son format et s'il est déjà pris.
     * Si indisponible, propose des suggestions alternatives.
     *
     * @param  Request  $request  La requête contenant le 'slug'.
     * @return JsonResponse JSON contenant l'état de disponibilité, le slug nettoyé, les erreurs et suggestions.
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
     * Suggère des noms de domaine à partir d'un nom de boutique donné.
     *
     * Génère des variantes à partir du nom fourni et retourne celles qui sont disponibles.
     *
     * @param  Request  $request  La requête contenant 'shop_name'.
     * @return JsonResponse JSON contenant les suggestions de slugs.
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

    /**
     * Génère des variantes de nom de domaine.
     *
     * Combine un slug de base avec des préfixes et des suffixes communs.
     *
     * @param  string  $baseSlug  Le slug de base à partir duquel générer les variantes.
     * @return array Un tableau contenant des variantes de domaine uniques.
     */
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
     * Enregistre la demande de création d'une boutique (Tenant).
     *
     * Valide les données soumises, vérifie le slug, initie la demande en base,
     * attache un logo s'il est présent, et déclenche le Job d'approbation asynchrone.
     *
     * @param  VendorRegistrationRequest  $request  Requête form request validant les informations soumises.
     * @return RedirectResponse Retourne vers la page précédente avec l'identifiant de la demande en cours.
     */
    public function vendeurStore(VendorRegistrationRequest $request)
    {
        $user = Auth::user();
        $plan = Plan::findOrFail($request->plan_id);

        $status = $this->vendorService->getVendorRegistrationStatus($user);
        if (! $status['can_register']) {
            return back()->with('error', 'Vous avez déjà une demande en cours.');
        }

        if (! $this->vendorService->isShopSlugAvailable($request->shop_slug)) {
            return back()->withErrors(['shop_slug' => 'Ce sous-domaine est déjà utilisé.']);
        }

        // Initier la demande de boutique avec les informations essentielles.
        $vendorRequest = $this->vendorService->initiateRegistration($user, $request->validated());
        session()->forget('selected_plan_id');

        // Sauvegarder le logo temporairement dans la VendorRequest
        if ($request->hasFile('logo')) {
            $vendorRequest->addMediaFromRequest('logo')->toMediaCollection('tenant_avatar');
        }

        // Dispatcher le job de création (processus lourd)
        ApproveVendorRequest::dispatch($vendorRequest);

        // On retourne sur la même page avec les infos pour le polling
        return back()->with([
            'pending_vendor_request_id' => $vendorRequest->id,
            'target_dashboard_url' => $this->vendorService->getVendeurDashboardUrlBySlug($request->shop_slug),
        ]);
    }

    /**
     * Affiche la page de succès après l'approbation du vendeur.
     *
     * @param  Tenant  $tenant  L'instance du tenant (boutique) approuvé.
     * @return Response Vue Inertia affichant les détails du succès et les liens vers le tableau de bord.
     */
    public function vendeurSuccess(Tenant $tenant)
    {
        if ((string) $tenant->user_id !== (string) Auth::id()) {
            abort(403);
        }

        return Inertia::render('Vendor/Success', [
            'tenant' => [
                'id' => $tenant->id,
                'raison_sociale' => $tenant->raison_sociale,
                'slug' => $tenant->slug,
                'url' => $this->vendorService->getShopUrl($tenant),
                'admin_url' => $this->vendorService->getVendeurUrl($tenant),
                'logo_url' => $tenant->logo_url,
                'dashboard_url' => $this->vendorService->getVendeurDashboardUrl($tenant),
            ],
        ]);
    }
}
