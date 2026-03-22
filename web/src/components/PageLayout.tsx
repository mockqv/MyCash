import { useRef, useState } from "react";
import { UserRound, Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "./Sidebar";
import AvatarMenu from "./AvatarMenu";

type Props = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export default function PageLayout({
  title,
  subtitle,
  actions,
  children,
}: Props) {
  const { user } = useAuth();
  const avatarRef = useRef<HTMLDivElement>(null);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-app-bg dark:bg-dark-bg font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-y-auto w-full relative xl:ml-64">
        <header className="px-6 lg:px-10 pt-8 pb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="xl:hidden p-2.5 -ml-2 rounded-xl text-app-text dark:text-dark-text hover:bg-app-hover dark:hover:bg-dark-hover transition-colors flex-shrink-0"
              aria-label="Abrir menu"
            >
              <Menu size={24} strokeWidth={2.5} />
            </button>
            <div className="truncate">
              <h1 className="text-2xl font-black text-app-text dark:text-dark-text truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-app-muted dark:text-dark-muted mt-0.5 truncate hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
            <div className="relative ml-2">
              <div
                ref={avatarRef}
                onClick={() => setIsAvatarMenuOpen((prev) => !prev)}
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg flex items-center justify-center cursor-pointer hover:shadow-md hover:shadow-app-accent/20 transition-all hover:-translate-y-0.5"
                title={user?.name ?? ""}
              >
                <UserRound size={18} strokeWidth={2.5} />
              </div>
              <AvatarMenu
                isOpen={isAvatarMenuOpen}
                onClose={() => setIsAvatarMenuOpen(false)}
                anchorRef={avatarRef}
              />
            </div>
          </div>
        </header>

        <div className="px-6 lg:px-10 pb-10 max-w-[1600px] mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
