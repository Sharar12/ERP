<?php
namespace App\Http\Controllers\Api\V1\System;

use App\Http\Controllers\Controller;
use App\Models\System\{Module, OrganizationModule};
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function index(Request $request)
    {
        $orgId = $request->user()->organization_id;
        $modules = Module::with('dependencies')->get()->map(function ($m) use ($orgId) {
            $orgMod = OrganizationModule::where('organization_id', $orgId)->where('module_id', $m->id)->first();
            $enabled = $orgMod ? (bool)$orgMod->enabled : (bool)$m->is_core;
            return [
                'id' => $m->id,
                'key' => $m->key,
                'name' => $m->name,
                'icon' => $m->icon ?? 'Layers',
                'category' => $m->category ?? 'General',
                'description' => $m->description ?? '',
                'enabled' => $enabled,
                'is_core' => (bool)$m->is_core,
                'defaultEnabled' => (bool)$m->is_core,
                'dependencies' => $m->dependencies->pluck('name')->all(),
            ];
        });
        return ApiResponse::success($modules);
    }

    public function toggle(Request $request, Module $module)
    {
        $orgId = $request->user()->organization_id;
        $orgMod = OrganizationModule::firstOrCreate(
            ['organization_id' => $orgId, 'module_id' => $module->id],
            ['enabled' => false]
        );
        $orgMod->update(['enabled' => !$orgMod->enabled, 'enabled_at' => now()]);
        return ApiResponse::success($orgMod, 'Module toggled');
    }
}
