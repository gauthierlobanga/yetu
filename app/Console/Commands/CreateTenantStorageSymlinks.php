<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class CreateTenantStorageSymlinks extends Command
{
    protected $signature = 'tenancy:create-symlinks';

    protected $description = 'Create storage symlinks for all existing tenants';

    public function handle(): int
    {
        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {
            $this->createTenantStorageSymlink($tenant);
            $this->info("Symlink created for tenant: {$tenant->slug}");
        }

        $this->info('All tenant storage symlinks created successfully.');

        return self::SUCCESS;
    }

    private function createTenantStorageSymlink(Tenant $tenant): void
    {
        $tenantId = $tenant->id;
        $tenantSlug = $tenant->slug;
        $tenantStoragePath = storage_path('tenant'.$tenantId.'/app/public');
        $publicStoragePath = public_path('storage/tenant-'.$tenantSlug);

        // Créer le répertoire public/storage s'il n'existe pas
        if (! is_dir(public_path('storage'))) {
            mkdir(public_path('storage'), 0755, true);
        }

        // Supprimer le symlink s'il existe déjà
        if (is_link($publicStoragePath)) {
            unlink($publicStoragePath);
        } elseif (is_dir($publicStoragePath)) {
            // Si c'est un répertoire, le supprimer
            $this->deleteDirectory($publicStoragePath);
        }

        // Créer le symlink
        if (PHP_OS_FAMILY === 'Windows') {
            // Sur Windows, utiliser mklink /J pour créer une junction
            exec(sprintf('mklink /J "%s" "%s"', $publicStoragePath, $tenantStoragePath));
        } else {
            // Sur Linux/Mac, utiliser symlink
            symlink($tenantStoragePath, $publicStoragePath);
        }
    }

    private function deleteDirectory(string $dir): void
    {
        if (! is_dir($dir)) {
            return;
        }

        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            $path = $dir.'/'.$file;
            if (is_dir($path)) {
                $this->deleteDirectory($path);
            } else {
                unlink($path);
            }
        }
        rmdir($dir);
    }
}
