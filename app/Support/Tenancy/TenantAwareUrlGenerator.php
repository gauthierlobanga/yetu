<?php

namespace App\Support\Tenancy;

use Spatie\MediaLibrary\Support\UrlGenerator\DefaultUrlGenerator;

class TenantAwareUrlGenerator extends DefaultUrlGenerator
{
    public function getUrl(): string
    {
        $diskName = $this->getDiskName();

        // Si c'est un disk public dans le contexte tenant, utiliser l'URL avec le slug
        if ($diskName === 'public' && function_exists('tenancy') && tenancy()->initialized) {
            $tenant = tenancy()->tenant;
            $path = $this->getPathRelativeToRoot();
            $url = '/storage/tenant-'.$tenant->slug.'/'.$path;
        } else {
            $url = $this->getDisk()->url($this->getUrlEncodedPathRelativeToRoot());
        }

        $url = $this->versionUrl($url);

        return $url;
    }

    public function getResponsiveImagesDirectoryUrl(): string
    {
        $diskName = $this->getDiskName();

        // Si c'est un disk public dans le contexte tenant, utiliser l'URL avec le slug
        if ($diskName === 'public' && function_exists('tenancy') && tenancy()->initialized) {
            $tenant = tenancy()->tenant;
            $path = $this->pathGenerator->getPathForResponsiveImages($this->media);
            $url = '/storage/tenant-'.$tenant->slug.'/'.$path;
        } else {
            $url = parent::getResponsiveImagesDirectoryUrl();
        }

        return $url;
    }
}
