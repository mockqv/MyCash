import { useState } from "react";
import {
  Receipt,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  CalendarClock,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useTransactions } from "../hooks/useTransactions";
import {
  useScheduledTransactions,
  useScheduledPending,
} from "../hooks/useScheduledTransactions";
import {
  useUpdateScheduled,
  useConfirmOccurrence,
  useSkipOccurrence,
} from "../hooks/useScheduledMutations";
import { formatCurrency, formatDate } from "../utils/formatters";
import { categoryLabels, categoryStyles } from "../utils/transaction";
import { TransactionType } from "../types/transaction";
import { RecurrenceType } from "../types/scheduled";
import type { Transaction } from "../types/transaction";
import type {
  ScheduledTransaction,
  ScheduledOccurrence,
} from "../types/scheduled";
import TransactionModal from "../components/TransactionModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ScheduledModal from "../components/ScheduledModal";
import ToastContainer from "../components/ToastContainer";
import MonthYearPicker from "../components/MonthYearPicker";
import PageLayout from "../components/PageLayout";
import { useToast } from "../hooks/useToast";
import { usePageTitle } from "@/hooks/usePageTitle";
import DeleteScheduledConfirmModal from "../components/DeleteScheduledConfirmModal";

type Tab = "transactions" | "scheduled";

export default function Transactions() {
  usePageTitle("Transações");

  const [activeTab, setActiveTab] = useState<Tab>("transactions");
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isScheduledModalOpen, setIsScheduledModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [selectedScheduled, setSelectedScheduled] =
    useState<ScheduledTransaction | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [skippingId, setSkippingId] = useState<string | null>(null);
  const [isDeleteScheduledOpen, setIsDeleteScheduledOpen] = useState(false);
  const [scheduledToDelete, setScheduledToDelete] =
    useState<ScheduledTransaction | null>(null);

  const { data: transactionsData, isLoading } = useTransactions({
    page,
    pageSize,
    month: selectedMonth,
    year: selectedYear,
  });
  const { data: scheduled = [], isLoading: isLoadingScheduled } =
    useScheduledTransactions();
  const { data: pending = [] } = useScheduledPending();
  const { mutateAsync: updateScheduled } = useUpdateScheduled();
  const { mutateAsync: confirmOccurrence } = useConfirmOccurrence();
  const { mutateAsync: skipOccurrence } = useSkipOccurrence();

  const transactions = transactionsData?.items ?? [];
  const totalPages = transactionsData?.totalPages ?? 1;
  const { toasts, addToast } = useToast();
  const pendingCount = pending.length;

  function handleEdit(t: Transaction) {
    setSelectedTransaction(t);
    setIsModalOpen(true);
  }
  function handleDelete(t: Transaction) {
    setSelectedTransaction(t);
    setIsDeleteOpen(true);
  }
  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  }
  function handleCloseDelete() {
    setIsDeleteOpen(false);
    setSelectedTransaction(null);
  }
  function handleMonthChange(month: number, year: number) {
    setSelectedMonth(month);
    setSelectedYear(year);
    setPage(1);
  }
  function handleEditScheduled(item: ScheduledTransaction) {
    setSelectedScheduled(item);
    setIsScheduledModalOpen(true);
  }
  function handleCloseScheduledModal() {
    setIsScheduledModalOpen(false);
    setSelectedScheduled(null);
  }

  async function handleToggleActive(item: ScheduledTransaction) {
    await updateScheduled({
      id: item.id,
      description: item.description,
      amount: item.amount,
      type: item.type,
      category: item.category,
      recurrence: item.recurrence,
      dayOfMonth: item.dayOfMonth,
      isActive: !item.isActive,
    });
    addToast(item.isActive ? "Agendado pausado." : "Agendado reativado.");
  }

  function handleDeleteScheduled(item: ScheduledTransaction) {
    setScheduledToDelete(item);
    setIsDeleteScheduledOpen(true);
  }

  function handleCloseDeleteScheduled() {
    setIsDeleteScheduledOpen(false);
    setScheduledToDelete(null);
  }

  async function handleConfirmDue(occurrenceId: string) {
    setConfirmingId(occurrenceId);
    try {
      await confirmOccurrence(occurrenceId);
      addToast("Transação confirmada e lançada.");
    } finally {
      setConfirmingId(null);
    }
  }

  async function handleSkipDue(occurrenceId: string) {
    setSkippingId(occurrenceId);
    try {
      await skipOccurrence(occurrenceId);
      addToast("Agendado ignorado.");
    } finally {
      setSkippingId(null);
    }
  }

  return (
    <>
      <PageLayout
        title="Transações"
        subtitle="Gerencie todas as suas movimentações."
        actions={
          <>
            {activeTab === "transactions" && (
              <MonthYearPicker
                month={selectedMonth}
                year={selectedYear}
                onChange={handleMonthChange}
              />
            )}
            <button
              onClick={() =>
                activeTab === "transactions"
                  ? setIsModalOpen(true)
                  : setIsScheduledModalOpen(true)
              }
              className="flex items-center gap-2 h-10 px-5 rounded-2xl bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg text-sm font-semibold transition-opacity hover:opacity-80 cursor-pointer"
            >
              <Plus size={15} />
              {activeTab === "transactions"
                ? "Nova transação"
                : "Novo agendado"}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-1 p-1 bg-app-card dark:bg-dark-card border border-app-border dark:border-dark-border rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab("transactions")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "transactions"
                  ? "bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg"
                  : "text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text"
              }`}
            >
              <Receipt size={14} />
              Transações
            </button>
            <button
              onClick={() => setActiveTab("scheduled")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "scheduled"
                  ? "bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg"
                  : "text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text"
              }`}
            >
              <CalendarClock size={14} />
              Agendados
              {pendingCount > 0 && (
                <span className="h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          {activeTab === "transactions" && (
            <div className="bg-app-card dark:bg-dark-card rounded-3xl border border-app-border dark:border-dark-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-app-border-subtle dark:border-dark-border-subtle">
                      <th className="text-left text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest px-6 py-4">
                        Descrição
                      </th>
                      <th className="text-left text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest px-6 py-4">
                        Categoria
                      </th>
                      <th className="text-left text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest px-6 py-4">
                        Data
                      </th>
                      <th className="text-right text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest px-6 py-4">
                        Valor
                      </th>
                      <th className="text-right text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest px-6 py-4">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array.from({ length: pageSize }).map((_, i) => (
                        <tr
                          key={i}
                          className="border-b border-app-border-subtle dark:border-dark-border-subtle"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-2xl bg-app-elevated dark:bg-dark-elevated animate-pulse" />
                              <div className="h-3.5 w-32 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-lg" />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-6 w-20 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-full" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-3.5 w-24 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-lg" />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="h-3.5 w-20 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-lg ml-auto" />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="h-3.5 w-14 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-lg ml-auto" />
                          </td>
                        </tr>
                      ))
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-20">
                          <p className="text-sm text-app-muted dark:text-dark-muted">
                            Nenhuma transação em
                          </p>
                          <p className="text-xs font-semibold text-app-faint dark:text-dark-faint mt-1">
                            {new Intl.DateTimeFormat("pt-BR", {
                              month: "long",
                              year: "numeric",
                            }).format(
                              new Date(selectedYear, selectedMonth - 1),
                            )}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b border-app-border-subtle dark:border-dark-border-subtle hover:bg-app-hover dark:hover:bg-dark-hover transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 ${transaction.type === TransactionType.Receita ? "bg-green-50 dark:bg-green-500/10" : "bg-red-50 dark:bg-red-500/10"}`}
                              >
                                {transaction.type ===
                                TransactionType.Receita ? (
                                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                                ) : (
                                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                              <span className="text-sm font-semibold text-app-text dark:text-dark-text">
                                {transaction.description}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${categoryStyles[transaction.category]}`}
                            >
                              {categoryLabels[transaction.category]}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-app-muted dark:text-dark-muted font-medium">
                            {formatDate(transaction.date)}
                          </td>
                          <td
                            className={`px-6 py-4 text-right text-sm font-black ${transaction.type === TransactionType.Receita ? "text-green-600" : "text-red-500"}`}
                          >
                            {`${transaction.type === TransactionType.Receita ? "+" : "-"} ${formatCurrency(transaction.amount)}`}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(transaction)}
                                className="h-8 w-8 rounded-xl flex items-center justify-center bg-app-elevated dark:bg-dark-elevated hover:bg-app-hover dark:hover:bg-dark-hover transition-colors cursor-pointer text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(transaction)}
                                className="h-8 w-8 rounded-xl flex items-center justify-center bg-app-elevated dark:bg-dark-elevated hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer text-app-muted dark:text-dark-muted"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-app-border-subtle dark:border-dark-border-subtle">
                  <span className="text-xs text-app-muted dark:text-dark-muted font-medium">
                    Página {page} de {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="h-8 w-8 rounded-xl flex items-center justify-center bg-app-elevated dark:bg-dark-elevated hover:bg-app-hover dark:hover:bg-dark-hover transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-app-muted dark:text-dark-muted"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="h-8 w-8 rounded-xl flex items-center justify-center bg-app-elevated dark:bg-dark-elevated hover:bg-app-hover dark:hover:bg-dark-hover transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-app-muted dark:text-dark-muted"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "scheduled" && (
            <div className="flex flex-col gap-4">
              {pending.length > 0 && (
                <div className="bg-app-card dark:bg-dark-card rounded-3xl border border-amber-500/30 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-amber-500/20 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                      Pendentes — {pending.length}{" "}
                      {pending.length === 1 ? "item" : "itens"}
                    </p>
                  </div>
                  <div className="divide-y divide-app-border-subtle dark:divide-dark-border-subtle">
                    {pending.map((item: ScheduledOccurrence) => {
                      const isReceita = item.type === TransactionType.Receita;
                      const isConfirming = confirmingId === item.id;
                      const isSkipping = skippingId === item.id;
                      return (
                        <div
                          key={item.id}
                          className="px-6 py-4 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 ${isReceita ? "bg-green-50 dark:bg-green-500/10" : "bg-red-50 dark:bg-red-500/10"}`}
                            >
                              <CalendarClock
                                className={`h-4 w-4 ${isReceita ? "text-green-500" : "text-red-500"}`}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-app-text dark:text-dark-text truncate">
                                {item.description}
                              </p>
                              <p className="text-xs text-app-muted dark:text-dark-muted">
                                {categoryLabels[item.category]}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span
                              className={`text-sm font-black ${isReceita ? "text-green-600" : "text-red-500"}`}
                            >
                              {isReceita ? "+" : "-"}{" "}
                              {formatCurrency(item.amount)}
                            </span>
                            <button
                              onClick={() => handleConfirmDue(item.id)}
                              disabled={isConfirming || isSkipping}
                              className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-40"
                            >
                              {isConfirming ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={12} />
                              )}
                              Confirmar
                            </button>
                            <button
                              onClick={() => handleSkipDue(item.id)}
                              disabled={isConfirming || isSkipping}
                              className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-40"
                            >
                              {isSkipping ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <XCircle size={12} />
                              )}
                              Ignorar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-app-card dark:bg-dark-card rounded-3xl border border-app-border dark:border-dark-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-app-border-subtle dark:border-dark-border-subtle">
                        <th className="text-left text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest px-6 py-4">
                          Descrição
                        </th>
                        <th className="text-left text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest px-6 py-4">
                          Categoria
                        </th>
                        <th className="text-left text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest px-6 py-4">
                          Dia
                        </th>
                        <th className="text-left text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest px-6 py-4">
                          Recorrência
                        </th>
                        <th className="text-right text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest px-6 py-4">
                          Valor
                        </th>
                        <th className="text-right text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest px-6 py-4">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingScheduled ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr
                            key={i}
                            className="border-b border-app-border-subtle dark:border-dark-border-subtle"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-2xl bg-app-elevated dark:bg-dark-elevated animate-pulse" />
                                <div className="h-3.5 w-32 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-lg" />
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-6 w-20 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-full" />
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-3.5 w-8 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-lg" />
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-3.5 w-16 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-lg" />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="h-3.5 w-20 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-lg ml-auto" />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="h-3.5 w-14 bg-app-elevated dark:bg-dark-elevated animate-pulse rounded-lg ml-auto" />
                            </td>
                          </tr>
                        ))
                      ) : scheduled.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-20">
                            <p className="text-sm text-app-muted dark:text-dark-muted">
                              Nenhum agendado cadastrado.
                            </p>
                            <p className="text-xs text-app-faint dark:text-dark-faint mt-1">
                              Clique em "Novo agendado" para começar.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        scheduled.map((item) => (
                          <tr
                            key={item.id}
                            className={`border-b border-app-border-subtle dark:border-dark-border-subtle hover:bg-app-hover dark:hover:bg-dark-hover transition-colors ${!item.isActive ? "opacity-50" : ""}`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 ${item.type === TransactionType.Receita ? "bg-green-50 dark:bg-green-500/10" : "bg-red-50 dark:bg-red-500/10"}`}
                                >
                                  <CalendarClock
                                    className={`h-4 w-4 ${item.type === TransactionType.Receita ? "text-green-500" : "text-red-500"}`}
                                  />
                                </div>
                                <div>
                                  <span className="text-sm font-semibold text-app-text dark:text-dark-text">
                                    {item.description}
                                  </span>
                                  {!item.isActive && (
                                    <p className="text-xs text-app-faint dark:text-dark-faint">
                                      Pausado
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${categoryStyles[item.category]}`}
                              >
                                {categoryLabels[item.category]}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-app-muted dark:text-dark-muted font-medium">
                              Todo dia {item.dayOfMonth}
                            </td>
                            <td className="px-6 py-4 text-sm text-app-muted dark:text-dark-muted font-medium">
                              {item.recurrence === RecurrenceType.Monthly
                                ? "Mensal"
                                : "—"}
                            </td>
                            <td
                              className={`px-6 py-4 text-right text-sm font-black ${item.type === TransactionType.Receita ? "text-green-600" : "text-red-500"}`}
                            >
                              {item.type === TransactionType.Receita
                                ? "+"
                                : "-"}{" "}
                              {formatCurrency(item.amount)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleToggleActive(item)}
                                  className="h-8 w-8 rounded-xl flex items-center justify-center bg-app-elevated dark:bg-dark-elevated hover:bg-app-hover dark:hover:bg-dark-hover transition-colors cursor-pointer text-app-muted dark:text-dark-muted"
                                  title={item.isActive ? "Pausar" : "Reativar"}
                                >
                                  {item.isActive ? (
                                    <ToggleRight
                                      size={15}
                                      className="text-green-500"
                                    />
                                  ) : (
                                    <ToggleLeft size={15} />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleEditScheduled(item)}
                                  className="h-8 w-8 rounded-xl flex items-center justify-center bg-app-elevated dark:bg-dark-elevated hover:bg-app-hover dark:hover:bg-dark-hover transition-colors cursor-pointer text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteScheduled(item)}
                                  className="h-8 w-8 rounded-xl flex items-center justify-center bg-app-elevated dark:bg-dark-elevated hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer text-app-muted dark:text-dark-muted"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageLayout>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={selectedTransaction}
      />
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={handleCloseDelete}
        transaction={selectedTransaction}
        onSuccess={() => addToast("Transação excluída com sucesso.")}
      />
      <ScheduledModal
        isOpen={isScheduledModalOpen}
        onClose={handleCloseScheduledModal}
        scheduled={selectedScheduled}
      />
      <ToastContainer toasts={toasts} />
      <DeleteScheduledConfirmModal
        isOpen={isDeleteScheduledOpen}
        onClose={handleCloseDeleteScheduled}
        scheduled={scheduledToDelete}
        onSuccess={() => addToast("Agendado removido.")}
      />
    </>
  );
}
