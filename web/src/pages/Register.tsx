import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import undrawDone from "../assets/undraw_done.svg";
import { supabase } from "../lib/supabase";
import { usePageTitle } from "@/hooks/usePageTitle";

type Step = "form" | "success";

export default function Register() {
  usePageTitle("Cadastro");
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (form.password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    setIsLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name } },
    });

    if (signUpError) {
      setError("Não foi possível criar sua conta. Tente novamente.");
      setIsLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (signInError) {
      setError("Conta criada, mas não foi possível entrar automaticamente.");
      setIsLoading(false);
      return;
    }

    setStep("success");
    setTimeout(() => navigate("/dashboard"), 3000);
  }

  const passwordStrength = () => {
    const len = form.password.length;
    if (len === 0) return -1;
    if (len < 4) return 0;
    if (len < 8) return 1;
    if (len < 12) return 2;
    return 3;
  };

  const strengthColor = (index: number) => {
    const strength = passwordStrength();
    if (strength < index) return "#e2e8f0";
    if (strength === 0) return "#f87171";
    if (strength === 1) return "#f87171";
    if (strength === 2) return "#fbbf24";
    return "#0f172a";
  };

  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  if (step === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-8 bg-app-bg">
        <div className="flex flex-col items-center gap-6 text-center max-w-sm">
          <img
            src={undrawDone}
            alt="Conta criada com sucesso"
            className="w-64 h-64 object-contain"
          />
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Conta criada com sucesso!
            </h2>
            <p className="text-sm text-slate-400">
              Bem-vindo ao MyCash, {form.name.split(" ")[0]}. Redirecionando
              para o seu dashboard...
            </p>
          </div>
          <div className="flex gap-1.5 mt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1.5 rounded-full animate-pulse bg-slate-900"
                style={{
                  width: i === 0 ? "24px" : "8px",
                  animationDelay: `${i * 150}ms`,
                  opacity: i === 0 ? 1 : 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-app-bg">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 bg-slate-900">
        <div className="flex items-center gap-3">
          <img
            src="/Icon.png"
            alt="MyCash"
            className="h-9 w-9 object-contain"
          />
          <span className="text-white font-black text-lg tracking-tight">
            MyCash
          </span>
        </div>

        <div>
          <h2 className="text-white text-3xl font-black mb-4 leading-snug">
            Comece a ter controle
            <br />
            do seu dinheiro hoje.
          </h2>
          <div className="flex flex-col gap-3 mt-8">
            {[
              "Acompanhe entradas e saídas em tempo real",
              "Visualize seu saldo com privacidade total",
              "Categorize e organize cada transação",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5 bg-white/10">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-white/50 text-sm leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs">
          © 2025 MyCash. Todos os direitos reservados.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <img
              src="/Icon.png"
              alt="MyCash"
              className="h-8 w-8 object-contain"
            />
            <span className="font-black text-slate-900 text-base">MyCash</span>
          </div>

          <div className="mb-10">
            <h1 className="text-2xl font-black text-slate-900 mb-1">
              Criar sua conta
            </h1>
            <p className="text-sm text-slate-400">Leva menos de 1 minuto</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Nome completo
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Seu nome"
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm outline-none transition-all text-slate-900 placeholder:text-slate-300 focus:border-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm outline-none transition-all text-slate-900 placeholder:text-slate-300 focus:border-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 pr-12 rounded-2xl border border-slate-200 bg-white text-sm outline-none transition-all text-slate-900 placeholder:text-slate-300 focus:border-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all"
                      style={{ backgroundColor: strengthColor(i) }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repita sua senha"
                  required
                  className={`w-full px-4 py-3 pr-12 rounded-2xl border bg-white text-sm outline-none transition-all text-slate-900 placeholder:text-slate-300 ${
                    passwordsMismatch
                      ? "border-red-300 focus:border-red-400"
                      : passwordsMatch
                        ? "border-green-300 focus:border-green-400"
                        : "border-slate-200 focus:border-slate-900"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {passwordsMismatch && (
                <p className="text-xs text-red-500 mt-0.5">
                  As senhas não coincidem.
                </p>
              )}
              {passwordsMatch && (
                <p className="text-xs text-green-500 mt-0.5">
                  Senhas coincidem.
                </p>
              )}
            </div>

            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || passwordsMismatch}
              className="w-full py-3.5 rounded-2xl bg-slate-900 text-white text-sm font-semibold transition-opacity hover:opacity-80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {isLoading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="text-center text-sm mt-8 text-slate-400">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="font-semibold text-slate-900 hover:opacity-70 transition-opacity"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
