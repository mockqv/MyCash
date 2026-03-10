import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ScheduledConfirmModal from "./components/ScheduledConfirmModal";
import { useScheduledDueToday } from "./hooks/useScheduledTransactions";

const queryClient = new QueryClient();

function DueTodayChecker() {
  const { user } = useAuth();
  const { data: dueToday = [] } = useScheduledDueToday();
  const [dismissed, setDismissed] = useState(false);

  const todayKey = new Date().toISOString().split("T")[0];
  const storageKey = `scheduled-dismissed-${todayKey}`;

  useEffect(() => {
    if (sessionStorage.getItem(storageKey)) {
      setDismissed(true);
    }
  }, [storageKey]);

  function handleDismiss() {
    sessionStorage.setItem(storageKey, "true");
    setDismissed(true);
  }

  if (!user || dismissed || dueToday.length === 0) return null;

  return <ScheduledConfirmModal items={dueToday} onDismiss={handleDismiss} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <DueTodayChecker />
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
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
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
