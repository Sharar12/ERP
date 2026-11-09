<?php
namespace App\Traits;

use App\Models\System\DocumentSequence;
use Illuminate\Support\Facades\DB;

trait HasDocumentNumber
{
    public static function bootHasDocumentNumber(): void
    {
        static::creating(function ($model) {
            if (empty($model->number) && $model->organization_id) {
                $model->number = $model->generateDocumentNumber();
            }
        });
    }

    protected function generateDocumentNumber(): string
    {
        $entity = class_basename($this);                    // e.g. "Invoice"
        $entity = strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $entity));

        return DB::transaction(function () use ($entity) {
            $seq = DocumentSequence::lockForUpdate()
                ->firstOrCreate(
                    [
                        'organization_id' => $this->organization_id,
                        'entity_type' => $entity,
                        'fiscal_year' => now()->format('Y'),
                    ],
                    ['prefix' => strtoupper(substr($entity, 0, 3)) . '-', 'next_number' => 1]
                );

            $number = $seq->prefix
                . str_pad((string) $seq->next_number, $seq->padding, '0', STR_PAD_LEFT);

            $seq->increment('next_number');
            return $number;
        });
    }
}
