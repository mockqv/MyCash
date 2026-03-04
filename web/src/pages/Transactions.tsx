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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTransactions } from "../hooks/useTransactions";
import { formatCurrency, formatDate } from "../utils/formatters";
import { categoryLabels, categoryStyles } from "../utils/transaction";
import { TransactionType } from "../types/transaction";
import type { Transaction } from "../types/transaction";
import TransactionModal from "../components/TransactionModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ToastContainer from "../components/ToastContainer";
import AvatarMenu from "../components/AvatarMenu";
import { useToast } from "../hooks/useToast";
import { useNavigate } from "react-router-dom";

export default function Transactions() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const { data: transactionsData, isLoading } = useTransactions(page, pageSize);
  const transactions = transactionsData?.items ?? [];
  const totalPages = transactionsData?.totalPages ?? 1;

  const { toasts, addToast } = useToast();

  const avatarInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";

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
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl font-medium transition-all cursor-pointer text-sm"
          >
            <LayoutGrid className="h-4 w-4" />
            Visão Geral
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-semibold transition-all cursor-pointer text-sm">
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
              Transações
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Gerencie todas as suas movimentações.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 h-10 px-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold transition-opacity hover:opacity-80 cursor-pointer"
            >
              <Plus size={15} />
              Nova transação
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

        <div className="px-8 lg:px-10 pb-10">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50 dark:border-slate-700/50">
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-widest px-6 py-4">
                      Descrição
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-widest px-6 py-4">
                      Categoria
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-widest px-6 py-4">
                      Data
                    </th>
                    <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-widest px-6 py-4">
                      Valor
                    </th>
                    <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-widest px-6 py-4">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: pageSize }).map((_, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-50 dark:border-slate-700/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-2xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
                            <div className="h-3.5 w-32 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-lg" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 w-20 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-full" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-3.5 w-24 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-lg" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="h-3.5 w-20 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-lg ml-auto" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="h-3.5 w-14 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-lg ml-auto" />
                        </td>
                      </tr>
                    ))
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center text-slate-400 py-20 text-sm"
                      >
                        Nenhuma transação encontrada.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/60 dark:hover:bg-slate-700/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 ${transaction.type === TransactionType.Receita ? "bg-green-50 dark:bg-green-500/10" : "bg-red-50 dark:bg-red-500/10"}`}
                            >
                              {transaction.type === TransactionType.Receita ? (
                                <ArrowUpRight className="h-4 w-4 text-green-500" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
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
                        <td className="px-6 py-4 text-sm text-slate-400 font-medium">
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
                              className="h-8 w-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer text-slate-400 hover:text-slate-700 dark:hover:text-white"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(transaction)}
                              className="h-8 w-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer text-slate-400"
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
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50 dark:border-slate-700/50">
                <span className="text-xs text-slate-400 font-medium">
                  Página {page} de {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-8 w-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="h-8 w-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
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
      <ToastContainer toasts={toasts} />
    </div>
  );
}
