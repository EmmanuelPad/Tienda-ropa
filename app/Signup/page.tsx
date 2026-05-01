"use client";

import { FormEvent, useState } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import { auth, configureAuthPersistence } from "@/lib/firebase-client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";

function Signup() 
{
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (!name || !email || !password || !confirmPassword) {
      setMessage("Por favor completa todos los campos.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      // Configurar persistencia
      await configureAuthPersistence(false);

      // Crear usuario con correo y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Actualizar perfil con el nombre
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Guardar usuario en Firestore
      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        displayName: name,
        createdAt: new Date().toISOString(),
      });

      setMessage("Registro exitoso. Redirigiendo...");
      setMessageType("success");

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      console.error("Error en registro:", error);
      
      // Mensajes de error específicos
      if (error.code === "auth/email-already-in-use") {
        setMessage("Este correo ya está registrado.");
      } else if (error.code === "auth/invalid-email") {
        setMessage("El correo no es válido.");
      } else if (error.code === "auth/weak-password") {
        setMessage("La contraseña es muy débil.");
      } else {
        setMessage("Error en el registro: " + (error.message || "Intenta de nuevo"));
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <PublicHeader issignup={true} />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl sm:p-10">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-pink-300">Crea tu cuenta</p>
            <h1 className="mt-4 text-4xl font-bold text-white">Registro</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
              Regístrate para acceder a tus pedidos, guardar favoritos y aprovechar ofertas exclusivas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block text-sm font-medium text-slate-200">
              Nombre completo
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Tu nombre completo"
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-300/30"
                required
              />
            </label>

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

            <label className="block text-sm font-medium text-slate-200">
              Confirmar contraseña
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repite tu contraseña"
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-300/30"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registrando..." : "Registrarme"}
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
            ¿Ya tienes cuenta? <a href="/Login" className="text-pink-300 hover:text-pink-200">Inicia sesión</a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Signup;
