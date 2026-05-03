<?php

namespace App\Tenancy\TenantDatabaseManagers;

use Illuminate\Support\Facades\DB;
use Stancl\Tenancy\TenantDatabaseManagers\PostgreSQLSchemaManager;

class PostgreSQLSchemaManagerWithSearchPath extends PostgreSQLSchemaManager
{
    public function createDatabase(string $name): bool
    {
        $schemaName = $this->makeSchemaName($name);

        // Create the schema
        return DB::statement("CREATE SCHEMA IF NOT EXISTS \"{$schemaName}\"");
    }

    public function deleteDatabase(string $name): bool
    {
        $schemaName = $this->makeSchemaName($name);

        // Drop the schema and all its objects
        return DB::statement("DROP SCHEMA IF EXISTS \"{$schemaName}\" CASCADE");
    }

    public function databaseExists(string $name): bool
    {
        $schemaName = $this->makeSchemaName($name);

        $result = DB::select("SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?", [$schemaName]);

        return count($result) > 0;
    }

    protected function makeSchemaName(string $name): string
    {
        // Convert hyphens to underscores for PostgreSQL schema names
        return str_replace('-', '_', $name);
    }
}
