<?php

use Illuminate\Support\Facades\DB;

it('lists all schemas and tables', function () {
    $schemas = DB::select('SELECT schema_name FROM information_schema.schemata');
    dump('Schemas: '.implode(', ', collect($schemas)->pluck('schema_name')->toArray()));

    $tables = DB::select("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema', 'pg_catalog')");
    dump($tables);
});
