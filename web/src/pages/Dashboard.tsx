import { useState, useRef } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  LayoutGrid,
  Receipt,
  Settings,
  LogOut,
  EyeOff,
  Eye,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";
import {
  useTransactions,
  useTransactionSummary,
} from "../hooks/useTransactions";
import { formatCurrency, formatDate } from "../utils/formatters";
import { categoryLabels, categoryStyles } from "../utils/transaction";
import { TransactionType } from "../types/transaction";
import AvatarMenu from "../components/AvatarMenu";
import { useNavigate } from "react-router-dom";

const chartData = [
  { month: "Jan", receitas: 3200, despesas: 1800 },
  { month: "Fev", receitas: 4100, despesas: 2200 },
  { month: "Mar", receitas: 3800, despesas: 2900 },
  { month: "Abr", receitas: 5200, despesas: 2100 },
  { month: "Mai", receitas: 4700, despesas: 3100 },
  { month: "Jun", receitas: 5900, despesas: 2400 },
  { month: "Jul", receitas: 4800, despesas: 2800 },
  { month: "Ago", receitas: 6200, despesas: 3200 },
  { month: "Set", receitas: 5400, despesas: 2600 },
  { month: "Out", receitas: 7100, despesas: 3400 },
  { month: "Nov", receitas: 6300, despesas: 2900 },
  { month: "Dez", receitas: 8400, despesas: 3100 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-slate-700 dark:text-slate-200 mb-2">
        {label}
      </p>
      <p className="text-green-600 font-semibold">
        Receitas: {formatCurrency(payload[0]?.value)}
      </p>
      <p className="text-red-500 font-semibold">
        Despesas: {formatCurrency(payload[1]?.value)}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isPrivacyMode, setIsPrivacyMode] = useState(true);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const { data: transactionsData, isLoading: isLoadingTransactions } =
    useTransactions();
  const { data: summary, isLoading: isLoadingSummary } =
    useTransactionSummary();

  const transactions = transactionsData?.items ?? [];
  const maskValue = (value: string) => (isPrivacyMode ? "••••" : value);
  const avatarInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";

  return (
    <div className="flex min-h-screen w-full bg-[#f0f2f5] dark:bg-slate-900 font-sans">
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 hidden xl:flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-sm cursor-pointer">
            <span className="text-white dark:text-slate-900 font-black text-lg">
              M
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight cursor-default">
            MyCash
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-semibold transition-all cursor-pointer text-sm">
            <LayoutGrid className="h-4 w-4" />
            Visão Geral
          </button>
          <button
            onClick={() => navigate("/transactions")}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl font-medium transition-all cursor-pointer text-sm"
          >
            <Receipt className="h-4 w-4" />
            Transações
          </button>
        </nav>

        <div className="p-4 space-y-1 mb-2 mx-2">
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl font-medium transition-all cursor-pointer text-sm"
          >
            <Settings className="h-4 w-4" />
            Ajustes
          </button>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl font-medium transition-all cursor-pointer text-sm"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="px-8 lg:px-10 pt-8 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Painel de Controle
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Olá, {user?.name?.split(" ")[0] ?? "usuário"}. Aqui está o resumo
              do seu mês.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              className="h-10 w-10 rounded-2xl flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors cursor-pointer text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              {isPrivacyMode ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>

            <div className="relative">
              <div
                ref={avatarRef}
                onClick={() => setIsAvatarMenuOpen((prev) => !prev)}
                className="h-10 w-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-sm cursor-pointer hover:opacity-80 transition-opacity"
                title={user?.name ?? ""}
              >
                {avatarInitials}
              </div>
              <AvatarMenu
                isOpen={isAvatarMenuOpen}
                onClose={() => setIsAvatarMenuOpen(false)}
                anchorRef={avatarRef}
              />
            </div>
          </div>
        </header>

        <div className="px-8 lg:px-10 pb-10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Entradas
                </span>
                <div className="h-8 w-8 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
              </div>
              {isLoadingSummary ? (
                <div className="h-8 w-36 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-xl" />
              ) : (
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {maskValue(formatCurrency(summary?.totalIncome ?? 0))}
                </p>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Saídas
                </span>
                <div className="h-8 w-8 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                </div>
              </div>
              {isLoadingSummary ? (
                <div className="h-8 w-36 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-xl" />
              ) : (
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {maskValue(formatCurrency(summary?.totalExpenses ?? 0))}
                </p>
              )}
            </div>

            <div className="bg-slate-900 dark:bg-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/5 dark:bg-slate-900/5" />
              <div className="absolute -right-1 -bottom-6 h-28 w-28 rounded-full bg-white/5 dark:bg-slate-900/5" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <span className="text-xs font-semibold text-white/50 dark:text-slate-400 uppercase tracking-widest">
                  Saldo
                </span>
                <div className="h-8 w-8 rounded-xl bg-white/10 dark:bg-slate-900/10 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-white dark:text-slate-900" />
                </div>
              </div>
              {isLoadingSummary ? (
                <div className="h-8 w-36 bg-white/10 dark:bg-slate-900/10 animate-pulse rounded-xl" />
              ) : (
                <p className="text-2xl font-black text-white dark:text-slate-900 relative z-10">
                  {maskValue(formatCurrency(summary?.balance ?? 0))}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
            <div className="xl:col-span-3 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    Visão Anual
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Receitas vs Despesas — 2026
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white inline-block" />
                    Receitas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" />
                    Despesas
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="gradReceitas"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#0f172a"
                        stopOpacity={0.12}
                      />
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="gradDespesas"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#94a3b8"
                        stopOpacity={0.12}
                      />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: any) => `${v / 1000}k`}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="receitas"
                    stroke="#0f172a"
                    strokeWidth={2.5}
                    fill="url(#gradReceitas)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#0f172a", strokeWidth: 0 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="despesas"
                    stroke="#cbd5e1"
                    strokeWidth={2}
                    fill="url(#gradDespesas)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#cbd5e1", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Últimas Transações
                </h2>
                <button
                  onClick={() => navigate("/transactions")}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Ver todas
                </button>
              </div>

              <div className="flex flex-col gap-1 flex-1">
                {isLoadingTransactions ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-2xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-24 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-lg" />
                          <div className="h-2.5 w-16 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-lg" />
                        </div>
                      </div>
                      <div className="h-3 w-16 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-lg" />
                    </div>
                  ))
                ) : transactions.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">
                    Nenhuma transação encontrada.
                  </p>
                ) : (
                  transactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-2xl flex items-center justify-center ${transaction.type === TransactionType.Receita ? "bg-green-50 dark:bg-green-500/10" : "bg-red-50 dark:bg-red-500/10"}`}
                        >
                          {transaction.type === TransactionType.Receita ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`text-sm font-black ${transaction.type === TransactionType.Receita ? "text-green-600" : "text-red-500"}`}
                      >
                        {maskValue(
                          `${transaction.type === TransactionType.Receita ? "+" : "-"} ${formatCurrency(transaction.amount)}`,
                        )}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
