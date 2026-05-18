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
    id: "cuenta", label: "Cuenta",
    icono: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
  {
    id: "apariencia", label: "Apariencia",
    icono: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  },
  {
    id: "notificaciones", label: "Notificaciones",
    icono: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.352 2.352 0 0119 14V12a3 3 0 00-3-3H9a3 3 0 00-3 3v2c0 .563-.282 1.063-.595 1.405L4 17h5m0 0a2 2 0 104 0m-4 0h4" /></svg>,
  },
  {
    id: "privacidad", label: "Privacidad",
    icono: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  },
  {
    id: "avanzado", label: "Avanzado",
    icono: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

export default function ConfiguracionPage() {
  // ── setUsername para reflejar el cambio en el header al instante ──
  const { user, setUsername: setUsernameCtx } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<Seccion>("cuenta");

  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [loadingDatos, setLoadingDatos] = useState(false);

  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState("");

  const [notificaciones, setNotificaciones] = useState({ email: true, pedidos: true, promociones: false });

  useEffect(() => setMounted(true), []);

  // ── Cargar datos del usuario al entrar ──
  useEffect(() => {
    if (!user?.uid) return;
    setLoadingDatos(true);
    fetch(`/api/user?uid=${user.uid}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.usuario) {
          setNombre(data.usuario.displayName || "");
          setUsername(data.usuario.username || "");
          setTelefono(data.usuario.telefono || "");
          setDireccion(data.usuario.direccion || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoadingDatos(false));
  }, [user?.uid]);

  const isDark = mounted ? resolvedTheme === "dark" : false;

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

  const inputClass = `mt-1 w-full rounded-lg border ${c.border} ${c.inputBg} px-4 py-2 ${c.text} focus:border-pink-500 focus:outline-none transition`;

  // ── Guardar cuenta ──
  const handleGuardar = async () => {
    if (!user?.uid) return;
    setGuardando(true);
    setErrorGuardar("");
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, displayName: nombre, username, telefono, direccion }),
      });
      const data = await res.json();
      if (data.ok) {
        // ── Actualiza el username en el contexto para que el header lo refleje de inmediato ──
        setUsernameCtx(username);
        setGuardado(true);
        setTimeout(() => setGuardado(false), 3000);
      } else {
        setErrorGuardar(data.error || "Error al guardar");
      }
    } catch {
      setErrorGuardar("Error de conexión");
    } finally {
      setGuardando(false);
    }
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
            {loadingDatos ? (
              <div className={`flex items-center gap-2 py-4 text-sm ${c.textSec}`}>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
                Cargando datos guardados...
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm ${c.textSec}`}>
                    Nombre de usuario
                    <span className={`ml-2 text-xs ${isDark ? "text-pink-400" : "text-pink-500"}`}>
                      (se muestra como @usuario en el encabezado)
                    </span>
                  </label>
                  <div className="relative mt-1">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium ${isDark ? "text-pink-400" : "text-pink-500"}`}>@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                      placeholder="tu_usuario"
                      className={`w-full rounded-lg border ${c.border} ${c.inputBg} pl-7 pr-4 py-2 ${c.text} focus:border-pink-500 focus:outline-none transition`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm ${c.textSec}`}>Email</label>
                  <input type="email" value={user.email || ""} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
                  <p className={`mt-1 text-xs ${c.textSec}`}>El email no puede modificarse.</p>
                </div>
                <div>
                  <label className={`block text-sm ${c.textSec}`}>Nombre completo</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre completo" className={inputClass} />
                </div>
                <div>
                  <label className={`block text-sm ${c.textSec}`}>Teléfono</label>
                  <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+52 55 1234 5678" className={inputClass} />
                </div>
                <div>
                  <label className={`block text-sm ${c.textSec}`}>Dirección de envío</label>
                  <textarea value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Tu dirección de envío" rows={3} className={inputClass} />
                </div>
              </div>
            )}

            {errorGuardar && (
              <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">{errorGuardar}</p>
            )}

            <button
              onClick={handleGuardar}
              disabled={guardando || loadingDatos}
              className={`w-full rounded-lg py-3 font-semibold text-white transition
                ${guardado ? "bg-emerald-500 hover:bg-emerald-400" : "bg-pink-500 hover:bg-pink-400"} disabled:opacity-50`}
            >
              {guardando ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Guardando...
                </span>
              ) : guardado ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  ¡Cambios guardados!
                </span>
              ) : "Guardar cambios"}
            </button>
          </div>
        );

      case "apariencia":
        return (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${c.text}`}>Apariencia</h2>
            <p className={`text-sm ${c.textSec}`}>El tema se aplica en todas las páginas de la aplicación.</p>

            <div className="grid grid-cols-2 gap-4">
              {/* Modo claro */}
              <button
                onClick={() => setTheme("light")}
                className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition
                  ${!isDark ? "border-pink-500 bg-pink-500/10" : `${c.border} ${c.cardItem} hover:border-gray-400`}`}
              >
                {!isDark && (
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500">
                    <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                )}
                <svg className={`h-8 w-8 ${!isDark ? "text-pink-500" : c.textSec}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <div className="text-center">
                  <p className={`text-sm font-semibold ${!isDark ? "text-pink-500" : c.text}`}>Modo claro</p>
                  <p className={`text-xs ${c.textSec}`}>Fondo blanco</p>
                </div>
              </button>

              {/* Modo oscuro */}
              <button
                onClick={() => setTheme("dark")}
                className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition
                  ${isDark ? "border-pink-500 bg-pink-500/10" : `${c.border} ${c.cardItem} hover:border-gray-400`}`}
              >
                {isDark && (
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500">
                    <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                )}
                <svg className={`h-8 w-8 ${isDark ? "text-pink-400" : c.textSec}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <div className="text-center">
                  <p className={`text-sm font-semibold ${isDark ? "text-pink-400" : c.text}`}>Modo oscuro</p>
                  <p className={`text-xs ${c.textSec}`}>Fondo oscuro</p>
                </div>
              </button>
            </div>

            <div className={`rounded-lg border ${c.border} ${c.cardItem} px-4 py-3 text-sm ${c.textSec}`}>
              Tema activo: <span className={`font-semibold ${c.text}`}>{isDark ? "Oscuro 🌙" : "Claro ☀️"}</span>
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
                <label key={key} className={`flex cursor-pointer items-center justify-between rounded-lg border ${c.border} ${c.cardItem} p-4 transition hover:opacity-90`}>
                  <div>
                    <p className={`font-medium ${c.text}`}>{label}</p>
                    <p className={`text-sm ${c.textSec}`}>{desc}</p>
                  </div>
                  <input type="checkbox" checked={notificaciones[key]}
                    onChange={(e) => setNotificaciones({ ...notificaciones, [key]: e.target.checked })}
                    className="h-5 w-5 accent-pink-500" />
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
                { titulo: "Datos personales", desc: "Tus datos están almacenados de forma segura.", accion: "Solicitar eliminación de datos" },
                { titulo: "Historial de actividad", desc: "Controla qué información se guarda sobre tu actividad.", accion: "Ver historial de actividad" },
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
                <p className={`mt-1 text-sm ${c.textSec}`}>Esta acción es irreversible.</p>
                <button className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500 transition">
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
          <nav className="w-64 shrink-0">
            <div className="sticky top-24 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSeccionActiva(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                    seccionActiva === item.id ? `${c.activeBg} ${c.activeText}` : `${c.textSec} ${c.hoverBg}`
                  }`}
                >
                  {item.icono}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
          <main className={`flex-1 rounded-lg border ${c.border} ${c.card} p-6`}>
            {renderContenido()}
          </main>
        </div>
      </div>
    </div>
  );
}
