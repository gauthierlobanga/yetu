<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class TenantFaviconController extends Controller
{
    public function show(Tenant $tenant): RedirectResponse|BinaryFileResponse|Response
    {
        $logoUrl = $this->resolveTenantLogoUrl($tenant);

        if ($logoUrl) {
            return redirect()
                ->away($logoUrl)
                ->header('Cache-Control', 'public, max-age=300');
        }

        $fallback = public_path('favicon.ico');

        if (file_exists($fallback)) {
            return response()->file($fallback, [
                'Cache-Control' => 'public, max-age=86400',
                'Content-Type' => 'image/x-icon',
            ]);
        }

        return response()->noContent(404);
    }

    private function resolveTenantLogoUrl(Tenant $tenant): ?string
    {
        try {
            return $tenant->logo_url ?: $tenant->getFirstMedia('tenant_avatar')?->getUrl();
        } catch (Throwable) {
            return null;
        }
    }
}
