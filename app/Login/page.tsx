"use client";
import { FormEvent } from "react";
import PublicHeader from "@/components/layout/PublicHeader";

import React from "react";

import { useState } from "react";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setMessage("Por favor completa todos los campos.");
      return;
    }

    setMessage("Inicio de sesión simulado. Aquí podrías conectar tu autenticación.");
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
              className="w-full rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-400"
            >
              Entrar
            </button>

            {message ? (
              <p className="rounded-3xl border border-pink-400/20 bg-pink-500/10 px-4 py-3 text-center text-sm text-pink-100">
                {message}
              </p>
            ) : null}
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
