/* ───────────────────────────────────────────────
   Database types – Supabase schema
   ─────────────────────────────────────────────── */

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: Brand;
        Insert: BrandInsert;
        Update: BrandUpdate;
      };
      categories: {
        Row: Category;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
      };
      products: {
        Row: Product;
        Insert: ProductInsert;
        Update: ProductUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

/* ── Brands ───────────────────────────────────── */

export interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
  created_at: string;
}

export type BrandInsert = Omit<Brand, "id" | "created_at">;
export type BrandUpdate = Partial<BrandInsert>;

/* ── Categories ───────────────────────────────── */

export interface Category {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export type CategoryInsert = Omit<Category, "id" | "created_at">;
export type CategoryUpdate = Partial<CategoryInsert>;

/* ── Products ─────────────────────────────────── */

export interface Product {
  id: string;
  brand_id: string;
  category_id: string;
  name: string;
  description: string | null;
  presentation: string | null;
  units_per_pack: number | null;
  pack_label: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ProductInsert = Omit<Product, "id" | "created_at" | "updated_at">;
export type ProductUpdate = Partial<ProductInsert>;

/* ── Extended types (with joins) ──────────────── */

export interface ProductWithRelations extends Product {
  brand: Brand;
  category: Category;
}

/* ── Catalog builder types ────────────────────── */

export type CatalogLayout = "grid-3x4" | "grid-2x3" | "compact-list";

export interface CatalogConfig {
  title: string;
  brandIds: string[];
  categoryIds: string[];
  layout: CatalogLayout;
  showPackInfo: boolean;
  includeCoverPage: boolean;
}
