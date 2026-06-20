<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\ProductView;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Foundation\Auth\User as AuthUser;

class ProductViewPolicy
{
    use HandlesAuthorization;

    /**
     * Perform pre-authorization checks.
     */
    public function before(AuthUser $user, string $ability): ?bool
    {
        if ($user->hasRole('super_admin') || $user->hasRole('vendeur')) {
            return true;
        }

        if (function_exists('tenant') && tenant() && $user->canAccessTenant(tenant())) {
            return true;
        }

        return null;
    }

    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny ProductView');
    }

    public function view(AuthUser $authUser, ProductView $productView): bool
    {
        return $authUser->can('View ProductView');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create ProductView');
    }

    public function update(AuthUser $authUser, ProductView $productView): bool
    {
        return $authUser->can('Update ProductView');
    }

    public function delete(AuthUser $authUser, ProductView $productView): bool
    {
        return $authUser->can('Delete ProductView');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny ProductView');
    }

    public function restore(AuthUser $authUser, ProductView $productView): bool
    {
        return $authUser->can('Restore ProductView');
    }

    public function forceDelete(AuthUser $authUser, ProductView $productView): bool
    {
        return $authUser->can('ForceDelete ProductView');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny ProductView');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny ProductView');
    }

    public function replicate(AuthUser $authUser, ProductView $productView): bool
    {
        return $authUser->can('Replicate ProductView');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder ProductView');
    }
}
