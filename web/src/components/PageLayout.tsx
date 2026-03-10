import { useRef, useState } from "react";
import { UserRound } from "lucide-react";
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

  return (
    <div className="flex min-h-screen w-full bg-app-bg dark:bg-dark-bg font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="px-8 lg:px-10 pt-8 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-app-text dark:text-dark-text">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-app-muted dark:text-dark-muted mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {actions}
            <div className="relative">
              <div
                ref={avatarRef}
                onClick={() => setIsAvatarMenuOpen((prev) => !prev)}
                className="h-10 w-10 rounded-2xl bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                title={user?.name ?? ""}
              >
                <UserRound size={18} />
              </div>
              <AvatarMenu
                isOpen={isAvatarMenuOpen}
                onClose={() => setIsAvatarMenuOpen(false)}
                anchorRef={avatarRef}
              />
            </div>
          </div>
        </header>

        <div className="px-8 lg:px-10 pb-10">{children}</div>
      </main>
    </div>
  );
}
