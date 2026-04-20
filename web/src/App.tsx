import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import Investments from "./pages/Investments";
import Settings from "./pages/Settings";
import Customize from "./pages/Customize";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ScheduledConfirmModal from "./components/ScheduledConfirmModal";
import { useScheduledPending } from "./hooks/useScheduledTransactions";
import type { ScheduledOccurrence } from "./types/scheduled";

const queryClient = new QueryClient();

function PendingChecker() {
  const { user } = useAuth();
  const { data: pending = [] } = useScheduledPending();
  const [shownIds, setShownIds] = useState<string[]>([]);

  if (!user || pending.length === 0) return null;

  const unseen = pending.filter(
    (p: ScheduledOccurrence) => !shownIds.includes(p.id),
  );
  if (unseen.length === 0) return null;

  return (
    <ScheduledConfirmModal
      items={unseen}
      onDismiss={() =>
        setShownIds((prev) => [...prev, ...unseen.map((p) => p.id)])
      }
    />
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <PendingChecker />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/goals"
                element={
                  <ProtectedRoute>
                    <Goals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/investments"
                element={
                  <ProtectedRoute>
                    <Investments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customize"
                element={
                  <ProtectedRoute>
                    <Customize />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
