<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\WishlistItem;
use Illuminate\Auth\Access\HandlesAuthorization;

class WishlistItemPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny WishlistItem');
    }

    public function view(AuthUser $authUser, WishlistItem $wishlistItem): bool
    {
        return $authUser->can('View WishlistItem');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create WishlistItem');
    }

    public function update(AuthUser $authUser, WishlistItem $wishlistItem): bool
    {
        return $authUser->can('Update WishlistItem');
    }

    public function delete(AuthUser $authUser, WishlistItem $wishlistItem): bool
    {
        return $authUser->can('Delete WishlistItem');
    }

    public function deleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('DeleteAny WishlistItem');
    }

    public function restore(AuthUser $authUser, WishlistItem $wishlistItem): bool
    {
        return $authUser->can('Restore WishlistItem');
    }

    public function forceDelete(AuthUser $authUser, WishlistItem $wishlistItem): bool
    {
        return $authUser->can('ForceDelete WishlistItem');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny WishlistItem');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny WishlistItem');
    }

    public function replicate(AuthUser $authUser, WishlistItem $wishlistItem): bool
    {
        return $authUser->can('Replicate WishlistItem');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder WishlistItem');
    }

}