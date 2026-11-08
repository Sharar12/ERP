/* =========================================================================
 * MOCK STORE — in-memory session store used by all mock services.
 * MOCK SERVICE: This file is mock-only. During Phase 3 it is deleted.
 * ========================================================================= */
import * as seed from "@/mock-data/seed";
import type { ID } from "@/types";

export const mockStore: Record<string, any> = {
  organizations: [...seed.MOCK_ORGANIZATIONS],
  branches: [...seed.MOCK_BRANCHES],
  roles: [...seed.MOCK_ROLES],
  users: [...seed.MOCK_USERS],
  customers: [...seed.MOCK_CUSTOMERS],
  leads: [...seed.MOCK_LEADS],
  invoices: [...seed.MOCK_INVOICES],
  salesOrders: [...seed.MOCK_SALES_ORDERS],
  suppliers: [...seed.MOCK_SUPPLIERS],
  purchaseOrders: [...seed.MOCK_PURCHASE_ORDERS],
  products: [...seed.MOCK_PRODUCTS],
  warehouses: [...seed.MOCK_WAREHOUSES],
  transactions: [...seed.MOCK_TRANSACTIONS],
  employees: [...seed.MOCK_EMPLOYEES],
  projects: [...seed.MOCK_PROJECTS],
  notifications: [...seed.MOCK_NOTIFICATIONS],
  modules: [...seed.MOCK_MODULES],
};

/* Generic CRUD helper — every mock service wraps this. */
export function mockCrud<
  T extends { id: ID; createdAt: string; updatedAt: string },
  C extends Partial<T> = Partial<T>,
  U extends Partial<T> = Partial<T>,
>(key: string, prefix: string) {
  if (!mockStore[key]) mockStore[key] = [];
  return {
    getAll: async (): Promise<T[]> => structuredClone(mockStore[key] as T[]),
    getById: async (id: ID): Promise<T | null> => {
      const list = mockStore[key] as T[];
      return structuredClone(list.find((x) => x.id === id) ?? null);
    },
    create: async (data: C): Promise<T> => {
      const list = mockStore[key] as T[];
      const now = new Date().toISOString();
      const entity = {
        ...(data as any),
        id: `${prefix}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: now,
        updatedAt: now,
      } as T;
      list.unshift(entity);
      return structuredClone(entity);
    },
    update: async (id: ID, data: U): Promise<T> => {
      const list = mockStore[key] as T[];
      const idx = list.findIndex((x) => x.id === id);
      if (idx === -1) throw new Error(`Not found: ${id}`);
      list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
      return structuredClone(list[idx]);
    },
    delete: async (id: ID): Promise<void> => {
      const list = mockStore[key] as T[];
      const idx = list.findIndex((x) => x.id === id);
      if (idx >= 0) list.splice(idx, 1);
    },
  };
}
