
import Link from "next/link";
import AdminHeader from "@/components/layout/AdminHeader";
import { getServerUser } from "@/lib/auth-server";


export default async function AdminDashboard() {
    const user = await getServerUser();
    return (
        <main className="min-h-screen bg-slate-950 text-white">
          <AdminHeader user={user} />
    
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-12">
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Panel de Administración
              </h1>
            </div>
    
            {/* Main Action Buttons */}
            <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Crear Producto Button */}
              <Link
                href="/dashboard/admin/productos/nuevo"
                className="group relative overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-8 transition hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:via-emerald-500/10 transition" />
                <div className="relative">
                  <div className="mb-4 inline-block rounded-lg bg-emerald-500/20 p-3 text-3xl">
                    ➕
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Crear Producto</h3>
                  <p className="text-sm text-slate-400">
                    Agrega nuevas prendas a tu catálogo
                  </p>
                  <div className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">
                    Crear producto →
                  </div>
                </div>
              </Link>
    
              {/* Ver Productos Button */}
              <Link
                href="/dashboard/admin/productos"
                className="group relative overflow-hidden rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-8 transition hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:via-blue-500/10 transition" />
                <div className="relative">
                  <div className="mb-4 inline-block rounded-lg bg-blue-500/20 p-3 text-3xl">
                    📦
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Productos</h3>
                  <p className="text-sm text-slate-400">
                    Gestiona todos tus productos
                  </p>
                  <div className="mt-4 inline-flex items-center text-sm font-semibold text-blue-400 group-hover:text-blue-300">
                    Ver productos →
                  </div>
                </div>
              </Link>
    
              {/* Configuración Button */}
              <Link
                href="/dashboard/admin/usuarios"
                className="group relative overflow-hidden rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-8 transition hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:via-purple-500/10 transition" />
                <div className="relative">
                  <div className="mb-4 inline-block rounded-lg bg-purple-500/20 p-3 text-3xl">
                    ⚙️
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Usuarios</h3>
                  <p className="text-sm text-slate-400">
                    Gestiona los usuarios de tu tienda
                  </p>
                  <div className="mt-4 inline-flex items-center text-sm font-semibold text-purple-400 group-hover:text-purple-300">
                    Ver usuarios →
                  </div>
                </div>
              </Link>
            </div>
    
            {/* Quick Stats */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
              <h2 className="mb-6 text-xl font-bold text-white">Resumen Rápido</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
                  <p className="text-sm text-slate-400">Total Productos</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-400">-</p>
                </div>
                <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
                  <p className="text-sm text-slate-400">Stock Total</p>
                  <p className="mt-2 text-3xl font-bold text-blue-400">-</p>
                </div>
                <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
                  <p className="text-sm text-slate-400">Categorías</p>
                  <p className="mt-2 text-3xl font-bold text-purple-400">-</p>
                </div>
                <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
                  <p className="text-sm text-slate-400">Ventas Hoy</p>
                  <p className="mt-2 text-3xl font-bold text-pink-400">$0</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      );
}