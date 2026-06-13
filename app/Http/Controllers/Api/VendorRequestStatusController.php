<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VendorRequest;
use Illuminate\Http\JsonResponse;

class VendorRequestStatusController extends Controller
{
    public function __invoke(string $id): JsonResponse
    {
        $vendorRequest = VendorRequest::find($id);

        if (!$vendorRequest) {
            return response()->json(['error' => 'Not found'], 404);
        }

        return response()->json([
            'id' => $vendorRequest->id,
            'status' => $vendorRequest->status,
            'shop_name' => $vendorRequest->shop_name,
            'tenant_id' => $vendorRequest->tenant_id,
        ]);
    }
}
