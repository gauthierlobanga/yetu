<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Foundation\Auth\User as AuthUser;
use Nnjeim\World\Models\Timezone;

class TimezonePolicy
{
    use HandlesAuthorization;

    /**
     * Perform pre-authorization checks.
     */
    public function before(AuthUser $user, string $ability): ?bool
    {
        if ($user->hasRole('super_admin')) {
            return true;
        }

        return null;
    }

    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny Timezone');
    }

    public function view(AuthUser $authUser, Timezone $timezone): bool
    {
        return $authUser->can('View Timezone');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create Timezone');
    }

    public function update(AuthUser $authUser, Timezone $timezone): bool
    {
        return $authUser->can('Update Timezone');
    }

    public function delete(AuthUser $authUser, Timezone $timezone): bool
    {
        return $authUser->can('Delete Timezone');
    }

    public function restore(AuthUser $authUser, Timezone $timezone): bool
    {
        return $authUser->can('Restore Timezone');
    }

    public function forceDelete(AuthUser $authUser, Timezone $timezone): bool
    {
        return $authUser->can('ForceDelete Timezone');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny Timezone');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny Timezone');
    }

    public function replicate(AuthUser $authUser, Timezone $timezone): bool
    {
        return $authUser->can('Replicate Timezone');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder Timezone');
    }
}
