import { useState, useMemo } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  EyeOff,
  Eye,
  PlusCircle,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";
import {
  useTransactions,
  useTransactionSummary,
} from "../hooks/useTransactions";
import { useScheduledTransactions } from "../hooks/useScheduledTransactions";
import { formatCurrency, formatDate } from "../utils/formatters";
import { TransactionType, TransactionCategory } from "../types/transaction";
import { categoryLabels, categoryColors } from "../utils/transaction";
import MonthYearPicker from "../components/MonthYearPicker";
import PageLayout from "../components/PageLayout";
import { useTheme } from "../contexts/ThemeContext";
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
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);

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
    selectedYear
  );
  const { data: scheduledData, isLoading: isLoadingScheduled } = useScheduledTransactions();

  const transactions = transactionsData?.items ?? [];
  const balance = (summary?.totalIncome ?? 0) - (summary?.totalExpense ?? 0);
  const maskValue = (value: string) => (isPrivacyMode ? "••••" : value);

  const sortedScheduled = useMemo(() => {
    if (!scheduledData) return [];
    return [...scheduledData]
      .filter((s) => s.isActive)
      .sort((a, b) => {
        const currentDay = new Date().getDate();
        const aPassed = a.dayOfMonth < currentDay;
        const bPassed = b.dayOfMonth < currentDay;
        if (aPassed && !bPassed) return 1;
        if (!aPassed && bPassed) return -1;
        return a.dayOfMonth - b.dayOfMonth;
      });
  }, [scheduledData]);

  const getScheduledStatus = (dayOfMonth: number) => {
    const currentDay = new Date().getDate();
    const daysUntilDue = dayOfMonth - currentDay;
    if (daysUntilDue === 0) return { text: "Hoje", isUrgent: true, isPast: false };
    if (daysUntilDue === 1) return { text: "Amanhã", isUrgent: true, isPast: false };
    if (daysUntilDue > 1 && daysUntilDue <= 7) return { text: `Em ${daysUntilDue} dias`, isUrgent: false, isPast: false };
    if (daysUntilDue > 7) return { text: `Dia ${dayOfMonth}`, isUrgent: false, isPast: false };
    return { text: "Já passou", isUrgent: false, isPast: true };
  };

  const receitaColor = theme === "dark" ? "#ffffff" : "#0f172a";
  const despesaColor = theme === "dark" ? "#52525b" : "#94a3b8";

  const chartData = useMemo(() => {
    const months = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez",
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

  const categoryChartData = useMemo(() => {
    const counts: Partial<Record<TransactionCategory, number>> = {};
    allTransactionsData?.items
      ?.filter((t) => {
        const d = new Date(t.date);
        return (
          d.getMonth() + 1 === selectedMonth &&
          d.getFullYear() === selectedYear &&
          t.type === TransactionType.Despesa
        );
      })
      .forEach((t) => {
        counts[t.category] = (counts[t.category] ?? 0) + t.amount;
      });
    return Object.entries(counts).map(([cat, value]) => ({
      category: Number(cat) as TransactionCategory,
      name: categoryLabels[Number(cat) as TransactionCategory],
      value,
      color: categoryColors[Number(cat) as TransactionCategory],
    }));
  }, [allTransactionsData, selectedMonth, selectedYear]);

  return (
    <PageLayout
      title="Painel Geral"
      subtitle={`Bem-vindo(a) de volta, ${user?.name?.split(" ")[0] ?? "usuário"}.`}
      actions={
        <>
          <MonthYearPicker
            month={selectedMonth}
            year={selectedYear}
            onChange={(m: number, y: number) => {
              setSelectedMonth(m);
              setSelectedYear(y);
            }}
          />
          <button
            onClick={() => setIsPrivacyMode(!isPrivacyMode)}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl flex items-center justify-center bg-app-card dark:bg-dark-card border border-app-border dark:border-dark-border shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text"
            title={isPrivacyMode ? "Mostrar valores" : "Ocultar valores"}
          >
            {isPrivacyMode ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Acesso Rápido */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-app-accent dark:text-dark-accent" />
            <span className="text-sm font-bold text-app-text dark:text-dark-text tracking-tight uppercase">
              Acesso Rápido
            </span>
          </div>
          <div className="flex">
            <button
              onClick={() => navigate("/transactions", { state: { newTransaction: true } })}
              className="flex items-center justify-center gap-3 px-6 py-3.5 sm:py-4 bg-app-card dark:bg-dark-card rounded-2xl border border-app-border dark:border-dark-border hover:shadow-md hover:border-app-accent/30 transition-all group cursor-pointer"
            >
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusCircle className="h-4 w-4 text-green-500" />
              </div>
              <span className="text-sm font-semibold text-app-text dark:text-dark-text">
                Nova Transação
              </span>
            </button>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-app-accent dark:bg-dark-accent rounded-[2rem] p-6 shadow-xl shadow-app-accent/20 dark:shadow-none relative overflow-hidden flex flex-col justify-between min-h-[140px]">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5" />
            <div className="absolute -right-2 -bottom-6 h-32 w-32 rounded-full bg-white/5" />
            <div className="flex items-center justify-between relative z-10 w-full mb-2">
              <span className="text-xs font-semibold text-app-accent-fg/70 dark:text-dark-accent-fg/70 uppercase tracking-widest">
                Saldo Atual
              </span>
              <div className="h-9 w-9 rounded-2xl bg-white/10 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-app-accent-fg dark:text-dark-accent-fg" />
              </div>
            </div>
            {isLoadingSummary ? (
              <div className="h-8 w-36 bg-white/20 animate-pulse rounded-xl" />
            ) : (
              <p className="text-[32px] font-black text-app-accent-fg dark:text-dark-accent-fg relative z-10 tracking-tight leading-none">
                {maskValue(formatCurrency(balance))}
              </p>
            )}
          </div>

          <div className="bg-app-card dark:bg-dark-card rounded-[2rem] p-6 border border-app-border dark:border-dark-border shadow-sm flex flex-col justify-between min-h-[140px] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">
                Entradas
              </span>
              <div className="h-9 w-9 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </div>
            </div>
            {isLoadingSummary ? (
              <div className="h-8 w-36 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-xl" />
            ) : (
              <p className="text-[28px] font-black text-app-text dark:text-dark-text tracking-tight leading-none">
                {maskValue(formatCurrency(summary?.totalIncome ?? 0))}
              </p>
            )}
          </div>

          <div className="bg-app-card dark:bg-dark-card rounded-[2rem] p-6 border border-app-border dark:border-dark-border shadow-sm flex flex-col justify-between min-h-[140px] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">
                Saídas
              </span>
              <div className="h-9 w-9 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              </div>
            </div>
            {isLoadingSummary ? (
              <div className="h-8 w-36 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-xl" />
            ) : (
              <p className="text-[28px] font-black text-app-text dark:text-dark-text tracking-tight leading-none">
                {maskValue(formatCurrency(summary?.totalExpense ?? 0))}
              </p>
            )}
          </div>
        </div>

        {/* Charts & Lists - Grids */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Main Chart Area */}
          <div className="xl:col-span-8 bg-app-card dark:bg-dark-card rounded-3xl p-6 lg:p-8 border border-app-border dark:border-dark-border shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-xl font-black text-app-text dark:text-dark-text tracking-tight">
                  Fluxo de Caixa Anual
                </h2>
                <p className="text-sm text-app-muted dark:text-dark-muted mt-1">
                  Acompanhamento de entradas e saídas ao longo de {selectedYear}
                </p>
              </div>
              <div className="flex items-center gap-5 text-sm font-semibold text-app-muted dark:text-dark-muted bg-app-elevated dark:bg-dark-elevated px-4 py-2 rounded-xl">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-app-accent dark:bg-dark-accent inline-block shadow-sm" />
                  Receitas
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-app-faint dark:bg-dark-faint inline-block shadow-sm" />
                  Despesas
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={chartData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradReceitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={receitaColor} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={receitaColor} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDespesas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={despesaColor} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={despesaColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#71717a", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: "#71717a", fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$ ${v / 1000}k`} />
                <Tooltip content={<CustomTooltip isPrivacyMode={isPrivacyMode} />} cursor={{ stroke: "#71717a", strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Area type="monotone" dataKey="receitas" stroke={receitaColor} strokeWidth={3} fill="url(#gradReceitas)" dot={false} activeDot={{ r: 6, fill: receitaColor, strokeWidth: 2, stroke: "#fff" }} />
                <Area type="monotone" dataKey="despesas" stroke={despesaColor} strokeWidth={3} fill="url(#gradDespesas)" dot={false} activeDot={{ r: 6, fill: despesaColor, strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Categories area */}
          <div className="xl:col-span-4 bg-app-card dark:bg-dark-card rounded-3xl p-6 lg:p-8 border border-app-border dark:border-dark-border shadow-sm flex flex-col">
            <div className="mb-6">
               <div className="flex items-center justify-between">
                 <h2 className="text-xl font-black text-app-text dark:text-dark-text tracking-tight">
                  Suas Despesas
                 </h2>
                 <button className="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-app-elevated dark:hover:bg-dark-elevated text-app-muted transition-colors">
                   <ChevronRight size={18} />
                 </button>
               </div>
              <p className="text-sm text-app-muted dark:text-dark-muted mt-1">
                Para onde seu dinheiro está indo
              </p>
            </div>
            {categoryChartData.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-app-elevated/50 dark:bg-dark-elevated/50 rounded-2xl border border-dashed border-app-border dark:border-dark-border">
                <PieChart className="text-app-muted dark:text-dark-muted mb-2" />
                <p className="text-sm font-semibold text-app-muted dark:text-dark-muted">
                  Nenhuma despesa
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6 flex-1">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryChartData.map((entry) => (
                        <Cell key={entry.category} fill={entry.color} />
                      ))}
                    </Pie>
                    <PieTooltip
                      formatter={(value: number | undefined, name: string | undefined) => [
                        isPrivacyMode ? "••••" : formatCurrency(value ?? 0),
                        name ?? "",
                      ]}
                      contentStyle={{
                        background: "var(--color-app-card)",
                        border: "1px solid var(--color-app-border)",
                        borderRadius: "16px",
                        fontSize: "13px",
                        fontWeight: 600,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        padding: "10px 14px"
                      }}
                      itemStyle={{ color: "var(--color-app-text)", padding: 0 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-3">
                  {categoryChartData.map((entry) => (
                    <div key={entry.category} className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-app-elevated dark:hover:bg-dark-elevated transition-colors cursor-default border border-transparent hover:border-app-border dark:hover:border-dark-border">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: entry.color, boxShadow: `0 0 10px ${entry.color}80` }}
                        />
                        <span className="text-sm font-semibold text-app-text dark:text-dark-text">
                          {entry.name}
                        </span>
                      </div>
                      <span className="text-[15px] font-black text-app-text dark:text-dark-text tracking-tight">
                        {isPrivacyMode ? "••••" : formatCurrency(entry.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Agenda Financeira - Real Data */}
          <div className="xl:col-span-5 bg-gradient-to-br from-app-card to-app-hover dark:from-dark-card dark:to-dark-hover rounded-3xl p-6 border border-app-border dark:border-dark-border shadow-sm flex flex-col relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="pr-12">
                <h2 className="text-xl font-black text-app-text dark:text-dark-text tracking-tight flex items-center gap-2">
                   Agenda Financeira
                </h2>
                <p className="text-sm text-app-muted dark:text-dark-muted mt-1">Seus compromissos mensais</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 flex-1 relative z-10">
              {isLoadingScheduled ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5 px-4 bg-app-elevated/30 rounded-2xl animate-pulse">
                     <div className="h-11 w-11 rounded-2xl bg-app-elevated dark:bg-dark-elevated" />
                     <div className="flex-1 ml-4 space-y-2">
                        <div className="h-3 w-24 bg-app-elevated dark:bg-dark-elevated rounded-lg" />
                        <div className="h-2 w-16 bg-app-elevated dark:bg-dark-elevated rounded-lg" />
                     </div>
                  </div>
                ))
              ) : sortedScheduled.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 py-6 gap-2 bg-app-elevated/30 rounded-2xl border border-dashed border-app-border dark:border-dark-border">
                  <Clock className="h-8 w-8 text-app-muted opacity-50 mb-1" />
                  <p className="text-sm font-semibold text-app-text dark:text-dark-text">Nada agendado</p>
                </div>
              ) : (
                sortedScheduled.slice(0, 5).map((item) => {
                  const status = getScheduledStatus(item.dayOfMonth);
                  return (
                    <div key={item.id} className={`flex items-center justify-between py-3.5 px-4 bg-app-elevated dark:bg-dark-elevated rounded-2xl border border-transparent hover:border-app-border dark:border-dark-border transition-colors cursor-default ${status.isPast ? 'opacity-70' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${status.isPast ? 'bg-app-card dark:bg-dark-card text-app-muted' : status.isUrgent ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-500' : 'bg-app-card dark:bg-dark-card text-app-text'}`}>
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className={`text-[15px] font-bold leading-tight ${status.isPast ? 'text-app-muted dark:text-dark-muted line-through' : 'text-app-text dark:text-dark-text'}`}>
                            {item.description}
                          </p>
                          <p className={`text-[13px] mt-1 font-bold ${status.isPast ? 'text-app-faint' : status.isUrgent ? 'text-orange-500' : 'text-app-muted dark:text-dark-muted'}`}>
                            {status.text}
                          </p>
                        </div>
                      </div>
                      <p className={`text-[15px] font-black tracking-tight ${item.type === TransactionType.Receita ? 'text-green-600' : 'text-red-500'} ${status.isPast ? 'opacity-70' : ''}`}>
                        {maskValue(formatCurrency(item.amount))}
                      </p>
                    </div>
                  );
                })
              )}
              {sortedScheduled.length > 5 && (
                <div className="mt-2 w-full pt-3 border-t border-app-border dark:border-dark-border border-dashed">
                  <button onClick={() => navigate("/transactions")} className="w-full py-2 rounded-2xl text-sm font-bold text-app-muted hover:text-app-text hover:bg-app-elevated dark:hover:bg-dark-elevated transition-colors flex items-center justify-center gap-2">
                    Ver todos ({sortedScheduled.length}) <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Últimas Transações */}
          <div className="xl:col-span-7 bg-app-card dark:bg-dark-card rounded-3xl p-6 lg:p-8 border border-app-border dark:border-dark-border shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
               <div>
                  <h2 className="text-xl font-black text-app-text dark:text-dark-text tracking-tight">
                    Histórico Recente
                  </h2>
                  <p className="text-sm text-app-muted dark:text-dark-muted mt-1">Últimas movimentações lançadas</p>
               </div>
              <button
                onClick={() => navigate("/transactions")}
                className="text-sm font-bold bg-app-elevated dark:bg-dark-elevated hover:bg-app-hover dark:hover:bg-dark-hover px-4 py-2.5 rounded-xl text-app-text dark:text-dark-text transition-colors cursor-pointer"
              >
                Ver todas
              </button>
            </div>
            
            <div className="flex flex-col gap-2 flex-1 relative">
              {isLoadingTransactions ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-3 px-2 bg-app-elevated/30 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-app-elevated dark:bg-dark-elevated animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-3.5 w-32 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-lg" />
                        <div className="h-2.5 w-20 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-lg" />
                      </div>
                    </div>
                    <div className="h-4 w-24 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-lg" />
                  </div>
                ))
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 py-10 gap-3 bg-app-elevated/50 dark:bg-dark-elevated/50 rounded-2xl border border-dashed border-app-border dark:border-dark-border">
                  <Wallet className="h-10 w-10 text-app-muted opacity-50 mb-2" />
                  <p className="text-[15px] font-semibold text-app-text dark:text-dark-text text-center">
                    Nenhuma transação lançada
                  </p>
                  <p className="text-sm font-semibold text-app-muted dark:text-dark-muted">
                    No mês de {new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date(selectedYear, selectedMonth - 1))}
                  </p>
                  <button onClick={() => navigate("/transactions")} className="mt-4 text-sm font-bold text-app-accent dark:text-dark-accent bg-app-accent/5 px-5 py-2.5 rounded-xl hover:bg-app-accent/10 transition-colors">
                     Adicionar Agora
                  </button>
                </div>
              ) : (
                transactions.slice(0, 4).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-4 px-4 hover:bg-app-elevated dark:hover:bg-dark-elevated rounded-2xl transition-colors group cursor-pointer border border-transparent hover:border-app-border dark:hover:border-dark-border"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm ${transaction.type === TransactionType.Receita ? "bg-green-50 text-green-500 dark:bg-green-500/10" : "bg-red-50 text-red-500 dark:bg-red-500/10"}`}
                      >
                        {transaction.type === TransactionType.Receita ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-app-text dark:text-dark-text leading-tight group-hover:text-app-accent transition-colors">
                          {transaction.description}
                        </p>
                        <p className="text-[13px] text-app-muted dark:text-dark-muted mt-1 font-semibold">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`text-[16px] pr-2 font-black tracking-tight ${transaction.type === TransactionType.Receita ? "text-green-600" : "text-red-500"}`}
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
    </PageLayout>
  );
}
