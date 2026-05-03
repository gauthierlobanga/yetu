<?php

namespace App\Support\Tenancy;

use Illuminate\Support\Str;
use Spatie\MediaLibrary\Support\UrlGenerator\DefaultUrlGenerator;

class TenantAwareUrlGenerator extends DefaultUrlGenerator
{
    public function getUrl(): string
    {
        $url = $this->shouldUseTenantAssetRoute()
            ? tenant_asset($this->getPathRelativeToRoot())
            : $this->getDisk()->url($this->getUrlEncodedPathRelativeToRoot());

        $url = $this->versionUrl($url);

        return $url;
    }

    public function getResponsiveImagesDirectoryUrl(): string
    {
        if (! $this->shouldUseTenantAssetRoute()) {
            return parent::getResponsiveImagesDirectoryUrl();
        }

        return Str::finish(tenant_asset($this->pathGenerator->getPathForResponsiveImages($this->media)), '/');
    }

    protected function shouldUseTenantAssetRoute(): bool
    {
        if (! function_exists('tenancy') || ! tenancy()->initialized) {
            return false;
        }

        $diskName = $this->getDiskName();

        return config("filesystems.disks.{$diskName}.driver") === 'local'
            && in_array($diskName, config('tenancy.filesystem.disks', []), true);
    }
}
