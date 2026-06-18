<?php

// app/Events/UserLoggedIn.php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Événement déclenché lors de la connexion réussie d'un utilisateur.
 *
 * Cet événement collecte l'adresse IP et l'agent utilisateur (User-Agent)
 * du client pour des raisons de sécurité ou d'analyse.
 */
class UserLoggedIn
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public User $user;

    public string $ip;

    public string $userAgent;

    /**
     * Crée une nouvelle instance de l'événement.
     *
     * @param  User  $user  L'utilisateur venant de se connecter.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
        $this->ip = request()->ip();
        $this->userAgent = request()->userAgent();
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.'.$this->user->id),
        ];
    }
}
