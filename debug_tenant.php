<?php

use App\Models\Tenant;
use App\Models\VendorRequest;
use Illuminate\Support\Facades\DB;

// Reproduce EXACTLY the flow from approve() 
echo "=== Exact reproduction of approve() flow ===\n";

$vr = VendorRequest::find('019effbe-e555-70b1-b55c-adfd587b90bc');
if (!$vr) {
    echo "VendorRequest not found\n";
    return;
}

DB::connection('central')->enableQueryLog();
DB::enableQueryLog();

try {
    $tenant = DB::transaction(function () use ($vr) {
        $tenantId = (string) \Illuminate\Support\Str::orderedUuid();
        
        $tenant = Tenant::withoutEvents(function () use ($tenantId, $vr) {
            return Tenant::create([
                'id' => $tenantId,
                'raison_sociale' => $vr->shop_name,
                'slug' => $vr->shop_slug . '-debug-' . time(),
                'description' => $vr->shop_description,
                'email' => $vr->contact_email,
                'password' => 'testpass',
                'telephone' => $vr->contact_phone,
                'plan_id' => $vr->plan_id,
                'statut' => 'actif',
                'is_active' => true,
                'user_id' => $vr->user_id,
            ]);
        });
        
        echo "1. Tenant created: " . $tenant->id . "\n";
        
        // Check central connection transaction level
        echo "2. Central transaction level: " . DB::connection('central')->transactionLevel() . "\n";
        echo "3. Pgsql transaction level: " . DB::connection('pgsql')->transactionLevel() . "\n";
        
        // Check if visible from both connections
        $centralExists = DB::connection('central')->table('tenants')->where('id', $tenant->id)->exists();
        $pgsqlExists = DB::connection('pgsql')->table('tenants')->where('id', $tenant->id)->exists();
        echo "4. Visible from central: " . ($centralExists ? 'YES' : 'NO') . "\n";
        echo "5. Visible from pgsql: " . ($pgsqlExists ? 'YES' : 'NO') . "\n";
        
        // Create domain
        $tenant->domains()->create([
            'id' => (string) \Illuminate\Support\Str::orderedUuid(),
            'domain' => str_replace('_', '-', $vr->shop_slug) . '-debug.localhost',
        ]);
        echo "6. Domain created\n";
        
        // THIS is the line that fails in production
        // $vr->update(['tenant_id' => $tenant->id]);
        // Let's test it manually with raw SQL on pgsql
        echo "7. About to update vendor_request tenant_id...\n";
        
        // Don't actually update, just test if FK would pass
        $fkCheck = DB::connection('pgsql')->select(
            "SELECT EXISTS(SELECT 1 FROM tenants WHERE id = ?) as exists_check",
            [$tenant->id]
        );
        echo "8. FK check from pgsql: " . ($fkCheck[0]->exists_check ? 'PASS' : 'FAIL') . "\n";
        
        // Clean up
        DB::connection('central')->table('domains')->where('domain', str_replace('_', '-', $vr->shop_slug) . '-debug.localhost')->delete();
        DB::connection('central')->table('tenants')->where('id', $tenant->id)->delete();
        
        echo "9. Cleaned up\n";
        
        return $tenant;
    });
    echo "Transaction committed\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== Central queries ===\n";
foreach (DB::connection('central')->getQueryLog() as $q) {
    echo $q['query'] . "\n";
}
echo "\n=== Pgsql queries ===\n";
foreach (DB::getQueryLog() as $q) {
    echo $q['query'] . "\n";
}
