import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import axios from "axios"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      )
      navigate("/dashboard")
    } catch {
      setError("E-mail ou senha inválidos.")
    } finally {
      setIsLoading(false)
    }
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
          <blockquote className="text-white/60 text-xl font-light leading-relaxed italic mb-8">
            "Entender para onde vai o seu dinheiro é o primeiro passo para ir para onde você quer."
          </blockquote>
          <div className="flex flex-col gap-4">
            {[
              { label: "Entradas este mês", value: "R$ 8.400,00", color: "#86efac" },
              { label: "Saídas este mês", value: "R$ 3.210,50", color: "#fca5a5" },
              { label: "Saldo atual", value: "R$ 5.189,50", color: "white" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/50 text-sm">{item.label}</span>
                <span className="font-semibold text-sm" style={{ color: item.color }}>
                  {item.value}
                </span>
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
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#375b4e" }}>Bem-vindo de volta</h1>
            <p className="text-sm" style={{ color: "#4A7766" }}>Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: "#375b4e" }}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3 rounded-2xl border bg-white text-sm outline-none transition-all"
                style={{
                  borderColor: "#d4cdc8",
                  color: "#375b4e",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4A7766")}
                onBlur={(e) => (e.target.style.borderColor = "#d4cdc8")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium" style={{ color: "#375b4e" }}>Senha</label>
                <button type="button" className="text-xs cursor-pointer transition-colors" style={{ color: "#4A7766" }}>
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-2xl border bg-white text-sm outline-none transition-all"
                  style={{ borderColor: "#d4cdc8", color: "#375b4e" }}
                  onFocus={(e) => (e.target.style.borderColor = "#4A7766")}
                  onBlur={(e) => (e.target.style.borderColor = "#d4cdc8")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                  style={{ color: "#9ca3af" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
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
              onMouseEnter={(e) => !isLoading && ((e.target as HTMLElement).style.backgroundColor = "#375b4e")}
              onMouseLeave={(e) => !isLoading && ((e.target as HTMLElement).style.backgroundColor = "#4A7766")}
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm mt-8" style={{ color: "#9ca3af" }}>
            Ainda não tem conta?{" "}
            <Link
              to="/register"
              className="font-medium transition-colors"
              style={{ color: "#4A7766" }}
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}