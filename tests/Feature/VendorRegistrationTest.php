<?php

use App\Models\Plan;
use App\Models\Tenant;
use App\Models\User;
use App\Models\VendorRequest;
use App\Services\VendorRegistrationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Stancl\Tenancy\Events\TenantCreated;

// test('tenant is created with user_id', function () {
//     $user = User::factory()->create();
//     $plan = Plan::free()->first() ?? Plan::factory()->free()->create();

//     $vendorRequest = VendorRequest::factory()->create([
//         'user_id' => $user->id,
//         'plan_id' => $plan->id,
//         'shop_name' => 'Test Shop',
//         'shop_slug' => 'test-shop',
//         'contact_email' => 'test@example.com',
//         'status' => VendorRequest::STATUS_PENDING,
//     ]);

//     $service = app(VendorRegistrationService::class);
//     $tenant = $service->approve($vendorRequest);

//     expect($tenant->user_id)->toBe($user->id);
//     expect($tenant->slug)->toBe('test-shop');
//     expect($tenant->statut)->toBe(Tenant::STATUT_ACTIF);
// // });

// test('tenant schema is created', function () {
//     $user = User::factory()->create();
//     $plan = Plan::free()->first() ?? Plan::factory()->free()->create();

//     $vendorRequest = VendorRequest::factory()->create([
//         'user_id' => $user->id,
//         'plan_id' => $plan->id,
//         'shop_name' => 'Test Shop',
//         'shop_slug' => 'test-shop',
//         'contact_email' => 'test@example.com',
//         'status' => VendorRequest::STATUS_PENDING,
//     ]);

//     $service = app(VendorRegistrationService::class);
//     $tenant = $service->approve($vendorRequest);
//     $this->prepareTenantDatabase($tenant);

//     $schemaName = 'tenant_'.$tenant->id;
//     $schemaExists = DB::select('SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?', [$schemaName]);

//     expect($schemaExists)->not->toBeEmpty();
// });

// test('user is linked as tenant owner', function () {
//     $user = User::factory()->create();
//     $plan = Plan::free()->first() ?? Plan::factory()->free()->create();

//     $vendorRequest = VendorRequest::factory()->create([
//         'user_id' => $user->id,
//         'plan_id' => $plan->id,
//         'shop_name' => 'Test Shop',
//         'shop_slug' => 'test-shop',
//         'contact_email' => 'test@example.com',
//         'status' => VendorRequest::STATUS_PENDING,
//     ]);

//     $service = app(VendorRegistrationService::class);
//     $tenant = $service->approve($vendorRequest);

//     expect(DB::table('user_tenant')
//         ->where('user_id', $user->id)
//         ->where('tenant_id', $tenant->id)
//         ->where('is_owner', true)
//         ->exists()
//     )->toBeTrue();
// });

// test('tenant creation event is dispatched for pending request', function () {
//     $user = User::factory()->create();
//     $plan = Plan::free()->first() ?? Plan::factory()->free()->create();

//     $vendorRequest = VendorRequest::factory()->create([
//         'user_id' => $user->id,
//         'plan_id' => $plan->id,
//         'shop_name' => 'Test Shop',
//         'shop_slug' => 'test-shop',
//         'contact_email' => 'test@example.com',
//         'status' => VendorRequest::STATUS_PENDING,
//     ]);

//     Event::fake([TenantCreated::class]);

//     $service = app(VendorRegistrationService::class);
//     $tenant = $service->approve($vendorRequest);

//     Event::assertDispatched(
//         TenantCreated::class,
//         fn (TenantCreated $event): bool => $event->tenant->is($tenant)
//     );
// });
