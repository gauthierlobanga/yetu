<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Newsletter;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsletterSubscriberController extends Controller
{
    public function index(Request $request)
    {
        $query = Newsletter::query();

        if ($request->has('search') && $request->get('search') != '') {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                    ->orWhere('prenom', 'like', "%{$search}%")
                    ->orWhere('nom', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->get('status') !== 'all') {
            $status = $request->get('status') === 'active';
            $query->where('is_active', $status);
        }

        $subscribers = $query->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Vendor/pages/newsletters/Subscribers/Index', [
            'subscribers' => $subscribers,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function destroy($id)
    {
        $subscriber = Newsletter::findOrFail($id);
        $subscriber->desactiver(); // Call method on model

        return back()->with('success', 'Abonné désactivé avec succès.');
    }
}
