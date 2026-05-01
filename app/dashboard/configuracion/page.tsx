"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import PublicHeader from "@/components/layout/PublicHeader";
import Link from "next/link";

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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.352 2.352 0 0119 13.341V12a3 3 0 00-3-3H9a3 3 0 00-3 3v1.341c0 .629.282 1.223.814 1.654L5 17h5m0 0a2 2 0 100-4 2 2 0 000 4z" />
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
  const [seccionActiva, setSeccionActiva] = useState<Seccion>("cuenta");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [notificaciones, setNotificaciones] = useState({
    email: true,
    pedidos: true,
    promociones: false,
  });

  // Colores dinámicos según el tema
  const colors = {
    bg: theme === "dark" ? "bg-gray-950" : "bg-gray-50",
    text: theme === "dark" ? "text-white" : "text-gray-900",
    textSecondary: theme === "dark" ? "text-gray-400" : "text-gray-600",
    card: theme === "dark" ? "bg-gray-800/50" : "bg-white",
    cardItem: theme === "dark" ? "bg-gray-800/30" : "bg-gray-100",
    border: theme === "dark" ? "border-white/10" : "border-gray-200",
    inputBg: theme === "dark" ? "bg-gray-900/50" : "bg-white",
    buttonBg: theme === "dark" ? "bg-white/5" : "bg-gray-100",
    buttonBorder: theme === "dark" ? "border-white/20" : "border-gray-300",
    activeBg: theme === "dark" ? "bg-pink-500/20" : "bg-pink-100",
    activeText: theme === "dark" ? "text-pink-400" : "text-pink-600",
    hoverBg: theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-200",
    dangerBg: theme === "dark" ? "bg-red-500/10" : "bg-red-50",
    dangerBorder: theme === "dark" ? "border-red-500/30" : "border-red-200",
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const savedUsername = localStorage.getItem("username") as string | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  const handleGuardar = async () => {
    setGuardando(true);
    // Guardar username en localStorage
    if (username) {
      localStorage.setItem("username", username);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    setGuardando(false);
    alert("Configuración guardada");
  };

  if (!user) {
    return (
      <div className={`min-h-screen ${colors.bg} transition-colors duration-300`}>
        <PublicHeader />
        <div className="flex items-center justify-center py-20">
          <p className={colors.text}>Debes iniciar sesión para ver esta página</p>
        </div>
      </div>
    );
  }

  const renderContenido = () => {
    switch (seccionActiva) {
      case "cuenta":
        return (
          <div className="space-y-6">
            <div>
              <h2 className={`mb-4 text-xl font-semibold ${colors.text}`}>Información de la cuenta</h2>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm ${colors.textSecondary}`}>Nombre de usuario</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="@tuusername"
                    className={`mt-1 w-full rounded-lg border ${colors.border} ${colors.inputBg} px-4 py-2 ${colors.text} focus:border-pink-500 focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block text-sm ${colors.textSecondary}`}>Email</label>
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className={`mt-1 w-full rounded-lg border ${colors.border} ${colors.inputBg} px-4 py-2 ${colors.text} opacity-60`}
                  />
                </div>
                <div>
                  <label className={`block text-sm ${colors.textSecondary}`}>Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    className={`mt-1 w-full rounded-lg border ${colors.border} ${colors.inputBg} px-4 py-2 ${colors.text} focus:border-pink-500 focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block text-sm ${colors.textSecondary}`}>Teléfono</label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Tu teléfono"
                    className={`mt-1 w-full rounded-lg border ${colors.border} ${colors.inputBg} px-4 py-2 ${colors.text} focus:border-pink-500 focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block text-sm ${colors.textSecondary}`}>Dirección</label>
                  <textarea
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Tu dirección"
                    rows={3}
                    className={`mt-1 w-full rounded-lg border ${colors.border} ${colors.inputBg} px-4 py-2 ${colors.text} focus:border-pink-500 focus:outline-none`}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleGuardar}
              disabled={guardando}
              className="w-full rounded-lg bg-pink-500 py-3 font-semibold text-white transition hover:bg-pink-400 disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        );

      case "apariencia":
        return (
          <div className="space-y-6">
            <div>
              <h2 className={`mb-4 text-xl font-semibold ${colors.text}`}>Apariencia</h2>
              <div className={`rounded-lg border ${colors.border} ${colors.cardItem} p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${colors.text} font-medium`}>Tema de la aplicación</p>
                    <p className={`text-sm ${colors.textSecondary}`}>
                      {theme === "dark" ? "Modo oscuro" : "Modo claro"}
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`flex items-center gap-2 rounded-lg border ${colors.buttonBorder} ${colors.buttonBg} px-4 py-2 ${colors.text} transition hover:border-pink-300`}
                  >
                    {theme === "dark" ? (
                      <>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>Modo claro</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        <span>Modo oscuro</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "notificaciones":
        return (
          <div className="space-y-6">
            <div>
              <h2 className={`mb-4 text-xl font-semibold ${colors.text}`}>Notificaciones</h2>
              <div className="space-y-3">
                <label className={`flex cursor-pointer items-center justify-between rounded-lg border ${colors.border} ${colors.cardItem} p-4`}>
                  <div>
                    <p className={`${colors.text} font-medium`}>Notificaciones por email</p>
                    <p className={`text-sm ${colors.textSecondary}`}>Recibe actualizaciones en tu correo</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificaciones.email}
                    onChange={(e) => setNotificaciones({ ...notificaciones, email: e.target.checked })}
                    className="h-5 w-5 accent-pink-500"
                  />
                </label>
                <label className={`flex cursor-pointer items-center justify-between rounded-lg border ${colors.border} ${colors.cardItem} p-4`}>
                  <div>
                    <p className={`${colors.text} font-medium`}>Estado de pedidos</p>
                    <p className={`text-sm ${colors.textSecondary}`}>Notificaciones sobre tus pedidos</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificaciones.pedidos}
                    onChange={(e) => setNotificaciones({ ...notificaciones, pedidos: e.target.checked })}
                    className="h-5 w-5 accent-pink-500"
                  />
                </label>
                <label className={`flex cursor-pointer items-center justify-between rounded-lg border ${colors.border} ${colors.cardItem} p-4`}>
                  <div>
                    <p className={`${colors.text} font-medium`}>Promociones y ofertas</p>
                    <p className={`text-sm ${colors.textSecondary}`}>Recibe ofertas especiales</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificaciones.promociones}
                    onChange={(e) => setNotificaciones({ ...notificaciones, promociones: e.target.checked })}
                    className="h-5 w-5 accent-pink-500"
                  />
                </label>
              </div>
            </div>
            <button
              onClick={handleGuardar}
              className="w-full rounded-lg bg-pink-500 py-3 font-semibold text-white transition hover:bg-pink-400"
            >
              Guardar preferencias
            </button>
          </div>
        );

      case "privacidad":
        return (
          <div className="space-y-6">
            <div>
              <h2 className={`mb-4 text-xl font-semibold ${colors.text}`}>Privacidad</h2>
              <div className="space-y-4">
                <div className={`rounded-lg border ${colors.border} ${colors.cardItem} p-4`}>
                  <p className={`${colors.text} font-medium`}>Datos personales</p>
                  <p className={`mt-1 text-sm ${colors.textSecondary}`}>
                    Tus datos están almacenados de forma segura. Puedes solicitar la eliminación de tu cuenta.
                  </p>
                  <button className={`mt-3 text-sm ${colors.activeText} hover:opacity-80`}>
                    Solicitar eliminación de datos
                  </button>
                </div>
                <div className={`rounded-lg border ${colors.border} ${colors.cardItem} p-4`}>
                  <p className={`${colors.text} font-medium`}>Historial de actividad</p>
                  <p className={`mt-1 text-sm ${colors.textSecondary}`}>
                    Controla qué información se guarda sobre tu actividad en la plataforma.
                  </p>
                  <button className={`mt-3 text-sm ${colors.activeText} hover:opacity-80`}>
                    Ver historial de actividad
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "avanzado":
        return (
          <div className="space-y-6">
            <div>
              <h2 className={`mb-4 text-xl font-semibold ${colors.text}`}>Configuración avanzada</h2>
              <div className="space-y-4">
                <div className={`rounded-lg border ${colors.border} ${colors.cardItem} p-4`}>
                  <p className={`${colors.text} font-medium`}>Sesiones activas</p>
                  <p className={`mt-1 text-sm ${colors.textSecondary}`}>
                    Gestiona los dispositivos donde tienes sesión iniciada.
                  </p>
                  <button className={`mt-3 text-sm ${colors.activeText} hover:opacity-80`}>
                    Ver sesiones
                  </button>
                </div>
                <div className={`rounded-lg border ${colors.border} ${colors.cardItem} p-4`}>
                  <p className={`${colors.text} font-medium`}>Cambiar contraseña</p>
                  <p className={`mt-1 text-sm ${colors.textSecondary}`}>
                    Actualiza tu contraseña de acceso.
                  </p>
                  <button className={`mt-3 text-sm ${colors.activeText} hover:opacity-80`}>
                    Cambiar contraseña
                  </button>
                </div>
                <div className={`rounded-lg border ${colors.dangerBorder} ${colors.dangerBg} p-4`}>
                  <p className="text-red-500 font-medium">Zona de peligro</p>
                  <p className={`mt-1 text-sm ${colors.textSecondary}`}>
                    Esta acción es irreversible. Perderás todos tus datos.
                  </p>
                  <button className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500">
                    Eliminar cuenta
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-300`}>
      <PublicHeader />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className={`mb-8 text-3xl font-bold ${colors.text}`}>Configuración</h1>
        
        <div className="flex gap-6">
          {/* Menú lateral estilo YouTube */}
          <nav className="w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSeccionActiva(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                    seccionActiva === item.id
                      ? `${colors.activeBg} ${colors.activeText}`
                      : `${colors.textSecondary} ${colors.hoverBg} ${colors.text}`
                  }`}
                >
                  {item.icono}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Contenido principal */}
          <main className={`flex-1 rounded-lg border ${colors.border} ${colors.card} p-6`}>
            {renderContenido()}
          </main>
        </div>
      </div>
    </div>
  );
}