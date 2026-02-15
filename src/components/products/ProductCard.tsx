"use client";

import Image from "next/image";
import { FiPackage, FiTag, FiEdit2, FiTrash2 } from "react-icons/fi";
import type { ProductWithRelations } from "@/lib/types";

interface ProductCardProps {
  product: ProductWithRelations;
  onEdit?: (product: ProductWithRelations) => void;
  onDelete?: (product: ProductWithRelations) => void;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-surface-800 bg-surface-900/60 backdrop-blur-sm transition-all duration-300 hover:border-surface-700 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-surface-800/50">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FiPackage className="h-12 w-12 text-surface-600" />
          </div>
        )}

        {/* Brand badge */}
        <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-surface-900/80 px-2.5 py-1 backdrop-blur-sm">
          {product.brand?.logo_url ? (
            <Image
              src={product.brand.logo_url}
              alt={product.brand.name}
              width={14}
              height={14}
              className="rounded-sm"
            />
          ) : (
            <FiTag className="h-3 w-3 text-primary-400" />
          )}
          <span className="text-[10px] font-semibold text-surface-200">
            {product.brand?.name}
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute right-2 top-2 rounded-full bg-primary-600/20 px-2 py-0.5 backdrop-blur-sm">
          <span className="text-[10px] font-medium text-primary-300">
            {product.category?.name}
          </span>
        </div>

        {/* Hover action buttons */}
        {(onEdit || onDelete) && (
          <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="rounded-lg bg-surface-900/80 p-1.5 text-surface-300 backdrop-blur-sm transition-colors hover:bg-primary-600 hover:text-white"
                title="Editar"
              >
                <FiEdit2 className="h-3.5 w-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(product);
                }}
                className="rounded-lg bg-surface-900/80 p-1.5 text-surface-300 backdrop-blur-sm transition-colors hover:bg-red-600 hover:text-white"
                title="Eliminar"
              >
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">
          {product.name}
        </h3>

        {/* Presentation / gramaje */}
        {product.presentation && (
          <p className="mt-1 text-xs text-surface-400">
            {product.presentation}
          </p>
        )}

        {/* Footer: pack info */}
        {product.units_per_pack && (
          <div className="mt-3">
            <p className="text-[10px] text-surface-500 leading-tight">
              {product.units_per_pack} u. x {product.pack_label || "bulto"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
