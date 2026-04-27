<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\CategoriePostPivot;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Foundation\Auth\User as AuthUser;

class CategoriePostPivotPolicy
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
        return $authUser->can('ViewAny CategoriePostPivot');
    }

    public function view(AuthUser $authUser, CategoriePostPivot $categoriePostPivot): bool
    {
        return $authUser->can('View CategoriePostPivot');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create CategoriePostPivot');
    }

    public function update(AuthUser $authUser, CategoriePostPivot $categoriePostPivot): bool
    {
        return $authUser->can('Update CategoriePostPivot');
    }

    public function delete(AuthUser $authUser, CategoriePostPivot $categoriePostPivot): bool
    {
        return $authUser->can('Delete CategoriePostPivot');
    }

    public function restore(AuthUser $authUser, CategoriePostPivot $categoriePostPivot): bool
    {
        return $authUser->can('Restore CategoriePostPivot');
    }

    public function forceDelete(AuthUser $authUser, CategoriePostPivot $categoriePostPivot): bool
    {
        return $authUser->can('ForceDelete CategoriePostPivot');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny CategoriePostPivot');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny CategoriePostPivot');
    }

    public function replicate(AuthUser $authUser, CategoriePostPivot $categoriePostPivot): bool
    {
        return $authUser->can('Replicate CategoriePostPivot');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder CategoriePostPivot');
    }
}
