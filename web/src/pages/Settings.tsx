import { LayoutGrid, Receipt, Settings, LogOut, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function SettingsPage() {
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full bg-[#f0f2f5] dark:bg-slate-900 font-sans">
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 hidden xl:flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-sm cursor-pointer">
            <span className="text-white dark:text-slate-900 font-black text-lg">
              M
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight cursor-default">
            MyCash
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl font-medium transition-all cursor-pointer text-sm"
          >
            <LayoutGrid className="h-4 w-4" />
            Visão Geral
          </button>
          <button
            onClick={() => navigate("/transactions")}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl font-medium transition-all cursor-pointer text-sm"
          >
            <Receipt className="h-4 w-4" />
            Transações
          </button>
        </nav>

        <div className="p-4 space-y-1 mb-2 mx-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-semibold transition-all cursor-pointer text-sm">
            <Settings className="h-4 w-4" />
            Ajustes
          </button>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl font-medium transition-all cursor-pointer text-sm"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="px-8 lg:px-10 pt-8 pb-6">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Configurações
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Personalize sua experiência.
          </p>
        </header>

        <div className="px-8 lg:px-10 pb-10 w-full max-w-[700px]">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-700/50">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Aparência
              </p>
            </div>

            <div className="px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  {theme === "dark" ? (
                    <Moon
                      size={17}
                      className="text-slate-500 dark:text-slate-300"
                    />
                  ) : (
                    <Sun size={17} className="text-slate-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Modo escuro
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {theme === "dark"
                      ? "Interface no tema escuro"
                      : "Interface no tema claro"}
                  </p>
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                  theme === "dark"
                    ? "bg-slate-900 dark:bg-white"
                    : "bg-slate-200"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full shadow transition-transform ${
                    theme === "dark"
                      ? "translate-x-6 bg-white dark:bg-slate-900"
                      : "translate-x-1 bg-white"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
