import { useState, useRef, useMemo } from "react";
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
  UserRound,
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
import { TransactionType } from "../types/transaction";
import AvatarMenu from "../components/AvatarMenu";
import MonthYearPicker from "../components/MonthYearPicker"
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

function CustomTooltip({ active, payload, label, isPrivacyMode }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-app-card dark:bg-dark-card border border-app-border dark:border-dark-border rounded-2xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-app-text dark:text-dark-text mb-2">
        {label}
      </p>
      <p className="text-green-600 font-semibold">
        Receitas: {isPrivacyMode ? "••••" : formatCurrency(payload[0]?.value)}
      </p>
      <p className="text-red-500 font-semibold">
        Despesas: {isPrivacyMode ? "••••" : formatCurrency(payload[1]?.value)}
      </p>
    </div>
  );
}

export default function Dashboard() {
  usePageTitle("Painel de Controle");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [isPrivacyMode, setIsPrivacyMode] = useState(true);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const { data: transactionsData, isLoading: isLoadingTransactions } =
    useTransactions({
      page: 1,
      pageSize: 10,
      month: selectedMonth,
      year: selectedYear,
    });
  const { data: allTransactionsData } = useTransactions({
    page: 1,
    pageSize: 100,
    year: selectedYear,
  });
  const { data: summary, isLoading: isLoadingSummary } = useTransactionSummary(
    selectedMonth,
    selectedYear,
  );

  const transactions = transactionsData?.items ?? [];
  const balance = (summary?.totalIncome ?? 0) - (summary?.totalExpense ?? 0);
  const maskValue = (value: string) => (isPrivacyMode ? "••••" : value);

  const chartData = useMemo(() => {
    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    const grouped = months.map((month) => ({
      month,
      receitas: 0,
      despesas: 0,
    }));
    allTransactionsData?.items?.forEach((t) => {
      const monthIndex = new Date(t.date).getMonth();
      if (t.type === TransactionType.Receita)
        grouped[monthIndex].receitas += t.amount;
      else grouped[monthIndex].despesas += t.amount;
    });
    return grouped;
  }, [allTransactionsData]);

  const sidebarNav = (
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
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg rounded-2xl font-semibold transition-all cursor-pointer text-sm">
          <LayoutGrid className="h-4 w-4" />
          Visão Geral
        </button>
        <button
          onClick={() => navigate("/transactions")}
          className="w-full flex items-center gap-3 px-4 py-3 text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text hover:bg-app-hover dark:hover:bg-dark-hover rounded-2xl font-medium transition-all cursor-pointer text-sm"
        >
          <Receipt className="h-4 w-4" />
          Transações
        </button>
      </nav>

      <div className="p-4 space-y-1 mb-2 mx-2">
        <button
          onClick={() => navigate("/settings")}
          className="w-full flex items-center gap-3 px-4 py-3 text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text hover:bg-app-hover dark:hover:bg-dark-hover rounded-2xl font-medium transition-all cursor-pointer text-sm"
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

  return (
    <div className="flex min-h-screen w-full bg-app-bg dark:bg-dark-bg font-sans">
      {sidebarNav}

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="px-8 lg:px-10 pt-8 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-app-text dark:text-dark-text">
              Painel de Controle
            </h1>
            <p className="text-sm text-app-muted dark:text-dark-muted mt-0.5">
              Olá, {user?.name?.split(" ")[0] ?? "usuário"}. Aqui está o resumo
              do seu mês.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <MonthYearPicker
              month={selectedMonth}
              year={selectedYear}
              onChange={(m: number, y: number) => { setSelectedMonth(m); setSelectedYear(y) }}
            />

            <button
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              className="h-10 w-10 rounded-2xl flex items-center justify-center bg-app-card dark:bg-dark-card border border-app-border dark:border-dark-border shadow-sm transition-colors cursor-pointer text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text"
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

        <div className="px-8 lg:px-10 pb-10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-app-card dark:bg-dark-card rounded-3xl p-6 border border-app-border dark:border-dark-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">
                  Entradas
                </span>
                <div className="h-8 w-8 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
              </div>
              {isLoadingSummary ? (
                <div className="h-8 w-36 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-xl" />
              ) : (
                <p className="text-2xl font-black text-app-text dark:text-dark-text">
                  {maskValue(formatCurrency(summary?.totalIncome ?? 0))}
                </p>
              )}
            </div>

            <div className="bg-app-card dark:bg-dark-card rounded-3xl p-6 border border-app-border dark:border-dark-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">
                  Saídas
                </span>
                <div className="h-8 w-8 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                </div>
              </div>
              {isLoadingSummary ? (
                <div className="h-8 w-36 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-xl" />
              ) : (
                <p className="text-2xl font-black text-app-text dark:text-dark-text">
                  {maskValue(formatCurrency(summary?.totalExpense ?? 0))}
                </p>
              )}
            </div>

            <div className="bg-app-accent dark:bg-dark-accent rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/5" />
              <div className="absolute -right-1 -bottom-6 h-28 w-28 rounded-full bg-white/5" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <span className="text-xs font-semibold text-app-accent-fg/50 dark:text-dark-accent-fg/50 uppercase tracking-widest">
                  Saldo
                </span>
                <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-app-accent-fg dark:text-dark-accent-fg" />
                </div>
              </div>
              {isLoadingSummary ? (
                <div className="h-8 w-36 bg-white/10 animate-pulse rounded-xl" />
              ) : (
                <p className="text-2xl font-black text-app-accent-fg dark:text-dark-accent-fg relative z-10">
                  {maskValue(formatCurrency(balance))}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
            <div className="xl:col-span-3 bg-app-card dark:bg-dark-card rounded-3xl p-6 border border-app-border dark:border-dark-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-black text-app-text dark:text-dark-text">
                    Visão Anual
                  </h2>
                  <p className="text-xs text-app-muted dark:text-dark-muted mt-0.5">
                    Receitas vs Despesas — {selectedYear}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-app-muted dark:text-dark-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-app-accent dark:bg-dark-accent inline-block" />
                    Receitas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-app-faint dark:bg-dark-faint inline-block" />
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
                    stroke="#27272a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip
                    content={<CustomTooltip isPrivacyMode={isPrivacyMode} />}
                    cursor={{ stroke: "#27272a", strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="receitas"
                    stroke="#ffffff"
                    strokeWidth={2.5}
                    fill="url(#gradReceitas)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#ffffff", strokeWidth: 0 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="despesas"
                    stroke="#52525b"
                    strokeWidth={2}
                    fill="url(#gradDespesas)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#52525b", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="xl:col-span-2 bg-app-card dark:bg-dark-card rounded-3xl p-6 border border-app-border dark:border-dark-border shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-black text-app-text dark:text-dark-text">
                  Últimas Transações
                </h2>
                <button
                  onClick={() => navigate("/transactions")}
                  className="text-xs font-semibold text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text transition-colors cursor-pointer"
                >
                  Ver todas
                </button>
              </div>

              <div className="flex flex-col gap-1 flex-1">
                {isLoadingTransactions ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 border-b border-app-border-subtle dark:border-dark-border-subtle"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-2xl bg-app-elevated dark:bg-dark-elevated animate-pulse" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-24 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-lg" />
                          <div className="h-2.5 w-16 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-lg" />
                        </div>
                      </div>
                      <div className="h-3 w-16 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-lg" />
                    </div>
                  ))
                ) : transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1 py-8 gap-2">
                    <p className="text-sm text-app-muted dark:text-dark-muted text-center">
                      Nenhuma transação em
                    </p>
                    <p className="text-xs font-semibold text-app-faint dark:text-dark-faint">
                      {new Intl.DateTimeFormat("pt-BR", {
                        month: "long",
                        year: "numeric",
                      }).format(new Date(selectedYear, selectedMonth - 1))}
                    </p>
                  </div>
                ) : (
                  transactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between py-3 border-b border-app-border-subtle dark:border-dark-border-subtle last:border-0"
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
                          <p className="text-sm font-semibold text-app-text dark:text-dark-text leading-tight">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-app-muted dark:text-dark-muted mt-0.5">
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
