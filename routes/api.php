<?php

use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\VendorRequestStatusController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/**
 * Routes API pour les notifications
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::get('/unread', [NotificationController::class, 'unread'])->name('unread');
        Route::get('/unread-count', [NotificationController::class, 'unreadCount'])->name('unread-count');
        Route::post('/{id}/read', [NotificationController::class, 'markAsRead'])->name('mark-read');
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('mark-all-read');
        Route::delete('/{id}', [NotificationController::class, 'delete'])->name('delete');
        Route::delete('/delete-read', [NotificationController::class, 'deleteRead'])->name('delete-read');
    });
});

/**
 * Routes API protégées (vendor request status accessible uniquement au propriétaire)
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/vendor-request/{id}/status', [VendorRequestStatusController::class, '__invoke'])->name('vendor-request.status');
});
