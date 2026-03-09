import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Login() {
  usePageTitle("Login");
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      setError("E-mail ou senha inválidos.");
      setIsLoading(false);
      return;
    }

    navigate("/dashboard");
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
          <blockquote className="text-white/50 text-xl font-light leading-relaxed italic mb-10">
            "Entender para onde vai o seu dinheiro é o primeiro passo para ir
            para onde você quer."
          </blockquote>
          <div className="flex flex-col gap-0">
            {[
              {
                label: "Entradas este mês",
                value: "R$ 8.400,00",
                color: "#86efac",
              },
              {
                label: "Saídas este mês",
                value: "R$ 3.210,50",
                color: "#fca5a5",
              },
              { label: "Saldo atual", value: "R$ 5.189,50", color: "white" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center py-4 border-b border-white/8"
              >
                <span className="text-white/40 text-sm">{item.label}</span>
                <span
                  className="font-black text-sm"
                  style={{ color: item.color }}
                >
                  {item.value}
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
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-slate-400">
              Acesse sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm outline-none transition-all text-slate-900 placeholder:text-slate-300 focus:border-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Senha
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
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
            </div>

            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-slate-900 text-white text-sm font-semibold transition-opacity hover:opacity-80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm mt-8 text-slate-400">
            Ainda não tem conta?{" "}
            <Link
              to="/register"
              className="font-semibold text-slate-900 hover:opacity-70 transition-opacity"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
