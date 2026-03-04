import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import loadingSvg from "../assets/loading.svg";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg dark:bg-dark-bg">
        <div className="flex flex-col items-center gap-6">
          <img
            src={loadingSvg}
            alt="Carregando"
            className="w-40 h-40 object-contain"
          />
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin border-spruce" />
            <span className="text-sm font-medium text-app-muted dark:text-dark-muted">
              Carregando...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
