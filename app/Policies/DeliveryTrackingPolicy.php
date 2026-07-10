<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\DeliveryTracking;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Foundation\Auth\User as AuthUser;

class DeliveryTrackingPolicy
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
        return $authUser->can('ViewAny DeliveryTracking');
    }

    public function view(AuthUser $authUser, DeliveryTracking $deliveryTracking): bool
    {
        return $authUser->can('View DeliveryTracking');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create DeliveryTracking');
    }

    public function update(AuthUser $authUser, DeliveryTracking $deliveryTracking): bool
    {
        return $authUser->can('Update DeliveryTracking');
    }

    public function delete(AuthUser $authUser, DeliveryTracking $deliveryTracking): bool
    {
        return $authUser->can('Delete DeliveryTracking');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny DeliveryTracking');
    }

    public function restore(AuthUser $authUser, DeliveryTracking $deliveryTracking): bool
    {
        return $authUser->can('Restore DeliveryTracking');
    }

    public function forceDelete(AuthUser $authUser, DeliveryTracking $deliveryTracking): bool
    {
        return $authUser->can('ForceDelete DeliveryTracking');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny DeliveryTracking');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny DeliveryTracking');
    }

    public function replicate(AuthUser $authUser, DeliveryTracking $deliveryTracking): bool
    {
        return $authUser->can('Replicate DeliveryTracking');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder DeliveryTracking');
    }
}
