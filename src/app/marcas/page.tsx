"use client";

import { useEffect, useState, useCallback } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiTag } from "react-icons/fi";
import { toast } from "sonner";
import type { Brand } from "@/lib/types";
import { brandService } from "@/lib/services";

export default function MarcasPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Inline form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchBrands = useCallback(async () => {
    try {
      const data = await brandService.getAll();
      setBrands(data);
    } catch {
      toast.error("Error al cargar marcas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await brandService.update(editingId, { name: formName.trim() });
        toast.success("Marca actualizada");
      } else {
        await brandService.create({
          name: formName.trim(),
          sort_order: brands.length,
        });
        toast.success("Marca creada");
      }
      resetForm();
      fetchBrands();
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setFormName(brand.name);
    setShowForm(true);
  };

  const handleDelete = async (brand: Brand) => {
    if (
      !confirm(
        `¿Eliminar marca "${brand.name}"? Se eliminarán todos sus productos asociados.`,
      )
    )
      return;

    try {
      await brandService.delete(brand.id);
      toast.success("Marca eliminada");
      fetchBrands();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormName("");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Marcas</h1>
          <p className="mt-1 text-sm text-surface-400">
            Gestiona las marcas/proveedores de tus productos
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-500 active:scale-[0.98]"
          >
            <FiPlus className="h-4 w-4" />
            Nueva marca
          </button>
        )}
      </div>

      {/* Inline form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 flex items-end gap-3 rounded-xl border border-surface-700 bg-surface-900/60 p-4 backdrop-blur-sm"
        >
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-surface-400">
              {editingId ? "Editar marca" : "Nueva marca"}
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Nombre de la marca"
              autoFocus
              className="w-full rounded-lg border border-surface-700 bg-surface-800/60 px-3 py-2.5 text-sm text-white placeholder:text-surface-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-500 disabled:opacity-50"
          >
            {saving ? "Guardando..." : editingId ? "Guardar" : "Crear"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg border border-surface-700 px-4 py-2.5 text-sm font-medium text-surface-300 transition-colors hover:bg-surface-800"
          >
            Cancelar
          </button>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse items-center gap-4 rounded-xl border border-surface-800 bg-surface-900/60 p-4"
            >
              <div className="h-10 w-10 rounded-lg bg-surface-800" />
              <div className="h-4 w-40 rounded bg-surface-800" />
            </div>
          ))}
        </div>
      ) : brands.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-surface-800 bg-surface-900/40 py-16">
          <FiTag className="mb-3 h-10 w-10 text-surface-600" />
          <p className="text-sm text-surface-400">No hay marcas todavía</p>
        </div>
      ) : (
        <div className="space-y-2">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group flex items-center justify-between rounded-xl border border-surface-800 bg-surface-900/60 px-5 py-4 transition-colors hover:border-surface-700"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10">
                  <FiTag className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{brand.name}</p>
                  <p className="text-xs text-surface-500">
                    Orden: {brand.sort_order}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleEdit(brand)}
                  className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-800 hover:text-primary-400"
                  title="Editar"
                >
                  <FiEdit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(brand)}
                  className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-800 hover:text-red-400"
                  title="Eliminar"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
