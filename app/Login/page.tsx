"use client";
import { FormEvent } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import { auth, configureAuthPersistence } from "@/lib/firebase-client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

import React from "react";

import { useState } from "react";


function Login() {
  // Estados para manejar el formulario, mensajes y carga
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
// Función para manejar el envío del formulario de login
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email || !password) {
      setMessage("Por favor completa todos los campos.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      // Configurar persistencia según el checkbox
      await configureAuthPersistence(rememberMe);

      // Iniciar sesión con correo y contraseña
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Obtener el ID token y enviarlo al servidor para crear la cookie de sesión
      const idToken = await userCredential.user.getIdToken();
      await fetch("/api/sessionLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, remember: rememberMe }),
      });

      setMessage("Inicio de sesión exitoso. Redirigiendo...");
      setMessageType("success");

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/");
      }, 200);
    } catch (error: any) {
      console.error("Error en login:", error);
      
      // Mensajes de error específicos
      if (error.code === "auth/user-not-found") {
        setMessage("Este correo no está registrado.");
      } else if (error.code === "auth/wrong-password") {
        setMessage("Contraseña incorrecta.");
      } else if (error.code === "auth/invalid-email") {
        setMessage("El correo no es válido.");
      } else if (error.code === "auth/user-disabled") {
        setMessage("Esta cuenta ha sido deshabilitada.");
      } else {
        setMessage("Error en el inicio de sesión: " + (error.message || "Intenta de nuevo"));
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <PublicHeader islogin={true} />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl sm:p-10">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-pink-300">Bienvenido</p>
            <h1 className="mt-4 text-4xl font-bold text-white">Iniciar sesión</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
              Ingresa con tu correo y contraseña para acceder a tu cuenta y revisar tus pedidos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block text-sm font-medium text-slate-200">
              Correo electrónico
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@correo.com"
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-300/30"
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-200">
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-300/30"
                required
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-pink-500 focus:ring-pink-400"
                />
                Recuérdame
              </label>
              <a href="#" className="text-sm text-pink-300 transition hover:text-pink-200">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Iniciando sesión..." : "Entrar"}
            </button>

            {message && (
              <p className={`rounded-3xl border px-4 py-3 text-center text-sm ${
                messageType === "success"
                  ? "border-green-400/20 bg-green-500/10 text-green-100"
                  : "border-pink-400/20 bg-pink-500/10 text-pink-100"
              }`}>
                {message}
              </p>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            ¿Aún no tienes cuenta? <a href="/Signup" className="text-pink-300 hover:text-pink-200">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;
