<?php
namespace App\Http\Controllers\Api\V1\Helpdesk;

use App\Http\Controllers\Controller;
use App\Models\Helpdesk\Ticket;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $tickets = Ticket::where('organization_id', $request->user()->organization_id)
            ->paginate($request->input('per_page', 15));
        return ApiResponse::paginated($tickets);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['organization_id'] = $request->user()->organization_id;
        $ticket = Ticket::create($data);
        return ApiResponse::created($ticket);
    }

    public function show(Ticket $ticket) { return ApiResponse::success($ticket); }
    public function update(Request $request, Ticket $ticket) { $ticket->update($request->all()); return ApiResponse::success($ticket); }
    public function destroy(Ticket $ticket) { $ticket->delete(); return ApiResponse::noContent(); }
}
