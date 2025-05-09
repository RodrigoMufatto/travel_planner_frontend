"use client";

import { useState } from "react";
import { Plane } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (res?.ok) {
      router.push('/home');
    } else {
      setErrorMessage("E-mail ou senha inválidos");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 flex flex-col items-center">
        <Plane className="w-12 h-12 text-indigo-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Bem-vindo</h2>
        <p className="text-gray-600 text-sm mb-4">
          Não possui uma conta?{" "}
          <Link href="/register" className="text-indigo-500">Criar conta</Link>
        </p>
        <form className="w-full" onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4"
          />
          <SubmitButton isLoading={isLoading} />
        </form>
        <ErrorMessage message={errorMessage} />
      </div>
    </div>
  );
}

const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full p-2 border rounded-lg mb-3 text-zinc-400 ${className}`}
    {...props}
  />
);

const SubmitButton = ({ isLoading }: { isLoading: boolean }) => (
  <button
    type="submit"
    className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 disabled:opacity-50"
    disabled={isLoading}
  >
    {isLoading ? "Entrando..." : "Entrar"}
  </button>
);

const ErrorMessage = ({ message }: { message?: string }) =>
  message ? <p className="text-red-500 text-sm mt-2">{message}</p> : null;
