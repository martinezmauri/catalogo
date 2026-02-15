import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CatálogoApp — Generador de Catálogos Mayoristas",
  description:
    "Gestiona productos y genera catálogos PDF profesionales para fuerza de ventas mayorista.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <Sidebar />
        <main className="ml-64 min-h-screen">
          <div className="px-8 py-6">{children}</div>
        </main>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-surface-800)",
              border: "1px solid var(--color-surface-700)",
              color: "var(--color-surface-100)",
            },
          }}
        />
      </body>
    </html>
  );
}
