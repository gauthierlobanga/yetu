<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Contrôleur gérant l'API des notifications de l'utilisateur.
 *
 * Fournit les endpoints nécessaires pour lister, lire, marquer comme lu
 * et supprimer les notifications du système (base de données).
 */
class NotificationController extends Controller
{
    /**
     * Crée une nouvelle instance du contrôleur.
     *
     * @param  NotificationService  $notificationService  Service gérant la logique métier des notifications.
     */
    public function __construct(
        private readonly NotificationService $notificationService
    ) {}

    /**
     * Récupère la liste des notifications non lues.
     *
     * @param  Request  $request  La requête HTTP entrante.
     * @return JsonResponse Une réponse JSON contenant les données et le nombre de notifications.
     */
    public function unread(Request $request): JsonResponse
    {
        $limit = $request->query('limit', 10);
        $notifications = $this->notificationService->getUnreadNotifications(
            $request->user(),
            (int) $limit
        );

        return response()->json([
            'success' => true,
            'data' => $notifications,
            'count' => count($notifications),
        ]);
    }

    /**
     * Récupère toutes les notifications (lues et non lues) avec pagination basique.
     *
     * @param  Request  $request  La requête HTTP entrante.
     * @return JsonResponse Une réponse JSON contenant la liste globale des notifications.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $limit = $request->query('limit', 20);

        $notifications = $user->notifications()
            ->latest()
            ->limit((int) $limit)
            ->get()
            ->toArray();

        return response()->json([
            'success' => true,
            'data' => $notifications,
            'count' => count($notifications),
        ]);
    }

    /**
     * Marque une notification spécifique comme lue.
     *
     * @param  Request  $request  La requête HTTP entrante.
     * @param  string  $id  L'identifiant unique (UUID) de la notification.
     * @return JsonResponse Une réponse JSON indiquant le succès de l'opération.
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $marked = $this->notificationService->markAsRead($request->user(), $id);

        return response()->json([
            'success' => $marked,
            'message' => $marked ? 'Notification marquée comme lue' : 'Notification non trouvée',
        ]);
    }

    /**
     * Marque toutes les notifications de l'utilisateur comme lues.
     *
     * @param  Request  $request  La requête HTTP entrante.
     * @return JsonResponse Une réponse JSON confirmant la mise à jour globale.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $this->notificationService->markAllAsRead($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Toutes les notifications ont été marquées comme lues',
        ]);
    }

    /**
     * Supprime définitivement une notification spécifique.
     *
     * @param  Request  $request  La requête HTTP entrante.
     * @param  string  $id  L'identifiant unique de la notification.
     * @return JsonResponse Une réponse JSON confirmant ou non la suppression.
     */
    public function delete(Request $request, string $id): JsonResponse
    {
        $deleted = $this->notificationService->deleteNotification($request->user(), $id);

        return response()->json([
            'success' => $deleted,
            'message' => $deleted ? 'Notification supprimée' : 'Notification non trouvée',
        ]);
    }

    /**
     * Supprime toutes les notifications ayant déjà été lues.
     *
     * @param  Request  $request  La requête HTTP entrante.
     * @return JsonResponse Une réponse JSON incluant le nombre de notifications supprimées.
     */
    public function deleteRead(Request $request): JsonResponse
    {
        $count = $request->user()->readNotifications()->delete();

        return response()->json([
            'success' => true,
            'message' => "{$count} notifications supprimées",
            'count' => $count,
        ]);
    }

    /**
     * Compte le nombre total de notifications non lues.
     *
     * @param  Request  $request  La requête HTTP entrante.
     * @return JsonResponse Une réponse JSON contenant uniquement le compteur (unread_count).
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = $request->user()->unreadNotifications()->count();

        return response()->json([
            'success' => true,
            'unread_count' => $count,
        ]);
    }
}
