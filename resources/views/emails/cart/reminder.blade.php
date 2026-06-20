<x-mail::message>
# Vous avez oublié quelque chose ?

Bonjour {{ $panier->client->prenom ?? $panier->client->nom }},

Nous avons remarqué que vous avez laissé des articles dans votre panier.
Ils vous attendent toujours !

@foreach($panier->items as $item)
* {{ $item->quantite }}x {{ $item->nom_produit }} ({{ number_format($item->prix_total, 2) }} €)
@endforeach

<x-mail::button :url="$recoverUrl">
Reprendre ma commande
</x-mail::button>

À très bientôt,
L'équipe {{ config('app.name') }}
</x-mail::message>
