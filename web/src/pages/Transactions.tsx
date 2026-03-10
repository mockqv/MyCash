import { useState, useRef } from "react";
import {
  LayoutGrid,
  Receipt,
  Settings,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  UserRound,
  CalendarClock,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTransactions } from "../hooks/useTransactions";
import { useScheduledTransactions } from "../hooks/useScheduledTransactions";
import {
  useDeleteScheduled,
  useUpdateScheduled,
} from "../hooks/useScheduledMutations";
import { formatCurrency, formatDate } from "../utils/formatters";
import { categoryLabels, categoryStyles } from "../utils/transaction";
import { TransactionType } from "../types/transaction";
import { RecurrenceType } from "../types/scheduled";
import type { Transaction } from "../types/transaction";
import type { ScheduledTransaction } from "../types/scheduled";
import TransactionModal from "../components/TransactionModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ScheduledModal from "../components/ScheduledModal";
import ToastContainer from "../components/ToastContainer";
import AvatarMenu from "../components/AvatarMenu";
import MonthYearPicker from "../components/MonthYearPicker";
import { useToast } from "../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";

type Tab = "transactions" | "scheduled";

export default function Transactions() {
  usePageTitle("Transações");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const { data: transactionsData, isLoading } = useTransactions({
    page,
    pageSize,
    month: selectedMonth,
    year: selectedYear,
  });
  const { data: scheduled = [], isLoading: isLoadingScheduled } =
    useScheduledTransactions();
  const { mutateAsync: deleteScheduled } = useDeleteScheduled();
  const { mutateAsync: updateScheduled } = useUpdateScheduled();

  const transactions = transactionsData?.items ?? [];
  const totalPages = transactionsData?.totalPages ?? 1;
  const { toasts, addToast } = useToast();

  function handleEdit(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  }
  function handleDelete(transaction: Transaction) {
    setSelectedTransaction(transaction);
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

  async function handleDeleteScheduled(id: string) {
    await deleteScheduled(id);
    addToast("Agendado removido.");
  }

  const sidebar = (
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
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full flex items-center gap-3 px-4 py-3 text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text hover:bg-app-hover dark:hover:bg-dark-hover rounded-2xl font-medium transition-all cursor-pointer text-sm"
        >
          <LayoutGrid className="h-4 w-4" />
          Visão Geral
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg rounded-2xl font-semibold transition-all cursor-pointer text-sm">
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
      {sidebar}

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="px-8 lg:px-10 pt-8 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-app-text dark:text-dark-text">
              Transações
            </h1>
            <p className="text-sm text-app-muted dark:text-dark-muted mt-0.5">
              Gerencie todas as suas movimentações.
            </p>
          </div>

          <div className="flex items-center gap-3">
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

        <div className="px-8 lg:px-10 pb-10 flex flex-col gap-4">
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
                      Array.from({ length: pageSize }).map((_, index) => (
                        <tr
                          key={index}
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
                            {item.type === TransactionType.Receita ? "+" : "-"}{" "}
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
                                onClick={() => handleDeleteScheduled(item.id)}
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
          )}
        </div>
      </main>

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
    </div>
  );
}
