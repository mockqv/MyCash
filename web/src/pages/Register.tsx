import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"
import undrawDone from "../assets/undraw_done.svg"
import { supabase } from "../lib/supabase"

type Step = "form" | "success"

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>("form")
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setError("")
  setIsLoading(true)

  const { error: signUpError } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: { name: form.name },
    },
  })

  if (signUpError) {
    setError("Não foi possível criar sua conta. Tente novamente.")
    setIsLoading(false)
    return
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  })

  if (signInError) {
    setError("Conta criada, mas não foi possível entrar automaticamente.")
    setIsLoading(false)
    return
  }

  setStep("success")
  setTimeout(() => navigate("/dashboard"), 3000)
}

  if (step === "success") {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-8" style={{ backgroundColor: "#ECE7E2" }}>
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <img src={undrawDone} alt="Conta criada com sucesso" className="w-64 h-64 object-contain" />
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#375b4e" }}>
            Conta criada com sucesso!
          </h2>
          <p className="text-sm" style={{ color: "#4A7766" }}>
            Bem-vindo ao MyCash, {form.name.split(" ")[0]}. Redirecionando para o seu dashboard...
          </p>
        </div>
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 rounded-full animate-pulse"
              style={{
                width: i === 0 ? "24px" : "8px",
                backgroundColor: "#4A7766",
                animationDelay: `${i * 150}ms`,
                opacity: i === 0 ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#ECE7E2" }}>
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16" style={{ backgroundColor: "#375b4e" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#4A7766" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" fill="white" fillOpacity="0.7"/>
            </svg>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">MyCash</span>
        </div>

        <div>
          <h2 className="text-white text-3xl font-bold mb-4 leading-snug">
            Comece a ter controle<br />do seu dinheiro hoje.
          </h2>
          <div className="flex flex-col gap-3 mt-8">
            {[
              "Acompanhe entradas e saídas em tempo real",
              "Visualize seu saldo com privacidade total",
              "Categorize e organize cada transação",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ backgroundColor: "#4A776640" }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-white/60 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs">© 2025 MyCash. Todos os direitos reservados.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#4A7766" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" fill="white"/>
              </svg>
            </div>
            <span className="font-semibold text-base tracking-tight" style={{ color: "#375b4e" }}>MyCash</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#375b4e" }}>Criar sua conta</h1>
            <p className="text-sm" style={{ color: "#4A7766" }}>Leva menos de 1 minuto</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: "#375b4e" }}>Nome completo</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Seu nome"
                required
                className="w-full px-4 py-3 rounded-2xl border bg-white text-sm outline-none transition-all"
                style={{ borderColor: "#d4cdc8", color: "#375b4e" }}
                onFocus={(e) => (e.target.style.borderColor = "#4A7766")}
                onBlur={(e) => (e.target.style.borderColor = "#d4cdc8")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: "#375b4e" }}>E-mail</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3 rounded-2xl border bg-white text-sm outline-none transition-all"
                style={{ borderColor: "#d4cdc8", color: "#375b4e" }}
                onFocus={(e) => (e.target.style.borderColor = "#4A7766")}
                onBlur={(e) => (e.target.style.borderColor = "#d4cdc8")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: "#375b4e" }}>Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 pr-12 rounded-2xl border bg-white text-sm outline-none transition-all"
                  style={{ borderColor: "#d4cdc8", color: "#375b4e" }}
                  onFocus={(e) => (e.target.style.borderColor = "#4A7766")}
                  onBlur={(e) => (e.target.style.borderColor = "#d4cdc8")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: "#9ca3af" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all"
                      style={{
                        backgroundColor:
                          form.password.length >= (i + 1) * 2
                            ? i < 2 ? "#f87171" : i < 3 ? "#fbbf24" : "#4A7766"
                            : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl text-white text-sm font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: "#4A7766" }}
              onMouseEnter={(e) => !isLoading && ((e.currentTarget as HTMLElement).style.backgroundColor = "#375b4e")}
              onMouseLeave={(e) => !isLoading && ((e.currentTarget as HTMLElement).style.backgroundColor = "#4A7766")}
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="text-center text-sm mt-8" style={{ color: "#9ca3af" }}>
            Já tem uma conta?{" "}
            <Link to="/login" className="font-medium transition-colors" style={{ color: "#4A7766" }}>
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
