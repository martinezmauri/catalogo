import { supabase } from "./supabase";
import type { Product, ProductWithRelations, Brand, Category } from "./types";

/* ─────────────────────────────────────────────
   Product Service — CRUD operations
   ───────────────────────────────────────────── */

export const productService = {
  /**
   * Fetch all products with brand + category relations
   */
  async getAll(): Promise<ProductWithRelations[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*, brand:brands(*), category:categories(*)")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((p) => ({
      ...p,
      brand: Array.isArray(p.brand) ? p.brand[0] : p.brand,
      category: Array.isArray(p.category) ? p.category[0] : p.category,
    })) as ProductWithRelations[];
  },

  /**
   * Get a single product by ID
   */
  async getById(id: string): Promise<ProductWithRelations | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*, brand:brands(*), category:categories(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = data as any;
    return {
      ...p,
      brand: Array.isArray(p.brand) ? p.brand[0] : p.brand,
      category: Array.isArray(p.category) ? p.category[0] : p.category,
    } as ProductWithRelations;
  },

  /**
   * Create a new product
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(product: Record<string, any>): Promise<Product> {
    const { data, error } = await (supabase as any)
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  /**
   * Update an existing product
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(id: string, updates: Record<string, any>): Promise<Product> {
    const { data, error } = await (supabase as any)
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  /**
   * Delete a product (hard delete)
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
  },

  /**
   * Upload product image to Supabase Storage
   */
  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  },

  /**
   * Delete product image from Storage
   */
  async deleteImage(imageUrl: string): Promise<void> {
    // Extract path from full URL
    const path = imageUrl.split("/product-images/")[1];
    if (!path) return;

    const { error } = await supabase.storage
      .from("product-images")
      .remove([path]);

    if (error) throw error;
  },
};

/* ─────────────────────────────────────────────
   Brand Service
   ───────────────────────────────────────────── */

export const brandService = {
  async getAll(): Promise<Brand[]> {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data as Brand[];
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(brand: Record<string, any>): Promise<Brand> {
    const { data, error } = await (supabase as any)
      .from("brands")
      .insert(brand)
      .select()
      .single();

    if (error) throw error;
    return data as Brand;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(id: string, updates: Record<string, any>): Promise<Brand> {
    const { data, error } = await (supabase as any)
      .from("brands")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Brand;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) throw error;
  },
};

/* ─────────────────────────────────────────────
   Category Service
   ───────────────────────────────────────────── */

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data as Category[];
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(category: Record<string, any>): Promise<Category> {
    const { data, error } = await (supabase as any)
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(id: string, updates: Record<string, any>): Promise<Category> {
    const { data, error } = await (supabase as any)
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
  },
};
