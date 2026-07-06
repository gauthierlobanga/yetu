<?php

namespace App\Http\Controllers\Vendor\Vendeurs;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class TenantDashboardNotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        $perPage = $request->input('per_page', 15);
        $tab = $request->input('tab', 'all'); // 'all' or 'unread'

        $query = $user->notifications();
        
        if ($tab === 'unread') {
            $query->whereNull('read_at');
        }

        $notifications = $query->paginate($perPage);

        $mapped = $notifications->map(function ($n) {
            return [
                'id' => $n->id,
                'type' => $n->data['type'] ?? 'info',
                'title' => $n->data['title'] ?? 'Notification',
                'message' => $n->data['message'] ?? '',
                'url' => $n->data['url'] ?? null,
                'read_at' => $n->read_at,
                'created_at' => $n->created_at->toISOString(),
                'data' => $n->data,
            ];
        });

        $paginatedData = $notifications->toArray();
        $paginatedData['data'] = $mapped;

        // Detect context based on URL
        if ($request->is('admin/*')) {
            return Inertia::render('Admin/analytics/Notifications', [
                'notifications' => $paginatedData,
                'activeTab' => $tab,
            ]);
        } elseif ($request->is('vendor/*')) {
            return Inertia::render('Vendor/Notifications', [
                'notifications' => $paginatedData,
                'activeTab' => $tab,
            ]);
        } else {
            return Inertia::render('Vendor/boutique/Acheteur/Dashboard/Notifications', [
                'notifications' => $paginatedData,
                'activeTab' => $tab,
            ]);
        }
    }

    public function destroy(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        $user->notifications()->whereKey($id)->delete();

        return back(303)->with('success', 'Notification supprimée.');
    }

    public function destroyAll(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        $user->notifications()->delete();

        return back(303)->with('success', 'Toutes les notifications ont été supprimées.');
    }

    public function show(Request $request, string $id)
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        $n = $user->notifications()->whereKey($id)->first();

        if (! $n) {
            abort(404);
        }

        // Auto-mark as read
        if (is_null($n->read_at)) {
            $n->markAsRead();
        }

        $notification = [
            'id' => $n->id,
            'type' => $n->data['type'] ?? 'info',
            'title' => $n->data['title'] ?? 'Notification',
            'message' => $n->data['message'] ?? '',
            'url' => $n->data['url'] ?? null,
            'read_at' => $n->read_at,
            'created_at' => $n->created_at->toISOString(),
            'data' => $n->data,
        ];

        // Determine back URL based on context
        if ($request->is('admin/*')) {
            $backUrl = route('admin.notifications.index');

            return Inertia::render('Admin/analytics/NotificationShow', [
                'notification' => $notification,
                'backUrl' => $backUrl,
            ]);
        } elseif ($request->is('vendor/*')) {
            $backUrl = route('vendor.notifications.index');

            return Inertia::render('Vendor/NotificationShow', [
                'notification' => $notification,
                'backUrl' => $backUrl,
            ]);
        } else {
            $backUrl = route('acheteur.notifications.index');

            return Inertia::render('Vendor/boutique/Acheteur/Dashboard/NotificationShow', [
                'notification' => $notification,
                'backUrl' => $backUrl,
            ]);
        }
    }

    public function markAsRead(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        $notification = $user->notifications()
            ->whereKey($id)
            ->first();

        if ($notification && is_null($notification->read_at)) {
            $notification->markAsRead();
        }

        return back(303);
    }

    public function markAllAsRead(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        $user->unreadNotifications()->update([
            'read_at' => now(),
        ]);

        return back(303);
    }
}
