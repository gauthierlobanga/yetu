<?php

namespace App\Ai\Agents;

use App\Ai\Tools\CreateDiscount;
use App\Ai\Tools\GetAbandonedCarts;
use App\Ai\Tools\GetCart;
use App\Ai\Tools\GetCustomerStats;
use App\Ai\Tools\GetLowStockProducts;
use App\Ai\Tools\GetOrders;
use App\Ai\Tools\GetRevenueStats;
use App\Ai\Tools\GetStats;
use App\Ai\Tools\GetTopProducts;
use App\Ai\Tools\SearchProducts;
use App\Models\Tenant;
// use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Promptable;

// #[Provider(Lab::Gemini)]
// #[Provider(Lab::DeepSeek)]
// #[Model('deepseek-chat')]
/**
 * Agent IA conversationnel pour l'assistance e-commerce du tenant.
 *
 * Cet agent utilise le SDK Laravel AI pour fournir un assistant intelligent
 * au propriétaire de boutique. Il dispose d'outils pour consulter les statistiques,
 * rechercher des produits, gérer les promotions et analyser les performances.
 *
 * @see Agent
 * @see Conversational
 * @see HasTools
 */
#[Provider(Lab::OpenAI)]
class TenantAssistant implements Agent, Conversational, HasTools
{
    use Promptable, RemembersConversations;

    /**
     * @param  Tenant  $tenant  Le tenant (boutique) pour lequel l'agent opère
     */
    public function __construct(protected Tenant $tenant) {}

    /**
     * Retourne les instructions système de l'agent basées sur le contexte du tenant.
     *
     * Les instructions incluent le nom de la boutique, le plan actif et la liste
     * des outils disponibles avec leurs descriptions.
     *
     * @return string Le prompt système de l'agent
     */
    public function instructions(): string
    {
        $context = [
            'boutique' => $this->tenant->raison_sociale,
            'slug' => $this->tenant->slug,
            'plan' => $this->tenant->plan?->name ?? 'gratuit',
        ];

        return <<<PROMPT
            Tu es l'assistant e‑commerce de la boutique « {$context['boutique']} ».
            Voici le plan actif : {$context['plan']}.
            Tu disposes de plusieurs outils pour répondre aux questions du propriétaire :

            - `GetStats` : statistiques générales (produits, commandes, paniers, etc.)
            - `GetTopProducts` : produits les plus vendus
            - `SearchProducts` : rechercher des produits par mot-clé
            - `CreateDiscount` : créer une promotion (demander le type, le montant, le code, les dates)


            Sois proactif : propose des actions concrètes (lancer une promotion, améliorer les fiches produits, etc.) basées sur les données que tu obtiens.
            Parle uniquement en français et reste professionnel.
            PROMPT;
    }

    /**
     * Définit la liste des outils accessibles par l'agent IA.
     *
     * @return iterable<Tool> Les outils disponibles pour l'agent
     */
    public function tools(): iterable
    {
        return [
            new GetStats,
            new GetCart,
            new GetOrders,
            new GetTopProducts,
            new SearchProducts,
            new CreateDiscount,
            new GetLowStockProducts,
            new GetRevenueStats,
            new GetAbandonedCarts,
            new GetCustomerStats,
        ];
    }
}
