import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import PageLayout from "../components/PageLayout";

export default function SettingsPage() {
  usePageTitle("Configurações");
  const { theme, toggleTheme } = useTheme();

  return (
    <PageLayout title="Configurações" subtitle="Personalize sua experiência.">
      <div className="w-full max-w-175">
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
    </PageLayout>
  );
}
