#!/usr/bin/env bash
# frontend/scripts/gen-api-service.sh
# Usage: ./gen-api-service.sh crm/customers Customer

ENDPOINT="$1"      # crm/customers
ENTITY="$2"        # Customer
FILE="src/services/api/$(echo $ENDPOINT | tr '/' '-' | sed 's|.*-||').api-service.ts"

cat > "$FILE" <<TS
// API SERVICE: ${ENTITY}
// Backend endpoints:
//   GET    /api/v1/${ENDPOINT}         → paginated list
//   POST   /api/v1/${ENDPOINT}         → create
//   GET    /api/v1/${ENDPOINT}/{id}    → detail
//   PUT    /api/v1/${ENDPOINT}/{id}    → update
//   DELETE /api/v1/${ENDPOINT}/{id}    → delete

import { apiFetch } from '@/lib/api-client';
import type { ${ENTITY}, PaginatedResult } from '@/types';

export const getAll = async (params?: Record<string, unknown>): Promise<PaginatedResult<${ENTITY}>> =>
  apiFetch<PaginatedResult<${ENTITY}>>('/${ENDPOINT}', { params });

export const getById = async (id: string): Promise<${ENTITY}> =>
  apiFetch<${ENTITY}>(\`/${ENDPOINT}/\${id}\`);

export const create = async (data: Partial<${ENTITY}>): Promise<${ENTITY}> =>
  apiFetch<${ENTITY}>('/${ENDPOINT}', { method: 'POST', body: data });

export const update = async (id: string, data: Partial<${ENTITY}>): Promise<${ENTITY}> =>
  apiFetch<${ENTITY}>(\`/${ENDPOINT}/\${id}\`, { method: 'PUT', body: data });

export const remove = async (id: string): Promise<void> =>
  apiFetch(\`/${ENDPOINT}/\${id}\`, { method: 'DELETE' });
TS

echo "Generated $FILE"

