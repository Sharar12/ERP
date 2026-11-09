<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'email'        => $this->email,
            'phone'        => $this->phone,
            'avatar'       => $this->avatar_path,
            'jobTitle'     => $this->job_title,
            'status'       => $this->status,
            'locale'       => $this->locale,
            'timezone'     => $this->timezone,
            'organization' => $this->whenLoaded('organization', fn () => [
                'id'   => $this->organization->id,
                'name' => $this->organization->name,
                'slug' => $this->organization->slug,
            ]),
            'roles' => $this->whenLoaded('roles', fn () =>
                $this->roles->map(fn ($r) => [
                    'id'          => $r->id,
                    'name'        => $r->name,
                    'slug'        => $r->slug,
                    'permissions' => $r->relationLoaded('permissions')
                        ? $r->permissions->pluck('slug')
                        : [],
                ])
            ),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

