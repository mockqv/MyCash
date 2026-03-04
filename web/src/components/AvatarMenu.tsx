import { useEffect, useRef } from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
};

export default function AvatarMenu({ isOpen, onClose, anchorRef }: Props) {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-12 z-50 w-48 bg-app-card dark:bg-dark-card border border-app-border dark:border-dark-border rounded-2xl shadow-lg overflow-hidden"
    >
      <button
        onClick={() => {
          navigate("/settings");
          onClose();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-app-muted dark:text-dark-muted hover:bg-app-hover dark:hover:bg-dark-hover hover:text-app-text dark:hover:text-dark-text transition-colors cursor-pointer"
      >
        <Settings size={15} />
        Configurações
      </button>
    </div>
  );
}
