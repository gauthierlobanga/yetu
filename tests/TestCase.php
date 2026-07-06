<?php

namespace Tests;

use App\Models\Tenant;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\DB;
use Laravel\Fortify\Features;

/**
 * Classe de base pour tous les tests de l'application Yetu.
 *
 * Fournit les utilitaires communs pour les tests multi-tenant PostgreSQL :
 * gestion des schémas tenant, initialisation de la tenancy, et nettoyage
 * automatique des schémas de test.
 */
abstract class TestCase extends BaseTestCase
{
    /**
     * @var array<int, string>
     */
    protected array $connectionsToTransact = ['pgsql'];

    /**
     * Crée et configure l'application Laravel pour l'environnement de test.
     *
     * Force la connexion centrale sur `pgsql` en environnement de test.
     *
     * @return Application
     */
    public function createApplication()
    {
        $app = parent::createApplication();

        if ($app->environment('testing')) {
            $app['config']->set('tenancy.database.central_connection', 'pgsql');
        }

        return $app;
    }

    /**
     * Hook exécuté avant le rafraîchissement de la base de données.
     *
     * Supprime tous les schémas tenant existants pour repartir sur une base propre.
     */
    protected function beforeRefreshingDatabase()
    {
        $this->dropTenantSchemas();
    }

    /**
     * Saute le test si une fonctionnalité Fortify spécifique n'est pas activée.
     *
     * @param  string  $feature  Le nom de la fonctionnalité Fortify (ex: Features::registration())
     * @param  string|null  $message  Message personnalisé pour le skip
     */
    protected function skipUnlessFortifyFeature(string $feature, ?string $message = null): void
    {
        if (! Features::enabled($feature)) {
            $this->markTestSkipped($message ?? "Fortify feature [{$feature}] is not enabled.");
        }
    }

    /**
     * Initialise un tenant pour les tests avec son schéma PostgreSQL.
     *
     * Crée un tenant via la factory si aucun n'est fourni, prépare le schéma
     * et initialise le contexte de tenancy.
     *
     * @param  Tenant|null  $tenant  Tenant existant ou null pour en créer un
     * @return Tenant Le tenant initialisé
     */
    protected function initializeTenantForTesting(?Tenant $tenant = null): Tenant
    {
        $tenant ??= Tenant::factory()->create();

        $this->prepareTenantDatabase($tenant);

        tenancy()->initialize($tenant);

        return $tenant;
    }

    /**
     * Prépare le schéma PostgreSQL pour un tenant de test.
     *
     * Termine toute session de tenancy active, puis crée le schéma
     * via la connexion centrale si celui-ci n'existe pas encore.
     *
     * @param  Tenant  $tenant  Le tenant dont le schéma doit être créé
     */
    protected function prepareTenantDatabase(Tenant $tenant): void
    {
        if (function_exists('tenancy') && tenancy()->initialized) {
            tenancy()->end();
        }

        $schemaName = $this->quotePostgresIdentifier($tenant->database()->getName());

        DB::connection('central')->statement("CREATE SCHEMA IF NOT EXISTS {$schemaName}");
    }

    /**
     * Supprime tous les schémas PostgreSQL de type `tenant_*`.
     *
     * Utilisé pour nettoyer l'environnement de test entre les suites.
     * Opère uniquement sur les connexions PostgreSQL.
     */
    protected function dropTenantSchemas(): void
    {
        if (config('database.connections.central.driver') !== 'pgsql') {
            return;
        }

        $connection = DB::connection('central');

        $connection->statement('SET search_path TO public');

        $schemas = $connection->select(
            "SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'tenant_%'"
        );

        foreach ($schemas as $schema) {
            $schemaName = $this->quotePostgresIdentifier($schema->schema_name);

            $connection->statement("DROP SCHEMA IF EXISTS {$schemaName} CASCADE");
        }
    }

    /**
     * Protège un identifiant PostgreSQL contre l'injection SQL.
     *
     * @param  string  $identifier  L'identifiant brut (nom de schéma, table, etc.)
     * @return string L'identifiant correctement quoté pour PostgreSQL
     */
    private function quotePostgresIdentifier(string $identifier): string
    {
        return '"'.str_replace('"', '""', $identifier).'"';
    }
}
