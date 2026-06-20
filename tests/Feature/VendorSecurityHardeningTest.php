<?php

use App\Models\Plan;
use App\Models\Tenant;
use App\Models\User;
use App\Models\VendorRequest;
use App\Services\PaymentService;
use Laravel\Sanctum\Sanctum;
use Mockery\MockInterface;

test('vendor request status endpoint requires authentication', function () {
    $vendorRequest = VendorRequest::factory()->create();

    $this->getJson(route('vendor.status', ['id' => $vendorRequest->id]))
        ->assertUnauthorized();
});

test('vendor request status endpoint forbids access to another users request', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();

    $vendorRequest = VendorRequest::factory()->create([
        'user_id' => $owner->id,
    ]);

    Sanctum::actingAs($intruder);

    $this->getJson(route('vendor.status', ['id' => $vendorRequest->id]))
        ->assertForbidden();
});

test('vendor request status endpoint returns owner request data', function () {
    $owner = User::factory()->create();

    $vendorRequest = VendorRequest::factory()->create([
        'user_id' => $owner->id,
    ]);

    Sanctum::actingAs($owner);

    $this->getJson(route('vendor.status', ['id' => $vendorRequest->id]))
        ->assertOk()
        ->assertJson([
            'id' => $vendorRequest->id,
            'status' => $vendorRequest->status,
            'shop_name' => $vendorRequest->shop_name,
            'tenant_id' => $vendorRequest->tenant_id,
        ]);
});

test('vendor request status endpoint waits until subscription exists before returning sso url', function () {
    $owner = User::factory()->create();
    $plan = Plan::factory()->create([
        'name' => 'Status Plan '.uniqid(),
        'slug' => 'status-plan-'.uniqid(),
    ]);
    $tenant = Tenant::factory()->create([
        'plan_id' => $plan->id,
        'user_id' => $owner->id,
    ]);

    $vendorRequest = VendorRequest::factory()->create([
        'plan_id' => $plan->id,
        'user_id' => $owner->id,
        'tenant_id' => $tenant->id,
        'status' => VendorRequest::STATUS_APPROVED,
    ]);

    $this->actingAs($owner)
        ->getJson(route('vendor.status', ['id' => $vendorRequest->id]))
        ->assertOk()
        ->assertJson([
            'id' => $vendorRequest->id,
            'status' => VendorRequest::STATUS_PENDING,
            'tenant_id' => $tenant->id,
        ])
        ->assertJsonMissingPath('sso_url');
});

test('vendor success page is forbidden for non owner', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();

    $tenant = Tenant::factory()->create([
        'user_id' => $owner->id,
    ]);

    $this->actingAs($intruder)
        ->get(route('vendor.success', ['tenant' => $tenant->slug]))
        ->assertForbidden();
});

test('vendor payment success is forbidden when checkout metadata belongs to another user', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();

    $vendorRequest = VendorRequest::factory()->create([
        'user_id' => $owner->id,
    ]);

    $this->mock(PaymentService::class, function (MockInterface $mock) use ($vendorRequest): void {
        $mock->shouldReceive('verifyCheckoutSession')
            ->once()
            ->with('cs_test_forbidden')
            ->andReturn([
                'status' => 'paid',
                'metadata' => [
                    'vendor_request_id' => $vendorRequest->id,
                ],
                'subscription_id' => null,
                'customer_id' => null,
            ]);
    });

    $this->actingAs($intruder)
        ->get(route('vendor.payment.success', ['session_id' => 'cs_test_forbidden']))
        ->assertForbidden();
});
