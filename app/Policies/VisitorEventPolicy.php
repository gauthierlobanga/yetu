<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\VisitorEvent;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Foundation\Auth\User as AuthUser;

class VisitorEventPolicy
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
        return $authUser->can('ViewAny VisitorEvent');
    }

    public function view(AuthUser $authUser, VisitorEvent $visitorEvent): bool
    {
        return $authUser->can('View VisitorEvent');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create VisitorEvent');
    }

    public function update(AuthUser $authUser, VisitorEvent $visitorEvent): bool
    {
        return $authUser->can('Update VisitorEvent');
    }

    public function delete(AuthUser $authUser, VisitorEvent $visitorEvent): bool
    {
        return $authUser->can('Delete VisitorEvent');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny VisitorEvent');
    }

    public function restore(AuthUser $authUser, VisitorEvent $visitorEvent): bool
    {
        return $authUser->can('Restore VisitorEvent');
    }

    public function forceDelete(AuthUser $authUser, VisitorEvent $visitorEvent): bool
    {
        return $authUser->can('ForceDelete VisitorEvent');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny VisitorEvent');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny VisitorEvent');
    }

    public function replicate(AuthUser $authUser, VisitorEvent $visitorEvent): bool
    {
        return $authUser->can('Replicate VisitorEvent');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder VisitorEvent');
    }
}
