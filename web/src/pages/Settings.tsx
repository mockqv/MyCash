import { LayoutGrid, Receipt, Settings, LogOut, Moon, Sun } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"

export default function SettingsPage() {
  const { signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen w-full bg-linen dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200/60 dark:border-slate-700 hidden xl:flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-spruce flex items-center justify-center shadow-sm cursor-pointer hover:bg-spruce-dark transition-colors">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h2 className="text-2xl font-bold text-spruce-dark dark:text-white tracking-tight cursor-default">MyCash</h2>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-spruce-dark dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl font-medium transition-colors cursor-pointer"
          >
            <LayoutGrid className="h-5 w-5" />
            Visão Geral
          </button>
          <button
            onClick={() => navigate("/transactions")}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-spruce-dark dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl font-medium transition-colors cursor-pointer"
          >
            <Receipt className="h-5 w-5" />
            Transações
          </button>
        </nav>

        <div className="p-4 pt-0 space-y-1 mb-2 border-t border-slate-100 dark:border-slate-700 mx-4 mt-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-spruce/10 text-spruce rounded-2xl font-semibold transition-colors cursor-pointer mt-2">
            <Settings className="h-5 w-5" />
            Ajustes
          </button>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500/80 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl font-medium transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-24 px-8 lg:px-12 flex items-center shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-spruce-dark dark:text-white">Configurações</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
              Personalize sua experiência.
            </p>
          </div>
        </header>

        <div className="p-8 lg:p-12 pt-0 w-full max-w-[800px]">
          <div className="bg-white dark:bg-slate-800 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-base font-bold text-spruce-dark dark:text-white">Aparência</h2>
              <p className="text-sm text-slate-400 mt-0.5">Controle o visual da interface.</p>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  {theme === "dark" ? (
                    <Moon size={18} className="text-spruce" />
                  ) : (
                    <Sun size={18} className="text-spruce" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Modo escuro</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {theme === "dark" ? "Interface no tema escuro" : "Interface no tema claro"}
                  </p>
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                  theme === "dark" ? "bg-spruce" : "bg-slate-200"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    theme === "dark" ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}