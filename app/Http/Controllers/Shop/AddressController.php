<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Adresse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Propaganistas\LaravelPhone\Rules\Phone;

class AddressController extends Controller
{
    public function index()
    {
        $addresses = Auth::user()->adresses;

        return Inertia::render('Shop/Addresses/Index', ['addresses' => $addresses]);
    }

    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'rue' => 'required|string',
    //         'complement' => 'nullable|string',
    //         'code_postal' => 'required|string',
    //         'ville' => 'required|string',
    //         'pays' => 'required|string',
    //         'telephone' => 'nullable|string',
    //         'type' => 'required|in:facturation,livraison',
    //         'est_defaut' => 'boolean',
    //     ]);

    //     $user = Auth::user();
    //     $address = $user->adresses()->create($validated);

    //     if ($request->boolean('est_defaut')) {
    //         $address->definirCommeDefaut();
    //     }

    //     return back()->with('success', 'Adresse ajoutée');
    // }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rue' => 'required|string',
            'complement' => 'nullable|string',
            'code_postal' => 'required|string',
            'ville' => 'required|string',
            'pays' => 'required|string',
            'telephone' => [
                'nullable',
                'string',
                (new Phone($request->pays))->type('mobile'),
            ],
            'type' => 'required|in:facturation,livraison',
            'est_defaut' => 'boolean',
        ]);

        $user = Auth::user();
        $address = $user->adresses()->create($validated);

        if ($request->boolean('est_defaut')) {
            $address->definirCommeDefaut();
        }

        return back()->with('success', 'Adresse ajoutée');
    }

    public function update(Request $request, Adresse $address)
    {
        // Vérifier que l'adresse appartient bien à l'utilisateur
        if ($address->addressable_type !== User::class ||
            $address->addressable_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'rue' => 'required|string',
            'complement' => 'nullable|string',
            'code_postal' => 'required|string',
            'ville' => 'required|string',
            'pays' => 'required|string',
            'telephone' => 'nullable|string',
        ]);

        $address->update($validated);

        return back()->with('success', 'Adresse mise à jour');
    }

    public function destroy(Adresse $address)
    {
        if ($address->addressable_type !== User::class ||
            $address->addressable_id !== Auth::id()) {
            abort(403);
        }

        $address->delete();

        return back()->with('success', 'Adresse supprimée');
    }

    public function addressesSetDefault(Adresse $address)
    {
        if ($address->addressable_type !== User::class ||
            $address->addressable_id !== Auth::id()) {
            abort(403);
        }

        $address->definirCommeDefaut();

        return back()->with('success', 'Adresse par défaut mise à jour');
    }
}

// namespace App\Http\Controllers\Shop;

// use App\Http\Controllers\Controller;
// use App\Models\Adresse;
// use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;
// use Inertia\Inertia;

// class AddressController extends Controller
// {
//     public function __construct(private Adresse $address) {}

//     public function index()
//     {
//         $addresses = Auth::user()->adresses;

//         return Inertia::render('Shop/Addresses/Index', ['addresses' => $addresses]);
//     }

//     public function store(Request $request)
//     {
//         $validated = $request->validate([
//             'rue' => 'required|string',
//             'complement' => 'nullable|string',
//             'code_postal' => 'required|string',
//             'ville' => 'required|string',
//             'pays' => 'required|string',
//             'telephone' => 'nullable|string',
//             'type' => 'required|in:facturation,livraison',
//             'est_defaut' => 'boolean',
//         ]);

//         $client = Auth::user()->client;
//         $address = $client->adresses()->create($validated);

//         if ($request->boolean('est_defaut')) {
//             $address->definirCommeDefaut();
//         }

//         return back()->with('success', 'Adresse ajoutée');
//     }

//     public function update(Request $request, Adresse $address)
//     {
//         // /** @var AuthorizesRequests $this */
//         // $this->authorize('update', $address);
//         $validated = $request->validate([
//             'rue' => 'required|string',
//             'complement' => 'nullable|string',
//             'code_postal' => 'required|string',
//             'ville' => 'required|string',
//             'pays' => 'required|string',
//             'telephone' => 'nullable|string',
//         ]);

//         $address->update($validated);

//         return back()->with('success', 'Adresse mise à jour');
//     }

//     public function destroy(Adresse $address)
//     {
//         // /** @var AuthorizesRequests $this */
//         // $this->authorize('delete', $address);
//         $address->delete($this->address->id);

//         return back()->with('success', 'Adresse supprimée');
//     }

//     public function addressesSetDefault(Adresse $address)
//     {
//         // /** @var AuthorizesRequests $this */
//         // $this->authorize('update', $address);
//         $address->definirCommeDefaut();

//         return back()->with('success', 'Adresse par défaut mise à jour');
//     }
// }
