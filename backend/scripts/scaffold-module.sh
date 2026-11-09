#!/usr/bin/env bash
# backend/scripts/scaffold-module.sh
# Usage: ./scaffold-module.sh Sales Quotation --plural=Quotations --route=quotations
set -e

MODULE="$1"        # Sales
ENTITY="$2"        # Quotation
PLURAL="$3"        # Quotations
ROUTE="$4"         # quotations

MODEL_PATH="app/Models/${MODULE}/${ENTITY}"
CTRL_PATH="app/Http/Controllers/Api/V1/${MODULE}/${ENTITY}Controller.php"
SVC_PATH="app/Services/${MODULE}/${ENTITY}Service.php"
RES_PATH="app/Http/Resources/${MODULE}/${ENTITY}Resource.php"
STORE_REQ="app/Http/Requests/${MODULE}/Store${ENTITY}Request.php"
UPDATE_REQ="app/Http/Requests/${MODULE}/Update${ENTITY}Request.php"
POLICY_PATH="app/Policies/${ENTITY}Policy.php"

# Controller
cat > "$CTRL_PATH" <<PHP
<?php
namespace App\Http\Controllers\Api\V1\\${MODULE};

use App\Http\Controllers\Controller;
use App\Http\Requests\\${MODULE}\\{Store${ENTITY}Request, Update${ENTITY}Request};
use App\Http\Resources\\${MODULE}\\${ENTITY}Resource;
use App\Models\\${MODULE}\\${ENTITY};
use App\Services\\${MODULE}\\${ENTITY}Service;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ${ENTITY}Controller extends Controller
{
    public function __construct(private ${ENTITY}Service \$service) {}

    public function index(Request \$request)
    {
        \$this->authorize('viewAny', ${ENTITY}::class);
        return ApiResponse::paginated(\$this->service->paginate(\$request), ${ENTITY}Resource::class);
    }

    public function store(Store${ENTITY}Request \$request)
    {
        \$this->authorize('create', ${ENTITY}::class);
        return ApiResponse::created(new ${ENTITY}Resource(\$this->service->create(\$request->validated())));
    }

    public function show(${ENTITY} \$model)
    {
        \$this->authorize('view', \$model);
        return ApiResponse::success(new ${ENTITY}Resource(\$model));
    }

    public function update(Update${ENTITY}Request \$request, ${ENTITY} \$model)
    {
        \$this->authorize('update', \$model);
        return ApiResponse::success(new ${ENTITY}Resource(\$this->service->update(\$model, \$request->validated())));
    }

    public function destroy(${ENTITY} \$model)
    {
        \$this->authorize('delete', \$model);
        \$this->service->delete(\$model);
        return ApiResponse::noContent();
    }
}
PHP

# Service
cat > "$SVC_PATH" <<PHP
<?php
namespace App\Services\\${MODULE};

use App\Models\\${MODULE}\\${ENTITY};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ${ENTITY}Service
{
    public function paginate(Request \$request)
    {
        \$query = ${ENTITY}::query();

        if (\$s = \$request->string('search')->toString()) {
            \$query->where('name', 'like', "%{\$s}%");
        }
        if (\$st = \$request->input('filter.status')) {
            \$query->where('status', \$st);
        }
        \$sort = \$request->input('sort', '-created_at');
        \$query->orderBy(ltrim(\$sort, '-'), str_starts_with(\$sort, '-') ? 'desc' : 'asc');

        return \$query->paginate(min((int) \$request->input('per_page', 15), 100));
    }

    public function create(array \$data): ${ENTITY}
    {
        return DB::transaction(function () use (\$data) {
            \$data['organization_id'] = auth()->user()->organization_id;
            return ${ENTITY}::create(\$data);
        });
    }

    public function update(${ENTITY} \$model, array \$data): ${ENTITY}
    {
        return DB::transaction(function () use (\$model, \$data) {
            \$model->update(\$data);
            return \$model->fresh();
        });
    }

    public function delete(${ENTITY} \$model): void
    {
        \$model->delete();
    }
}
PHP

# Resource (basic — refine per-entity)
cat > "$RES_PATH" <<PHP
<?php
namespace App\Http\Resources\\${MODULE};

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ${ENTITY}Resource extends JsonResource
{
    public function toArray(Request \$request): array
    {
        return [
            'id'         => \$this->id,
            'name'       => \$this->name,
            'status'     => \$this->status,
            'createdAt'  => \$this->created_at?->toIso8601String(),
            'updatedAt'  => \$this->updated_at?->toIso8601String(),
        ];
    }
}
PHP

# Requests (basic — refine per-entity)
for ACTION in Store Update; do
  FILE_VAR="STORE_REQ"; [ "$ACTION" = "Update" ] && FILE_VAR="UPDATE_REQ"
  cat > "${!FILE_VAR}" <<PHP
<?php
namespace App\Http\Requests\\${MODULE};

use Illuminate\Foundation\Http\FormRequest;

class ${ACTION}${ENTITY}Request extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array
    {
        return [
            'name'   => ['required', 'string', 'max:255'],
            'status' => ['nullable', 'string'],
        ];
    }
}
PHP
done

# Policy
cat > "$POLICY_PATH" <<PHP
<?php
namespace App\Policies;

use App\Models\Auth\User;
use App\Models\\${MODULE}\\${ENTITY};

class ${ENTITY}Policy
{
    public function viewAny(User \$u): bool { return \$u->hasPermission('${MODULE,,}.view'); }
    public function view(User \$u, ${ENTITY} \$m): bool
        { return \$u->organization_id === \$m->organization_id && \$u->hasPermission('${MODULE,,}.view'); }
    public function create(User \$u): bool { return \$u->hasPermission('${MODULE,,}.create'); }
    public function update(User \$u, ${ENTITY} \$m): bool
        { return \$u->organization_id === \$m->organization_id && \$u->hasPermission('${MODULE,,}.update'); }
    public function delete(User \$u, ${ENTITY} \$m): bool
        { return \$u->organization_id === \$m->organization_id && \$u->hasPermission('${MODULE,,}.delete'); }
}
PHP

echo "Generated ${ENTITY}:"
echo "  $CTRL_PATH"
echo "  $SVC_PATH"
echo "  $RES_PATH"
echo "  $STORE_REQ / $UPDATE_REQ"
echo "  $POLICY_PATH"
echo "  → Register policy in AppServiceProvider::boot()"
echo "  → Register route in routes/api.php"

