import { LayoutGrid, Receipt, Settings, LogOut, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const links = [
    { label: "Visão Geral", icon: LayoutGrid, path: "/dashboard" },
    { label: "Transações", icon: Receipt, path: "/transactions" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 xl:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 xl:w-64 bg-app-card/95 dark:bg-dark-card/95 backdrop-blur-xl border-r border-app-border dark:border-dark-border flex flex-col transition-transform duration-300 ease-in-out transform shadow-2xl xl:shadow-none xl:translate-x-0 xl:relative ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3" onClick={() => handleNavigation("/dashboard")}>
            <img
              src="/Icon.png"
              alt="MyCash"
              className="h-10 w-10 object-contain cursor-pointer shrink-0 drop-shadow-sm"
            />
            <h2 className="text-xl font-black text-app-text dark:text-dark-text tracking-tight cursor-default">
              MyCash
            </h2>
          </div>
          <button
            onClick={onClose}
            className="xl:hidden p-2 -mr-2 rounded-xl text-app-muted hover:text-app-text hover:bg-app-hover dark:hover:bg-dark-hover transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-2">
          {links.map(({ label, icon: Icon, path }) => {
            const isActive = pathname === path;
            return (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all cursor-pointer text-sm ${
                  isActive
                    ? "bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg shadow-md shadow-app-accent/20 dark:shadow-none"
                    : "text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text hover:bg-app-hover dark:hover:bg-dark-hover"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "opacity-100" : "opacity-70"}`} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 space-y-2 mb-4 mx-2">
          <button
            onClick={() => handleNavigation("/settings")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all cursor-pointer text-sm ${
              pathname === "/settings"
                ? "bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg shadow-md shadow-app-accent/20 dark:shadow-none"
                : "text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text hover:bg-app-hover dark:hover:bg-dark-hover"
            }`}
          >
            <Settings className={`h-5 w-5 ${pathname === "/settings" ? "opacity-100" : "opacity-70"}`} />
            Ajustes
          </button>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl font-medium transition-all cursor-pointer text-sm"
          >
            <LogOut className="h-5 w-5 opacity-80" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
