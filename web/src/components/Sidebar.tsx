import { LayoutGrid, Receipt, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const links = [
    { label: "Visão Geral", icon: LayoutGrid, path: "/dashboard" },
    { label: "Transações", icon: Receipt, path: "/transactions" },
  ];

  return (
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
        {links.map(({ label, icon: Icon, path }) => {
          const isActive = pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all cursor-pointer text-sm ${
                isActive
                  ? "bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg font-semibold"
                  : "text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text hover:bg-app-hover dark:hover:bg-dark-hover"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 space-y-1 mb-2 mx-2">
        <button
          onClick={() => navigate("/settings")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all cursor-pointer text-sm ${
            pathname === "/settings"
              ? "bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg font-semibold"
              : "text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text hover:bg-app-hover dark:hover:bg-dark-hover"
          }`}
        >
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
  );
}
