import { useState } from "react";
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
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "../contexts/AuthContext";
import { useTransactions } from "../hooks/useTransactions";
import { formatCurrency, formatDate } from "../utils/formatters";
import { categoryLabels, categoryStyles } from "../utils/transaction";
import { TransactionType } from "../types/transaction";
import type { Transaction } from "../types/transaction";
import TransactionModal from "../components/TransactionModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ToastContainer from "../components/ToastContainer";
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
    <div className="flex min-h-screen w-full bg-linen text-slate-900 font-sans">
      <aside className="w-64 bg-white border-r border-slate-200/60 hidden xl:flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-spruce flex items-center justify-center shadow-sm cursor-pointer hover:bg-spruce-dark transition-colors">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h2 className="text-2xl font-bold text-spruce-dark tracking-tight cursor-default">
            MyCash
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-spruce-dark hover:bg-slate-50 rounded-2xl font-medium transition-colors cursor-pointer"
          >
            <LayoutGrid className="h-5 w-5" />
            Visão Geral
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-spruce/10 text-spruce rounded-2xl font-semibold transition-colors cursor-pointer">
            <Receipt className="h-5 w-5" />
            Transações
          </button>
        </nav>

        <div className="p-4 pt-0 space-y-1 mb-2 border-t border-slate-100 mx-4 mt-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-spruce-dark hover:bg-slate-50 rounded-2xl font-medium transition-colors cursor-pointer mt-2">
            <Settings className="h-5 w-5" />
            Ajustes
          </button>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500/80 hover:text-red-600 hover:bg-red-50 rounded-2xl font-medium transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-24 px-8 lg:px-12 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-spruce-dark">Transações</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Gerencie todas as suas movimentações.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 h-10 px-5 rounded-full text-white text-sm font-semibold transition-colors cursor-pointer"
              style={{ backgroundColor: "#4A7766" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "#375b4e")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "#4A7766")
              }
            >
              <Plus size={16} />
              Nova transação
            </button>

            <div
              className="h-10 w-10 rounded-full bg-spruce text-white flex items-center justify-center font-bold border-2 border-white shadow-sm cursor-pointer ml-1 hover:bg-spruce-dark transition-colors"
              title={user?.name ?? ""}
            >
              {avatarInitials}
            </div>
          </div>
        </header>

        <div className="p-8 lg:p-12 pt-0 w-full max-w-[1400px] mx-auto">
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
            <div className="p-2">
              <Table>
                <TableHeader>
                  <TableRow className="border-none hover:bg-transparent cursor-default">
                    <TableHead className="font-semibold text-slate-400 h-10 px-4">
                      Descrição
                    </TableHead>
                    <TableHead className="font-semibold text-slate-400 h-10 px-4">
                      Categoria
                    </TableHead>
                    <TableHead className="font-semibold text-slate-400 h-10 px-4">
                      Data
                    </TableHead>
                    <TableHead className="text-right font-semibold text-slate-400 h-10 px-4">
                      Valor
                    </TableHead>
                    <TableHead className="text-right font-semibold text-slate-400 h-10 px-4">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: pageSize }).map((_, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-slate-50 cursor-default"
                      >
                        <TableCell className="px-4 py-5">
                          <div className="h-4 w-3/4 bg-slate-200/70 animate-pulse rounded" />
                        </TableCell>
                        <TableCell className="px-4 py-5">
                          <div className="h-6 w-20 bg-slate-200/70 animate-pulse rounded-full" />
                        </TableCell>
                        <TableCell className="px-4 py-5">
                          <div className="h-4 w-24 bg-slate-200/70 animate-pulse rounded" />
                        </TableCell>
                        <TableCell className="px-4 py-5 text-right">
                          <div className="h-4 w-24 bg-slate-200/70 animate-pulse rounded ml-auto" />
                        </TableCell>
                        <TableCell className="px-4 py-5 text-right">
                          <div className="h-4 w-16 bg-slate-200/70 animate-pulse rounded ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-slate-400 py-16 text-sm"
                      >
                        Nenhuma transação encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell className="font-bold text-slate-700 px-4 py-4">
                          {transaction.description}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <span
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${categoryStyles[transaction.category]}`}
                          >
                            {categoryLabels[transaction.category]}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-500 font-medium px-4 py-4">
                          {formatDate(transaction.date)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-bold text-base px-4 py-4 ${transaction.type === TransactionType.Receita ? "text-green-600" : "text-red-600"}`}
                        >
                          {`${transaction.type === TransactionType.Receita ? "+" : "-"} ${formatCurrency(transaction.amount)}`}
                        </TableCell>
                        <TableCell className="text-right px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(transaction)}
                              className="h-8 w-8 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-spruce/10 hover:text-spruce transition-colors cursor-pointer text-slate-500"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(transaction)}
                              className="h-8 w-8 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer text-slate-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <span className="text-sm text-slate-400">
                  Página {page} de {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-8 w-8 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="h-8 w-8 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
                  >
                    <ChevronRight size={16} />
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
