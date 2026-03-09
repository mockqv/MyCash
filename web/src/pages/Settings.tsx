import { LayoutGrid, Receipt, Settings, LogOut, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function SettingsPage() {
  usePageTitle("Configurações");
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full bg-app-bg dark:bg-dark-bg font-sans">
      <aside className="w-64 bg-app-card dark:bg-dark-card border-r border-app-border dark:border-dark-border hidden xl:flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <img
            src="/Icon.png"
            alt="MyCash"
            className="h-10 w-10 object-contain cursor-pointer shrink-0"
          />
          <h2 className="text-xl font-black text-app-text dark:text-dark-text tracking-tight cursor-default">
            MyCash
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text hover:bg-app-hover dark:hover:bg-dark-hover rounded-2xl font-medium transition-all cursor-pointer text-sm"
          >
            <LayoutGrid className="h-4 w-4" />
            Visão Geral
          </button>
          <button
            onClick={() => navigate("/transactions")}
            className="w-full flex items-center gap-3 px-4 py-3 text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text hover:bg-app-hover dark:hover:bg-dark-hover rounded-2xl font-medium transition-all cursor-pointer text-sm"
          >
            <Receipt className="h-4 w-4" />
            Transações
          </button>
        </nav>

        <div className="p-4 space-y-1 mb-2 mx-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg rounded-2xl font-semibold transition-all cursor-pointer text-sm">
            <Settings className="h-4 w-4" />
            Ajustes
          </button>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl font-medium transition-all cursor-pointer text-sm"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="px-8 lg:px-10 pt-8 pb-6">
          <h1 className="text-2xl font-black text-app-text dark:text-dark-text">
            Configurações
          </h1>
          <p className="text-sm text-app-muted dark:text-dark-muted mt-0.5">
            Personalize sua experiência.
          </p>
        </header>

        <div className="px-8 lg:px-10 pb-10 w-full max-w-175">
          <div className="bg-app-card dark:bg-dark-card rounded-3xl border border-app-border dark:border-dark-border shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-app-border-subtle dark:border-dark-border-subtle">
              <p className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">
                Aparência
              </p>
            </div>

            <div className="px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-app-elevated dark:bg-dark-elevated flex items-center justify-center">
                  {theme === "dark" ? (
                    <Moon
                      size={17}
                      className="text-app-muted dark:text-dark-muted"
                    />
                  ) : (
                    <Sun size={17} className="text-app-muted" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-app-text dark:text-dark-text">
                    Modo escuro
                  </p>
                  <p className="text-xs text-app-muted dark:text-dark-muted mt-0.5">
                    {theme === "dark"
                      ? "Interface no tema escuro"
                      : "Interface no tema claro"}
                  </p>
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${theme === "dark" ? "bg-dark-accent" : "bg-app-elevated"}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full shadow transition-transform ${theme === "dark" ? "translate-x-6 bg-dark-accent-fg" : "translate-x-1 bg-white"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
