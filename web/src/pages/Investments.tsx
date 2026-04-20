import { useState } from "react";
import {
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  X,
  Wallet,
} from "lucide-react";
import { useInvestments, useCreateInvestment, useUpdateInvestment, useDeleteInvestment } from "../hooks/useInvestments";
import { useTotalBalance } from "../hooks/useTransactions";
import { formatCurrency } from "../utils/formatters";
import PageLayout from "../components/PageLayout";
import { usePageTitle } from "../hooks/usePageTitle";
import type { Investment, CreateInvestmentPayload, UpdateInvestmentPayload } from "../types/investment";

const COLOR_OPTIONS = [
  "#8b5cf6", "#3b82f6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#06b6d4", "#6366f1",
];

type ModalMode = "create" | "edit" | null;

interface ModalState {
  mode: ModalMode;
  investment?: Investment;
}

export default function Investments() {
  usePageTitle("Investimentos");
  const { data: investments = [], isLoading } = useInvestments();
  const { data: balanceSummary } = useTotalBalance();
  const createInvestment = useCreateInvestment();
  const updateInvestment = useUpdateInvestment();
  const deleteInvestment = useDeleteInvestment();

  const [modal, setModal] = useState<ModalState>({ mode: null });
  const [error, setError] = useState<string | null>(null);

  const availableBalance = balanceSummary?.availableBalance ?? 0;

  const [form, setForm] = useState({
    name: "",
    description: "",
    amount: "",
    color: "#8b5cf6",
    icon: "TrendingUp",
  });

  const openCreate = () => {
    setForm({ name: "", description: "", amount: "", color: "#8b5cf6", icon: "TrendingUp" });
    setError(null);
    setModal({ mode: "create" });
  };

  const openEdit = (investment: Investment) => {
    setForm({
      name: investment.name,
      description: investment.description ?? "",
      amount: investment.amount.toString(),
      color: investment.color,
      icon: investment.icon,
    });
    setError(null);
    setModal({ mode: "edit", investment });
  };

  const closeModal = () => {
    setModal({ mode: null });
    setError(null);
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return setError("Nome é obrigatório.");
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return setError("Valor deve ser maior que zero.");

    const payload: CreateInvestmentPayload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      amount,
      color: form.color,
      icon: form.icon,
    };

    try {
      await createInvestment.mutateAsync(payload);
      closeModal();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Erro ao criar investimento.");
    }
  };

  const handleEdit = async () => {
    if (!modal.investment) return;
    if (!form.name.trim()) return setError("Nome é obrigatório.");
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount < 0) return setError("Valor inválido.");

    const payload: UpdateInvestmentPayload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      amount,
      color: form.color,
      icon: form.icon,
    };

    try {
      await updateInvestment.mutateAsync({ id: modal.investment.id, ...payload });
      closeModal();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Erro ao atualizar investimento.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este investimento? O valor voltará ao saldo disponível.")) return;
    await deleteInvestment.mutateAsync(id);
  };

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);

  return (
    <PageLayout
      title="Investimentos"
      subtitle="Acompanhe onde seu dinheiro está aplicado."
      actions={
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg rounded-2xl text-sm font-bold shadow-md shadow-app-accent/20 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Novo Investimento
        </button>
      }
    >
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-app-card dark:bg-dark-card rounded-3xl p-6 border border-app-border dark:border-dark-border shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">Saldo Disponível</span>
            <p className="text-2xl font-black text-app-text dark:text-dark-text tracking-tight">{formatCurrency(availableBalance)}</p>
          </div>
          <div className="bg-app-card dark:bg-dark-card rounded-3xl p-6 border border-app-border dark:border-dark-border shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">Total Investido</span>
            <p className="text-2xl font-black text-app-text dark:text-dark-text tracking-tight">{formatCurrency(totalInvested)}</p>
          </div>
          <div className="bg-app-card dark:bg-dark-card rounded-3xl p-6 border border-app-border dark:border-dark-border shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">Investimentos</span>
            <p className="text-2xl font-black text-app-text dark:text-dark-text tracking-tight">{investments.length}</p>
          </div>
        </div>

        {/* Investments list */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-app-card dark:bg-dark-card rounded-3xl p-6 border border-app-border dark:border-dark-border animate-pulse h-36" />
            ))}
          </div>
        ) : investments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-app-card dark:bg-dark-card rounded-3xl border border-dashed border-app-border dark:border-dark-border gap-3">
            <TrendingUp className="h-12 w-12 text-app-muted opacity-40 mb-1" />
            <p className="text-lg font-bold text-app-text dark:text-dark-text">Nenhum investimento registrado</p>
            <p className="text-sm text-app-muted dark:text-dark-muted">Registre seus investimentos e acompanhe seu patrimônio.</p>
            <button
              onClick={openCreate}
              className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-app-accent dark:bg-dark-accent text-app-accent-fg rounded-2xl text-sm font-bold cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {investments.map((inv) => {
              const pct = totalInvested > 0 ? (inv.amount / totalInvested) * 100 : 0;
              return (
                <div key={inv.id} className="bg-app-card dark:bg-dark-card rounded-3xl p-6 border border-app-border dark:border-dark-border shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-sm"
                        style={{ backgroundColor: inv.color }}
                      >
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-bold text-app-text dark:text-dark-text truncate">{inv.name}</p>
                        {inv.description && (
                          <p className="text-xs text-app-muted dark:text-dark-muted truncate mt-0.5">{inv.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(inv)} className="p-1.5 rounded-xl hover:bg-app-elevated dark:hover:bg-dark-elevated text-app-muted hover:text-app-text transition-colors cursor-pointer">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(inv.id)} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-app-muted hover:text-red-500 transition-colors cursor-pointer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-1">Valor</p>
                      <p className="text-2xl font-black text-app-text dark:text-dark-text tracking-tight">{formatCurrency(inv.amount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-app-muted dark:text-dark-muted">do portfólio</p>
                      <p className="text-lg font-black" style={{ color: inv.color }}>{pct.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="h-1.5 bg-app-elevated dark:bg-dark-elevated rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: inv.color }} />
                  </div>

                  <p className="text-xs text-app-muted dark:text-dark-muted">
                    Desde {new Date(inv.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal.mode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-app-card dark:bg-dark-card rounded-3xl p-6 w-full max-w-md border border-app-border dark:border-dark-border shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-app-text dark:text-dark-text">
                {modal.mode === "create" ? "Novo Investimento" : "Editar Investimento"}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-app-elevated dark:hover:bg-dark-elevated text-app-muted cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-app-elevated dark:bg-dark-elevated rounded-2xl p-4 flex items-center gap-3">
                <Wallet className="h-5 w-5 text-app-muted" />
                <div>
                  <p className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">Saldo disponível</p>
                  <p className="text-base font-black text-app-text dark:text-dark-text">
                    {formatCurrency(availableBalance + (modal.mode === "edit" && modal.investment ? modal.investment.amount : 0))}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-1.5 block">Nome</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl bg-app-elevated dark:bg-dark-elevated border border-app-border dark:border-dark-border text-app-text dark:text-dark-text text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-app-accent dark:focus:ring-dark-accent"
                  placeholder="Ex: Tesouro Direto"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-1.5 block">Descrição (opcional)</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl bg-app-elevated dark:bg-dark-elevated border border-app-border dark:border-dark-border text-app-text dark:text-dark-text text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-app-accent dark:focus:ring-dark-accent"
                  placeholder="Opcional"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-1.5 block">Valor Investido</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl bg-app-elevated dark:bg-dark-elevated border border-app-border dark:border-dark-border text-app-text dark:text-dark-text text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-app-accent dark:focus:ring-dark-accent"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-1.5 block">Cor</label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setForm((f) => ({ ...f, color: c }))}
                      className={`h-8 w-8 rounded-full transition-transform cursor-pointer ${form.color === c ? "scale-125 ring-2 ring-offset-2 ring-app-accent" : ""}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={closeModal} className="flex-1 py-3 rounded-2xl bg-app-elevated dark:bg-dark-elevated text-app-text dark:text-dark-text text-sm font-bold cursor-pointer hover:bg-app-hover dark:hover:bg-dark-hover transition-colors">Cancelar</button>
                <button
                  onClick={modal.mode === "create" ? handleCreate : handleEdit}
                  disabled={createInvestment.isPending || updateInvestment.isPending}
                  className="flex-1 py-3 rounded-2xl bg-app-accent dark:bg-dark-accent text-app-accent-fg text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {createInvestment.isPending || updateInvestment.isPending ? "Salvando..." : modal.mode === "create" ? "Criar" : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
