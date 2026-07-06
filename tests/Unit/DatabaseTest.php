<?php

use Illuminate\Support\Facades\DB;

it('uses the configured PostgreSQL test database', function () {
    $schemas = DB::select('SELECT schema_name FROM information_schema.schemata');

    expect(DB::connection()->getDatabaseName())->toBe('yetu_test')
        ->and(collect($schemas)->pluck('schema_name'))->toContain('public');
});
