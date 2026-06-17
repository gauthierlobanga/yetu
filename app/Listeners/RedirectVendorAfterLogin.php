<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;

class RedirectVendorAfterLogin
{
    public function handle(Login $event): void
    {
        // Redirection gérée par CustomLoginResponse ou TenantSsoLoginController
    }
}
