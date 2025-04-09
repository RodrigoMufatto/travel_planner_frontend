'use client'

import { UserPlus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRegister } from "@/api/auth/queries/auth-queries";
import { useRouter } from "next/navigation";

export default function Register() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const { mutate, isPending } = useRegister();
  const router = useRouter();

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone: string) {
    return /^\+55\d{11}$/.test(phone);
  }

  const handleStepOne = () => {
    if (!email || !password || !confirmPassword) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Digite um e-mail válido.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    setErrorMessage("");
    setStep(2);
  };

  const handleRegister = () => {
    if (!username || !phone || !birthdate) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    if (!validatePhone(phone)) {
      setErrorMessage("Digite um telefone válido no formato +55.");
      return;
    }

    setErrorMessage("");
    mutate(
      { email, password, username, phone, birthdate },
      {
        onSuccess: () => router.push("/login"),
        onError: (err: any) => {
          setErrorMessage(err.message || "Erro ao registrar.");
        }
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 flex flex-col items-center">
        <div className="mb-4 text-indigo-500">
          <UserPlus className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Criar sua conta</h2>
        <p className="text-gray-600 text-sm mb-4">
          Já possui uma conta?{" "}
          <Link href="/login" className="text-indigo-500">
            Entrar
          </Link>
        </p>

        {step === 1 ? (
          <>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg mb-3 text-zinc-700"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg mb-3 text-zinc-700"
            />
            <input
              type="password"
              placeholder="Digite a senha novamente"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4 text-zinc-700"
            />
            <button
              onClick={handleStepOne}
              className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 flex items-center justify-center gap-2"
            >
              Avançar <ArrowRight className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Apelido"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-lg mb-3 text-zinc-700"
            />
            <input
              type="tel"
              placeholder="Telefone (ex: +5566999999999)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded-lg mb-3 text-zinc-700"
            />
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4 text-zinc-700"
            />
            <button
              onClick={handleRegister}
              className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? "Criando conta..." : "Criar conta"}
            </button>
          </>
        )}

        {errorMessage && (
          <p className="text-red-500 text-sm mt-3 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
