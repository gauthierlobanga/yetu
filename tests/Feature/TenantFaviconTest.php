<?php

use function Pest\Laravel\get;

it('returns 404 for a missing tenant favicon route', function () {
    $this->get('/tenant/non-existent-slug/favicon')->assertStatus(404);
});
