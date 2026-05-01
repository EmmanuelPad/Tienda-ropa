"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "next-themes";
import PublicHeader from "@/components/layout/PublicHeader";

type Seccion = "cuenta" | "apariencia" | "notificaciones" | "privacidad" | "avanzado";

interface MenuItem {
  id: Seccion;
  label: string;
  icono: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    id: "cuenta",
    label: "Cuenta",
    icono: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: "apariencia",
    label: "Apariencia",
    icono: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
  },
  {
    id: "notificaciones",
    label: "Notificaciones",
    icono: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.352 2.352 0 0119 14V12a3 3 0 00-3-3H9a3 3 0 00-3 3v2c0 .563-.282 1.063-.595 1.405L4 17h5m0 0a2 2 0 104 0m-4 0h4" />
      </svg>
    ),
  },
  {
    id: "privacidad",
    label: "Privacidad",
    icono: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    id: "avanzado",
    label: "Avanzado",
    icono: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function ConfiguracionPage() {
  const { user } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<Seccion>("cuenta");
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [notificaciones, setNotificaciones] = useState({
    email: true,
    pedidos: true,
    promociones: false,
  });

  useEffect(() => {
    setMounted(true);
    // Cargar username guardado (solo este dato, el tema lo maneja next-themes)
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) setUsername(savedUsername);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  // Clases dinámicas centralizadas usando dark: de Tailwind
  const c = {
    bg:           isDark ? "bg-gray-950"      : "bg-gray-50",
    text:         isDark ? "text-white"        : "text-gray-900",
    textSec:      isDark ? "text-gray-400"     : "text-gray-600",
    card:         isDark ? "bg-gray-800/50"    : "bg-white",
    cardItem:     isDark ? "bg-gray-800/30"    : "bg-gray-100",
    border:       isDark ? "border-white/10"   : "border-gray-200",
    inputBg:      isDark ? "bg-gray-900/50"    : "bg-white",
    activeBg:     isDark ? "bg-pink-500/20"    : "bg-pink-100",
    activeText:   isDark ? "text-pink-400"     : "text-pink-600",
    hoverBg:      isDark ? "hover:bg-white/5"  : "hover:bg-gray-200",
    dangerBg:     isDark ? "bg-red-500/10"     : "bg-red-50",
    dangerBorder: isDark ? "border-red-500/30" : "border-red-200",
  };

  const inputClass = `mt-1 w-full rounded-lg border ${c.border} ${c.inputBg} px-4 py-2 ${c.text} focus:border-pink-500 focus:outline-none`;

  const handleGuardar = async () => {
    setGuardando(true);
    if (username) localStorage.setItem("username", username);
    await new Promise((r) => setTimeout(r, 800));
    setGuardando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  if (!user) {
    return (
      <div className={`min-h-screen ${c.bg} transition-colors duration-300`}>
        <PublicHeader />
        <div className="flex items-center justify-center py-20">
          <p className={c.text}>Debes iniciar sesión para ver esta página.</p>
        </div>
      </div>
    );
  }

  const renderContenido = () => {
    switch (seccionActiva) {
      case "cuenta":
        return (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${c.text}`}>Información de la cuenta</h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm ${c.textSec}`}>Nombre de usuario</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@tuusername" className={inputClass} />
              </div>
              <div>
                <label className={`block text-sm ${c.textSec}`}>Email</label>
                <input type="email" value={user.email || ""} disabled className={`${inputClass} opacity-60`} />
              </div>
              <div>
                <label className={`block text-sm ${c.textSec}`}>Nombre</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" className={inputClass} />
              </div>
              <div>
                <label className={`block text-sm ${c.textSec}`}>Teléfono</label>
                <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Tu teléfono" className={inputClass} />
              </div>
              <div>
                <label className={`block text-sm ${c.textSec}`}>Dirección</label>
                <textarea value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Tu dirección" rows={3} className={inputClass} />
              </div>
            </div>
            <button
              onClick={handleGuardar}
              disabled={guardando}
              className="w-full rounded-lg bg-pink-500 py-3 font-semibold text-white transition hover:bg-pink-400 disabled:opacity-50"
            >
              {guardando ? "Guardando..." : guardado ? "¡Guardado!" : "Guardar cambios"}
            </button>
          </div>
        );

      case "apariencia":
        return (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${c.text}`}>Apariencia</h2>
            <div className={`rounded-lg border ${c.border} ${c.cardItem} p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${c.text}`}>Tema de la aplicación</p>
                  <p className={`text-sm ${c.textSec}`}>{isDark ? "Modo oscuro activo" : "Modo claro activo"}</p>
                </div>
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className={`flex items-center gap-2 rounded-lg border ${c.border} px-4 py-2 ${c.text} transition hover:border-pink-300`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isDark ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    )}
                  </svg>
                  {isDark ? "Cambiar a claro" : "Cambiar a oscuro"}
                </button>
              </div>
            </div>
          </div>
        );

      case "notificaciones":
        return (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${c.text}`}>Notificaciones</h2>
            <div className="space-y-3">
              {[
                { key: "email" as const, label: "Notificaciones por email", desc: "Recibe actualizaciones en tu correo" },
                { key: "pedidos" as const, label: "Estado de pedidos", desc: "Notificaciones sobre tus pedidos" },
                { key: "promociones" as const, label: "Promociones y ofertas", desc: "Recibe ofertas especiales" },
              ].map(({ key, label, desc }) => (
                <label key={key} className={`flex cursor-pointer items-center justify-between rounded-lg border ${c.border} ${c.cardItem} p-4`}>
                  <div>
                    <p className={`font-medium ${c.text}`}>{label}</p>
                    <p className={`text-sm ${c.textSec}`}>{desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificaciones[key]}
                    onChange={(e) => setNotificaciones({ ...notificaciones, [key]: e.target.checked })}
                    className="h-5 w-5 accent-pink-500"
                  />
                </label>
              ))}
            </div>
            <button onClick={handleGuardar} className="w-full rounded-lg bg-pink-500 py-3 font-semibold text-white transition hover:bg-pink-400">
              Guardar preferencias
            </button>
          </div>
        );

      case "privacidad":
        return (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${c.text}`}>Privacidad</h2>
            <div className="space-y-4">
              {[
                { titulo: "Datos personales", desc: "Tus datos están almacenados de forma segura. Puedes solicitar la eliminación de tu cuenta.", accion: "Solicitar eliminación de datos" },
                { titulo: "Historial de actividad", desc: "Controla qué información se guarda sobre tu actividad en la plataforma.", accion: "Ver historial de actividad" },
              ].map(({ titulo, desc, accion }) => (
                <div key={titulo} className={`rounded-lg border ${c.border} ${c.cardItem} p-4`}>
                  <p className={`font-medium ${c.text}`}>{titulo}</p>
                  <p className={`mt-1 text-sm ${c.textSec}`}>{desc}</p>
                  <button className={`mt-3 text-sm ${c.activeText} hover:opacity-80`}>{accion}</button>
                </div>
              ))}
            </div>
          </div>
        );

      case "avanzado":
        return (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${c.text}`}>Configuración avanzada</h2>
            <div className="space-y-4">
              {[
                { titulo: "Sesiones activas", desc: "Gestiona los dispositivos donde tienes sesión iniciada.", accion: "Ver sesiones" },
                { titulo: "Cambiar contraseña", desc: "Actualiza tu contraseña de acceso.", accion: "Cambiar contraseña" },
              ].map(({ titulo, desc, accion }) => (
                <div key={titulo} className={`rounded-lg border ${c.border} ${c.cardItem} p-4`}>
                  <p className={`font-medium ${c.text}`}>{titulo}</p>
                  <p className={`mt-1 text-sm ${c.textSec}`}>{desc}</p>
                  <button className={`mt-3 text-sm ${c.activeText} hover:opacity-80`}>{accion}</button>
                </div>
              ))}
              <div className={`rounded-lg border ${c.dangerBorder} ${c.dangerBg} p-4`}>
                <p className="font-medium text-red-500">Zona de peligro</p>
                <p className={`mt-1 text-sm ${c.textSec}`}>Esta acción es irreversible. Perderás todos tus datos.</p>
                <button className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500">
                  Eliminar cuenta
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${c.bg} transition-colors duration-300`}>
      <PublicHeader />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className={`mb-8 text-3xl font-bold ${c.text}`}>Configuración</h1>

        <div className="flex gap-6">
          {/* Menú lateral */}
          <nav className="w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSeccionActiva(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                    seccionActiva === item.id
                      ? `${c.activeBg} ${c.activeText}`
                      : `${c.textSec} ${c.hoverBg}`
                  }`}
                >
                  {item.icono}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Contenido */}
          <main className={`flex-1 rounded-lg border ${c.border} ${c.card} p-6`}>
            {renderContenido()}
          </main>
        </div>
      </div>
    </div>
  );
}
