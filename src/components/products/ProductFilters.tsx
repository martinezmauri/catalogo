"use client";

import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import type { Brand, Category } from "@/lib/types";

interface ProductFiltersProps {
  brands: Brand[];
  categories: Category[];
  selectedBrand: string;
  selectedCategory: string;
  searchQuery: string;
  onBrandChange: (brandId: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onSearchChange: (query: string) => void;
}

export default function ProductFilters({
  brands,
  categories,
  selectedBrand,
  selectedCategory,
  searchQuery,
  onBrandChange,
  onCategoryChange,
  onSearchChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[220px]">
        <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-surface-700 bg-surface-800/60 py-2 pl-9 pr-9 text-sm text-surface-100 placeholder:text-surface-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300"
          >
            <FiX className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Brand filter */}
      <select
        value={selectedBrand}
        onChange={(e) => onBrandChange(e.target.value)}
        className="rounded-lg border border-surface-700 bg-surface-800/60 px-3 py-2 text-sm text-surface-200 outline-none transition-colors focus:border-primary-500 cursor-pointer"
      >
        <option value="">Todas las marcas</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>

      {/* Category filter */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-lg border border-surface-700 bg-surface-800/60 px-3 py-2 text-sm text-surface-200 outline-none transition-colors focus:border-primary-500 cursor-pointer"
      >
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
