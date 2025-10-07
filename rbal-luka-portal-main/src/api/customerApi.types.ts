export interface ListCustomersParams {
  id?: string | null;
  identifierContains?: string | null;
  nipt?: string | null;
  fullNameContains?: string | null;
  sectorType?: string | null;
  status?: string | null;
  limit?: number;
  offset?: number;
}

export interface CustomerListing {
  customers: CustomerListingItem[];
  total: number;
}

export interface CustomerListingItem {
  id: string;
  name: string;
  nipt: string;
  status: string;
  sectorType: string;
}
