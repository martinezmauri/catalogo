"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiPackage, FiTag, FiGrid, FiFileText, FiHome } from "react-icons/fi";

const navItems = [
  { href: "/", label: "Dashboard", icon: FiHome },
  { href: "/marcas", label: "Marcas", icon: FiTag },
  { href: "/categorias", label: "Categorías", icon: FiGrid },
  { href: "/catalogo", label: "Generar Catálogo", icon: FiFileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-surface-800 bg-surface-900/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-surface-800 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
          <FiFileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white">
            CatálogoApp
          </h1>
          <p className="text-[10px] text-surface-400">Generador de catálogos</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary-600/20 text-primary-400 shadow-sm shadow-primary-500/10"
                  : "text-surface-400 hover:bg-surface-800 hover:text-surface-200"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                  isActive
                    ? "text-primary-400"
                    : "text-surface-500 group-hover:text-surface-300"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-surface-800 px-4 py-3">
        <p className="text-[10px] text-surface-500">
          v1.0 • Catálogo Mayorista
        </p>
      </div>
    </aside>
  );
}
