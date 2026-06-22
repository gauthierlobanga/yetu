<?php

namespace App\Support\Branding;

use App\Models\Tenant;
use App\Settings\SettingApp;
use Throwable;

final class Favicon
{
    public static function currentUrl(): string
    {
        $tenant = self::currentTenant();

        if ($tenant instanceof Tenant) {
            return self::tenantUrl($tenant);
        }

        return self::centralUrl();
    }

    public static function centralUrl(): string
    {
        try {
            $logoUrl = app(SettingApp::class)->logoUrl();
        } catch (Throwable) {
            $logoUrl = null;
        }

        return $logoUrl ?: asset('favicon.ico');
    }

    public static function tenantUrl(Tenant $tenant): string
    {
        try {
            return route('tenant.favicon', ['tenant' => $tenant]);
        } catch (Throwable) {
            return url('/tenant/'.rawurlencode((string) $tenant->getRouteKey()).'/favicon');
        }
    }

    private static function currentTenant(): ?Tenant
    {
        if (! function_exists('tenant')) {
            return null;
        }

        $tenant = tenant();

        return $tenant instanceof Tenant ? $tenant : null;
    }
}
