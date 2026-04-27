<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\CategoriePost;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Foundation\Auth\User as AuthUser;

class CategoriePostPolicy
{
    use HandlesAuthorization;

    /**
     * Perform pre-authorization checks.
     */
    public function before(AuthUser $user, string $ability): ?bool
    {
        if ($user->hasRole('uzana')) {
            return true;
        }

        return null;
    }

    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny CategoriePost');
    }

    public function view(AuthUser $authUser, CategoriePost $categoriePost): bool
    {
        return $authUser->can('View CategoriePost');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create CategoriePost');
    }

    public function update(AuthUser $authUser, CategoriePost $categoriePost): bool
    {
        return $authUser->can('Update CategoriePost');
    }

    public function delete(AuthUser $authUser, CategoriePost $categoriePost): bool
    {
        return $authUser->can('Delete CategoriePost');
    }

    public function restore(AuthUser $authUser, CategoriePost $categoriePost): bool
    {
        return $authUser->can('Restore CategoriePost');
    }

    public function forceDelete(AuthUser $authUser, CategoriePost $categoriePost): bool
    {
        return $authUser->can('ForceDelete CategoriePost');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny CategoriePost');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny CategoriePost');
    }

    public function replicate(AuthUser $authUser, CategoriePost $categoriePost): bool
    {
        return $authUser->can('Replicate CategoriePost');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder CategoriePost');
    }
}
