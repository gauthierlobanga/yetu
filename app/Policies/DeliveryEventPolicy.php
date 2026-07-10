<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\DeliveryEvent;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Foundation\Auth\User as AuthUser;

class DeliveryEventPolicy
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
        return $authUser->can('ViewAny DeliveryEvent');
    }

    public function view(AuthUser $authUser, DeliveryEvent $deliveryEvent): bool
    {
        return $authUser->can('View DeliveryEvent');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create DeliveryEvent');
    }

    public function update(AuthUser $authUser, DeliveryEvent $deliveryEvent): bool
    {
        return $authUser->can('Update DeliveryEvent');
    }

    public function delete(AuthUser $authUser, DeliveryEvent $deliveryEvent): bool
    {
        return $authUser->can('Delete DeliveryEvent');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny DeliveryEvent');
    }

    public function restore(AuthUser $authUser, DeliveryEvent $deliveryEvent): bool
    {
        return $authUser->can('Restore DeliveryEvent');
    }

    public function forceDelete(AuthUser $authUser, DeliveryEvent $deliveryEvent): bool
    {
        return $authUser->can('ForceDelete DeliveryEvent');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny DeliveryEvent');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny DeliveryEvent');
    }

    public function replicate(AuthUser $authUser, DeliveryEvent $deliveryEvent): bool
    {
        return $authUser->can('Replicate DeliveryEvent');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder DeliveryEvent');
    }
}
