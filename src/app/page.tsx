"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { FiPackage, FiTag, FiGrid, FiSearch, FiPlus } from "react-icons/fi";
import { toast } from "sonner";
import type { Brand, Category, ProductWithRelations } from "@/lib/types";
import { productService, brandService, categoryService } from "@/lib/services";
import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import ProductFormModal from "@/components/products/ProductFormModal";

export default function DashboardPage() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductWithRelations | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [prods, brs, cats] = await Promise.all([
        productService.getAll(),
        brandService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(prods);
      setBrands(brs);
      setCategories(cats);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesBrand = !selectedBrand || p.brand_id === selectedBrand;
      const matchesCategory =
        !selectedCategory || p.category_id === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.presentation?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBrand && matchesCategory && matchesSearch;
    });
  }, [products, selectedBrand, selectedCategory, searchQuery]);

  // Handlers
  const handleEdit = (product: ProductWithRelations) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (product: ProductWithRelations) => {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;

    try {
      if (product.image_url) {
        await productService.deleteImage(product.image_url);
      }
      await productService.delete(product.id);
      toast.success("Producto eliminado");
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error al eliminar");
    }
  };

  const handleCreateNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleSaved = () => {
    fetchData();
  };

  // Stats
  const stats = [
    {
      label: "Productos",
      value: products.length,
      icon: FiPackage,
      color: "text-primary-400",
      bg: "bg-primary-500/10",
    },
    {
      label: "Marcas",
      value: brands.length,
      icon: FiTag,
      color: "text-accent-400",
      bg: "bg-accent-500/10",
    },
    {
      label: "Categorías",
      value: categories.length,
      icon: FiGrid,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div>
      {/* Header with Add button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Catálogo de Productos
          </h1>
          <p className="mt-1 text-sm text-surface-400">
            Gestiona y visualiza todos tus productos
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-500 hover:shadow-primary-500/30 active:scale-[0.98]"
        >
          <FiPlus className="h-4 w-4" />
          Nuevo producto
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-xl border border-surface-800 bg-surface-900/60 px-5 py-4 backdrop-blur-sm"
            >
              <div className={`rounded-lg ${stat.bg} p-2.5`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {loading ? (
                    <span className="inline-block h-7 w-10 animate-pulse rounded bg-surface-800" />
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="text-xs text-surface-400">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <ProductFilters
          brands={brands}
          categories={categories}
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onBrandChange={setSelectedBrand}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Results count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-surface-400">
          {loading
            ? "Cargando..."
            : `${filteredProducts.length} producto${filteredProducts.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-surface-800 bg-surface-900/60"
            >
              <div className="aspect-square bg-surface-800/50 rounded-t-xl" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 rounded bg-surface-800" />
                <div className="h-3 w-1/2 rounded bg-surface-800" />
                <div className="h-3 w-1/3 rounded bg-surface-800 mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-surface-800 bg-surface-900/40 py-20">
          <FiSearch className="h-12 w-12 text-surface-600 mb-4" />
          <p className="text-surface-400 text-sm">
            No se encontraron productos
          </p>
          {(selectedBrand || selectedCategory || searchQuery) && (
            <button
              onClick={() => {
                setSelectedBrand("");
                setSelectedCategory("");
                setSearchQuery("");
              }}
              className="mt-3 text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSaved={handleSaved}
        brands={brands}
        categories={categories}
        editProduct={editingProduct}
      />
    </div>
  );
}
