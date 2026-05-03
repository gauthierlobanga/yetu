<?php

namespace App\Support;

use Spatie\MediaLibrary\Support\UrlGenerator\DefaultUrlGenerator;

class TenantAwareUrlGenerator extends DefaultUrlGenerator
{
    public function getUrl(): string
    {
        // En contexte tenant, utiliser tenant_asset()
        if (function_exists('tenant') && tenant()) {
            return tenant_asset($this->getPathRelativeToRoot());
        }

        // En central, URL normale
        return asset($this->getPathRelativeToRoot());
    }
}
