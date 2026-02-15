"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FiPrinter,
  FiChevronDown,
  FiPackage,
  FiLoader,
  FiCheckSquare,
  FiSquare,
} from "react-icons/fi";
import { toast } from "sonner";
import type { Brand, Category, ProductWithRelations } from "@/lib/types";
import { productService, brandService, categoryService } from "@/lib/services";
import Image from "next/image";

export default function CatalogoPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<ProductWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Selections
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set(),
  );
  const [catalogTitle, setCatalogTitle] = useState("CATÁLOGO");

  const fetchBaseData = useCallback(async () => {
    try {
      const [brs, cats] = await Promise.all([
        brandService.getAll(),
        categoryService.getAll(),
      ]);
      setBrands(brs);
      setCategories(cats);
    } catch {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBaseData();
  }, [fetchBaseData]);

  // Load products when brand changes
  const loadProducts = useCallback(async () => {
    if (!selectedBrand) {
      setAllProducts([]);
      return;
    }
    setLoadingProducts(true);
    try {
      const all = await productService.getAll();
      let filtered = all.filter((p) => p.brand_id === selectedBrand);
      if (selectedCategory) {
        filtered = filtered.filter((p) => p.category_id === selectedCategory);
      }
      setAllProducts(filtered);
      // Select all by default
      setSelectedProductIds(new Set(filtered.map((p) => p.id)));
    } catch {
      toast.error("Error al cargar productos");
    } finally {
      setLoadingProducts(false);
    }
  }, [selectedBrand, selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Toggle product selection
  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedProductIds.size === allProducts.length) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(allProducts.map((p) => p.id)));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Selected products for the preview
  const selectedProducts = allProducts.filter((p) =>
    selectedProductIds.has(p.id),
  );

  // Determine grid layout based on product count per page
  // We want products to fill the A4 space. A4 = 210mm × 297mm
  // Header ~60px, footer ~40px, content area ~245mm
  // We'll use 3 columns always, and calculate rows automatically
  const PRODUCTS_PER_PAGE = 9; // 3×3 grid fills A4 well

  const pages: ProductWithRelations[][] = [];
  for (let i = 0; i < selectedProducts.length; i += PRODUCTS_PER_PAGE) {
    pages.push(selectedProducts.slice(i, i + PRODUCTS_PER_PAGE));
  }

  const selectedBrandData = brands.find((b) => b.id === selectedBrand);

  // Calculate grid layout based on product count on a page
  const getGridCols = (count: number): number => {
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 4) return 2;
    return 3;
  };

  const getGridRows = (count: number): number => {
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    return 3;
  };

  return (
    <div>
      {/* ========= CONTROLS (hidden from print) ========= */}
      <div className="no-print">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Generar Catálogo</h1>
          <p className="mt-1 text-sm text-surface-400">
            Seleccioná marca, elegí productos y generá hojas A4 imprimibles
          </p>
        </div>

        {/* Selection controls */}
        <div className="mb-5 flex flex-wrap items-end gap-4 rounded-xl border border-surface-800 bg-surface-900/60 p-5 backdrop-blur-sm">
          {/* Brand */}
          <div className="flex-1 min-w-[180px]">
            <label className="mb-1.5 block text-xs font-medium text-surface-400">
              Marca *
            </label>
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedCategory("");
                }}
                className="w-full appearance-none rounded-lg border border-surface-700 bg-surface-800/60 px-3 py-2.5 pr-8 text-sm text-white outline-none transition-colors focus:border-primary-500 cursor-pointer"
              >
                <option value="">Seleccionar marca...</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            </div>
          </div>

          {/* Category */}
          <div className="flex-1 min-w-[180px]">
            <label className="mb-1.5 block text-xs font-medium text-surface-400">
              Categoría (opcional)
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none rounded-lg border border-surface-700 bg-surface-800/60 px-3 py-2.5 pr-8 text-sm text-white outline-none transition-colors focus:border-primary-500 cursor-pointer"
              >
                <option value="">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            </div>
          </div>

          {/* Title */}
          <div className="flex-1 min-w-[180px]">
            <label className="mb-1.5 block text-xs font-medium text-surface-400">
              Título del catálogo
            </label>
            <input
              type="text"
              value={catalogTitle}
              onChange={(e) => setCatalogTitle(e.target.value)}
              placeholder="CATÁLOGO CAFÉ"
              className="w-full rounded-lg border border-surface-700 bg-surface-800/60 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
            />
          </div>
        </div>

        {/* Product selector */}
        {allProducts.length > 0 && (
          <div className="mb-6 rounded-xl border border-surface-800 bg-surface-900/60 p-5 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Seleccionar productos ({selectedProductIds.size} de{" "}
                {allProducts.length})
              </h2>
              <button
                onClick={toggleAll}
                className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors"
              >
                {selectedProductIds.size === allProducts.length
                  ? "Deseleccionar todos"
                  : "Seleccionar todos"}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {allProducts.map((product) => {
                const isSelected = selectedProductIds.has(product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    className={`relative flex flex-col items-center gap-2 rounded-lg border p-3 text-left transition-all ${
                      isSelected
                        ? "border-primary-500 bg-primary-500/10 ring-1 ring-primary-500/30"
                        : "border-surface-700 bg-surface-800/40 hover:border-surface-600"
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="absolute top-2 right-2">
                      {isSelected ? (
                        <FiCheckSquare className="h-4 w-4 text-primary-400" />
                      ) : (
                        <FiSquare className="h-4 w-4 text-surface-500" />
                      )}
                    </div>

                    {/* Thumbnail */}
                    <div className="h-14 w-14 flex items-center justify-center rounded bg-surface-700/50 overflow-hidden">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={56}
                          height={56}
                          className="object-contain"
                        />
                      ) : (
                        <FiPackage className="h-5 w-5 text-surface-500" />
                      )}
                    </div>

                    {/* Name */}
                    <p className="text-[11px] text-center leading-tight text-surface-300 line-clamp-2">
                      {product.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {loadingProducts && (
          <div className="mb-6 flex items-center justify-center gap-2 py-8 text-surface-400">
            <FiLoader className="h-5 w-5 animate-spin" />
            <span className="text-sm">Cargando productos...</span>
          </div>
        )}

        {/* Print bar */}
        {selectedProducts.length > 0 && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-3">
            <p className="text-sm text-surface-300">
              <span className="font-semibold text-white">
                {selectedProducts.length}
              </span>{" "}
              producto{selectedProducts.length !== 1 && "s"} •{" "}
              <span className="font-semibold text-white">{pages.length}</span>{" "}
              página{pages.length !== 1 && "s"} A4
            </p>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-emerald-500 active:scale-[0.98]"
            >
              <FiPrinter className="h-4 w-4" />
              Imprimir / Guardar PDF
            </button>
          </div>
        )}
      </div>

      {/* ========= A4 PREVIEW (this is what prints) ========= */}
      {selectedProducts.length > 0 &&
        pages.map((pageProducts, pageIndex) => {
          const rows = getGridRows(pageProducts.length);
          const cols = getGridCols(pageProducts.length);

          return (
            <div
              key={pageIndex}
              className="catalog-page relative mx-auto mb-8 bg-white overflow-hidden"
              style={{
                width: "210mm",
                height: "297mm",
                boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
                borderRadius: "4px",
                fontFamily: "'Inter', Arial, sans-serif",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* ── Header ────────────────── */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                  padding: "18px 30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0,
                }}
              >
                <div>
                  <h2
                    style={{
                      color: "white",
                      fontSize: "24px",
                      fontWeight: 800,
                      letterSpacing: "2px",
                      margin: 0,
                      textTransform: "uppercase",
                    }}
                  >
                    {catalogTitle}
                  </h2>
                  {selectedBrandData && (
                    <p
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "14px",
                        fontWeight: 500,
                        margin: "4px 0 0",
                      }}
                    >
                      {selectedBrandData.name}
                    </p>
                  )}
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                    padding: "8px 20px",
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontSize: "18px",
                      fontWeight: 700,
                      letterSpacing: "1px",
                    }}
                  >
                    {selectedBrandData?.name.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Red accent */}
              <div
                style={{
                  height: "6px",
                  background:
                    "linear-gradient(90deg, #dc2626, #ef4444, #dc2626)",
                  flexShrink: 0,
                }}
              />

              {/* ── Product grid — fills remaining space ── */}
              <div
                style={{
                  flex: 1,
                  padding: "30px 40px",
                  display: "grid",
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gridTemplateRows: `repeat(${rows}, 1fr)`,
                  gap: "30px",
                  alignContent: "stretch",
                }}
              >
                {pageProducts.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "transparent",
                    }}
                  >
                    {/* Product image — takes most of the card space */}
                    <div
                      style={{
                        flex: 1,
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 0,
                      }}
                    >
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-contain"
                          style={{ padding: "0" }}
                          sizes="300px"
                        />
                      ) : (
                        <FiPackage
                          style={{
                            width: "60px",
                            height: "60px",
                            color: "#e5e7eb",
                          }}
                        />
                      )}
                    </div>

                    {/* Product info */}
                    <div
                      style={{
                        padding: "16px 0 0",
                        textAlign: "center",
                        flexShrink: 0,
                      }}
                    >
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: 500,
                          color: "#4b5563",
                          margin: 0,
                          lineHeight: 1.2,
                        }}
                      >
                        {product.name}
                      </p>
                      {product.presentation && (
                        <p
                          style={{
                            fontSize: "24px",
                            fontWeight: 900,
                            color: "#111827",
                            margin: "8px 0 0",
                            letterSpacing: "-0.5px",
                          }}
                        >
                          {product.units_per_pack
                            ? `${product.units_per_pack} X ${product.presentation}`
                            : product.presentation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Footer ───────────────── */}
              <div
                style={{
                  padding: "8px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #e5e7eb",
                  backgroundColor: "#f9fafb",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: "8px", color: "#9ca3af" }}>
                  {selectedBrandData?.name} — {catalogTitle}
                </span>
                <span style={{ fontSize: "8px", color: "#9ca3af" }}>
                  Página {pageIndex + 1} de {pages.length}
                </span>
              </div>
            </div>
          );
        })}

      {/* Empty state */}
      {selectedProducts.length === 0 && !loading && !loadingProducts && (
        <div className="no-print flex flex-col items-center justify-center rounded-xl border border-surface-800 bg-surface-900/40 py-20">
          <FiPrinter className="mb-4 h-12 w-12 text-surface-600" />
          <p className="text-surface-400 text-sm">
            {allProducts.length > 0
              ? "Seleccioná al menos un producto para ver la vista previa"
              : "Seleccioná una marca para comenzar"}
          </p>
        </div>
      )}
    </div>
  );
}
