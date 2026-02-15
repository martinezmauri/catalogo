"use client";

import { useState, useEffect, useRef } from "react";
import { FiX, FiUpload, FiImage } from "react-icons/fi";
import type { Brand, Category, ProductWithRelations } from "@/lib/types";
import { productService } from "@/lib/services";
import { toast } from "sonner";
import Image from "next/image";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  brands: Brand[];
  categories: Category[];
  editProduct?: ProductWithRelations | null;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSaved,
  brands,
  categories,
  editProduct,
}: ProductFormModalProps) {
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    brand_id: "",
    category_id: "",
    presentation: "",
    units_per_pack: "",
    pack_label: "bulto",
  });

  // Populate form when editing
  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name,
        description: editProduct.description || "",
        brand_id: editProduct.brand_id,
        category_id: editProduct.category_id,
        presentation: editProduct.presentation || "",
        units_per_pack: editProduct.units_per_pack?.toString() || "",
        pack_label: editProduct.pack_label || "bulto",
      });
      setImagePreview(editProduct.image_url);
    } else {
      setForm({
        name: "",
        description: "",
        brand_id: brands[0]?.id || "",
        category_id: categories[0]?.id || "",
        presentation: "",
        units_per_pack: "",
        pack_label: "bulto",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [editProduct, isOpen, brands, categories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten archivos de imagen");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    if (!form.brand_id) {
      toast.error("Seleccioná una marca");
      return;
    }
    if (!form.category_id) {
      toast.error("Seleccioná una categoría");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = editProduct?.image_url || null;

      // Upload new image if selected
      if (imageFile) {
        // Delete old image if editing
        if (editProduct?.image_url) {
          await productService.deleteImage(editProduct.image_url);
        }
        imageUrl = await productService.uploadImage(imageFile);
      }

      const productData = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        brand_id: form.brand_id,
        category_id: form.category_id,
        presentation: form.presentation.trim() || null,
        units_per_pack: form.units_per_pack
          ? parseInt(form.units_per_pack)
          : null,
        pack_label: form.pack_label || "bulto",
        image_url: imageUrl,
        is_active: true,
        sort_order: 0,
      };

      if (editProduct) {
        await productService.update(editProduct.id, productData);
        toast.success("Producto actualizado");
      } else {
        await productService.create(productData);
        toast.success("Producto creado");
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Error al guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-surface-700 bg-surface-900 shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            {editProduct ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-800 hover:text-white"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          {/* Image upload */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-surface-400">
              Imagen del producto
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-surface-700 transition-colors hover:border-primary-500/50"
            >
              {imagePreview ? (
                <div className="relative aspect-video w-full">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-sm font-medium text-white">
                      Cambiar imagen
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-surface-500">
                  <FiImage className="mb-2 h-8 w-8" />
                  <p className="text-sm">Click para subir imagen</p>
                  <p className="text-xs text-surface-600 mt-1">
                    JPG, PNG, WebP • máx 5MB
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-surface-400">
              Nombre *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Nescafé Clásico"
              className="w-full rounded-lg border border-surface-700 bg-surface-800/60 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
            />
          </div>

          {/* Brand + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-400">
                Marca *
              </label>
              <select
                value={form.brand_id}
                onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                className="w-full rounded-lg border border-surface-700 bg-surface-800/60 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-primary-500 cursor-pointer"
              >
                <option value="">Seleccionar...</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-400">
                Categoría *
              </label>
              <select
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
                className="w-full rounded-lg border border-surface-700 bg-surface-800/60 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-primary-500 cursor-pointer"
              >
                <option value="">Seleccionar...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-surface-400">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Descripción corta del producto"
              rows={2}
              className="w-full rounded-lg border border-surface-700 bg-surface-800/60 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 resize-none"
            />
          </div>

          {/* Presentation + Units row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-400">
                Gramaje / Presentación
              </label>
              <input
                type="text"
                value={form.presentation}
                onChange={(e) =>
                  setForm({ ...form, presentation: e.target.value })
                }
                placeholder="360 gr"
                className="w-full rounded-lg border border-surface-700 bg-surface-800/60 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-400">
                Unidades x bulto
              </label>
              <input
                type="number"
                value={form.units_per_pack}
                onChange={(e) =>
                  setForm({ ...form, units_per_pack: e.target.value })
                }
                placeholder="12"
                min="1"
                className="w-full rounded-lg border border-surface-700 bg-surface-800/60 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-400">
                Tipo empaque
              </label>
              <select
                value={form.pack_label}
                onChange={(e) =>
                  setForm({ ...form, pack_label: e.target.value })
                }
                className="w-full rounded-lg border border-surface-700 bg-surface-800/60 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-primary-500 cursor-pointer"
              >
                <option value="bulto">Bulto</option>
                <option value="caja">Caja</option>
                <option value="pack">Pack</option>
                <option value="bolsa">Bolsa</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-surface-700 px-4 py-2 text-sm font-medium text-surface-300 transition-colors hover:bg-surface-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Guardando...
                </span>
              ) : editProduct ? (
                "Guardar cambios"
              ) : (
                "Crear producto"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
