<?php
namespace App\Http\Controllers\Api\V1\Crm;

use App\Http\Controllers\Controller;
use App\Models\Crm\Contact;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $contacts = Contact::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($contacts);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $c = Contact::create($data);
        return ApiResponse::created($c);
    }

    public function show(Contact $contact) { return ApiResponse::success($contact); }
    public function update(Request $request, Contact $contact) { $contact->update($request->all()); return ApiResponse::success($contact); }
    public function destroy(Contact $contact) { $contact->delete(); return ApiResponse::noContent(); }
}
