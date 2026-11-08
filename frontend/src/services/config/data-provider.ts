/* =========================================================================
 * DATA PROVIDER CONFIGURATION
 * Phase 1: mock
 * Phase 3: api  (Laravel REST)
 *
 * Flip PROVIDER and swap the imports in each *.service.ts file to move the
 * entire ERP from mock to live data without touching UI components.
 * ========================================================================= */
export const PROVIDER: "mock" | "api" = "mock";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

