import { useState } from "react";
import {
  Target,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronRight,
  Wallet,
} from "lucide-react";
import { useGoals, useCreateGoal, useUpdateGoal, useAllocateGoal, useDeleteGoal } from "../hooks/useGoals";
import { useTotalBalance } from "../hooks/useTransactions";
import { formatCurrency } from "../utils/formatters";
import PageLayout from "../components/PageLayout";
import { usePageTitle } from "../hooks/usePageTitle";
import type { Goal, CreateGoalPayload, UpdateGoalPayload } from "../types/goal";

const ICON_OPTIONS = ["Target", "Star", "Home", "Car", "Plane", "Heart", "Book", "Gift", "Trophy", "Zap"];
const COLOR_OPTIONS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#06b6d4", "#6366f1",
];

function GoalIcon({ icon, color }: { icon: string; color: string }) {
  return (
    <div
      className="h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-lg font-black shadow-sm"
      style={{ backgroundColor: color }}
    >
      <Target className="h-5 w-5" />
    </div>
  );
}

type ModalMode = "create" | "edit" | "allocate" | null;

interface ModalState {
  mode: ModalMode;
  goal?: Goal;
}

export default function Goals() {
  usePageTitle("Metas");
  const { data: goals = [], isLoading } = useGoals();
  const { data: balanceSummary } = useTotalBalance();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const allocateGoal = useAllocateGoal();
  const deleteGoal = useDeleteGoal();

  const [modal, setModal] = useState<ModalState>({ mode: null });
  const [error, setError] = useState<string | null>(null);

  const availableBalance = balanceSummary?.availableBalance ?? 0;

  // Create/Edit form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    targetAmount: "",
    initialAllocation: "",
    deadline: "",
    color: "#3b82f6",
    icon: "Target",
    isCompleted: false,
  });

  // Allocate form state
  const [allocateAmount, setAllocateAmount] = useState("");

  const openCreate = () => {
    setForm({ name: "", description: "", targetAmount: "", initialAllocation: "", deadline: "", color: "#3b82f6", icon: "Target", isCompleted: false });
    setError(null);
    setModal({ mode: "create" });
  };

  const openEdit = (goal: Goal) => {
    setForm({
      name: goal.name,
      description: goal.description ?? "",
      targetAmount: goal.targetAmount.toString(),
      initialAllocation: "",
      deadline: goal.deadline ? goal.deadline.split("T")[0] : "",
      color: goal.color,
      icon: goal.icon,
      isCompleted: goal.isCompleted,
    });
    setError(null);
    setModal({ mode: "edit", goal });
  };

  const openAllocate = (goal: Goal) => {
    setAllocateAmount(goal.allocatedAmount.toString());
    setError(null);
    setModal({ mode: "allocate", goal });
  };

  const closeModal = () => {
    setModal({ mode: null });
    setError(null);
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return setError("Nome é obrigatório.");
    const target = parseFloat(form.targetAmount);
    if (!target || target <= 0) return setError("Valor da meta deve ser maior que zero.");
    const initial = parseFloat(form.initialAllocation) || 0;

    const payload: CreateGoalPayload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      targetAmount: target,
      initialAllocation: initial,
      deadline: form.deadline || undefined,
      color: form.color,
      icon: form.icon,
    };

    try {
      await createGoal.mutateAsync(payload);
      closeModal();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Erro ao criar meta.");
    }
  };

  const handleEdit = async () => {
    if (!modal.goal) return;
    if (!form.name.trim()) return setError("Nome é obrigatório.");
    const target = parseFloat(form.targetAmount);
    if (!target || target <= 0) return setError("Valor da meta deve ser maior que zero.");

    const payload: UpdateGoalPayload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      targetAmount: target,
      deadline: form.deadline || undefined,
      color: form.color,
      icon: form.icon,
      isCompleted: form.isCompleted,
    };

    try {
      await updateGoal.mutateAsync({ id: modal.goal.id, ...payload });
      closeModal();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Erro ao atualizar meta.");
    }
  };

  const handleAllocate = async () => {
    if (!modal.goal) return;
    const amount = parseFloat(allocateAmount);
    if (isNaN(amount) || amount < 0) return setError("Valor inválido.");

    const delta = amount - modal.goal.allocatedAmount;
    if (delta > 0 && delta > availableBalance + modal.goal.allocatedAmount - modal.goal.allocatedAmount) {
      // Recalc: available already accounts for current allocation
    }

    try {
      await allocateGoal.mutateAsync({ id: modal.goal.id, allocatedAmount: amount });
      closeModal();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Erro ao alocar valor.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta meta? O valor alocado voltará ao saldo disponível.")) return;
    await deleteGoal.mutateAsync(id);
  };

  const totalAllocated = goals.reduce((s, g) => s + g.allocatedAmount, 0);

  return (
    <PageLayout
      title="Metas"
      subtitle="Defina e acompanhe seus objetivos financeiros."
      actions={
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg rounded-2xl text-sm font-bold shadow-md shadow-app-accent/20 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nova Meta
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
            <span className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">Alocado em Metas</span>
            <p className="text-2xl font-black text-app-text dark:text-dark-text tracking-tight">{formatCurrency(totalAllocated)}</p>
          </div>
          <div className="bg-app-card dark:bg-dark-card rounded-3xl p-6 border border-app-border dark:border-dark-border shadow-sm flex flex-col gap-1">
            <span className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">Total de Metas</span>
            <p className="text-2xl font-black text-app-text dark:text-dark-text tracking-tight">{goals.length}</p>
          </div>
        </div>

        {/* Goals list */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-app-card dark:bg-dark-card rounded-3xl p-6 border border-app-border dark:border-dark-border animate-pulse h-48" />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-app-card dark:bg-dark-card rounded-3xl border border-dashed border-app-border dark:border-dark-border gap-3">
            <Target className="h-12 w-12 text-app-muted opacity-40 mb-1" />
            <p className="text-lg font-bold text-app-text dark:text-dark-text">Nenhuma meta criada</p>
            <p className="text-sm text-app-muted dark:text-dark-muted">Crie sua primeira meta financeira.</p>
            <button
              onClick={openCreate}
              className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-app-accent dark:bg-dark-accent text-app-accent-fg rounded-2xl text-sm font-bold cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Criar Meta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {goals.map((goal) => {
              const progress = goal.targetAmount > 0 ? Math.min((goal.allocatedAmount / goal.targetAmount) * 100, 100) : 0;
              return (
                <div key={goal.id} className="bg-app-card dark:bg-dark-card rounded-3xl p-6 border border-app-border dark:border-dark-border shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <GoalIcon icon={goal.icon} color={goal.color} />
                      <div className="min-w-0">
                        <p className="text-base font-bold text-app-text dark:text-dark-text truncate flex items-center gap-2">
                          {goal.name}
                          {goal.isCompleted && <Check className="h-4 w-4 text-green-500 flex-shrink-0" />}
                        </p>
                        {goal.description && (
                          <p className="text-xs text-app-muted dark:text-dark-muted truncate mt-0.5">{goal.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(goal)} className="p-1.5 rounded-xl hover:bg-app-elevated dark:hover:bg-dark-elevated text-app-muted hover:text-app-text transition-colors cursor-pointer">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(goal.id)} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-app-muted hover:text-red-500 transition-colors cursor-pointer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-app-muted dark:text-dark-muted">{formatCurrency(goal.allocatedAmount)} alocado</span>
                      <span className="text-app-text dark:text-dark-text">{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div className="h-2 bg-app-elevated dark:bg-dark-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%`, backgroundColor: goal.color }}
                      />
                    </div>
                    <p className="text-xs font-bold text-right" style={{ color: goal.color }}>{progress.toFixed(0)}%</p>
                  </div>

                  {goal.deadline && (
                    <p className="text-xs text-app-muted dark:text-dark-muted">
                      Prazo: {new Date(goal.deadline).toLocaleDateString("pt-BR")}
                    </p>
                  )}

                  <button
                    onClick={() => openAllocate(goal)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-app-elevated dark:bg-dark-elevated hover:bg-app-hover dark:hover:bg-dark-hover text-app-text dark:text-dark-text text-sm font-bold transition-colors cursor-pointer"
                  >
                    <Wallet className="h-4 w-4" /> Gerenciar alocação <ChevronRight className="h-4 w-4" />
                  </button>
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
                {modal.mode === "create" ? "Nova Meta" : modal.mode === "edit" ? "Editar Meta" : "Gerenciar Alocação"}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-app-elevated dark:hover:bg-dark-elevated text-app-muted cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {modal.mode === "allocate" ? (
              <div className="space-y-4">
                <div className="bg-app-elevated dark:bg-dark-elevated rounded-2xl p-4 space-y-1">
                  <p className="text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest">Saldo disponível</p>
                  <p className="text-lg font-black text-app-text dark:text-dark-text">
                    {formatCurrency(availableBalance + (modal.goal?.allocatedAmount ?? 0))}
                  </p>
                  <p className="text-xs text-app-muted dark:text-dark-muted">Incluindo o que já está nesta meta</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-1.5 block">
                    Valor alocado nesta meta
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={allocateAmount}
                    onChange={(e) => setAllocateAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-app-elevated dark:bg-dark-elevated border border-app-border dark:border-dark-border text-app-text dark:text-dark-text text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-app-accent dark:focus:ring-dark-accent"
                    placeholder="0,00"
                  />
                </div>
                {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
                <div className="flex gap-3 pt-2">
                  <button onClick={closeModal} className="flex-1 py-3 rounded-2xl bg-app-elevated dark:bg-dark-elevated text-app-text dark:text-dark-text text-sm font-bold cursor-pointer hover:bg-app-hover dark:hover:bg-dark-hover transition-colors">Cancelar</button>
                  <button onClick={handleAllocate} disabled={allocateGoal.isPending} className="flex-1 py-3 rounded-2xl bg-app-accent dark:bg-dark-accent text-app-accent-fg text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50">
                    {allocateGoal.isPending ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-1.5 block">Nome</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl bg-app-elevated dark:bg-dark-elevated border border-app-border dark:border-dark-border text-app-text dark:text-dark-text text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-app-accent dark:focus:ring-dark-accent"
                    placeholder="Ex: Viagem para Europa"
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-1.5 block">Valor da Meta</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.targetAmount}
                      onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
                      className="w-full px-4 py-3 rounded-2xl bg-app-elevated dark:bg-dark-elevated border border-app-border dark:border-dark-border text-app-text dark:text-dark-text text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-app-accent dark:focus:ring-dark-accent"
                      placeholder="0,00"
                    />
                  </div>
                  {modal.mode === "create" && (
                    <div>
                      <label className="text-xs font-bold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-1.5 block">Alocar Agora</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.initialAllocation}
                        onChange={(e) => setForm((f) => ({ ...f, initialAllocation: e.target.value }))}
                        className="w-full px-4 py-3 rounded-2xl bg-app-elevated dark:bg-dark-elevated border border-app-border dark:border-dark-border text-app-text dark:text-dark-text text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-app-accent dark:focus:ring-dark-accent"
                        placeholder="0,00"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-1.5 block">Prazo (opcional)</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl bg-app-elevated dark:bg-dark-elevated border border-app-border dark:border-dark-border text-app-text dark:text-dark-text text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-app-accent dark:focus:ring-dark-accent"
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
                {modal.mode === "edit" && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isCompleted}
                      onChange={(e) => setForm((f) => ({ ...f, isCompleted: e.target.checked }))}
                      className="h-4 w-4 rounded accent-app-accent"
                    />
                    <span className="text-sm font-semibold text-app-text dark:text-dark-text">Marcar como concluída</span>
                  </label>
                )}
                {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
                <div className="flex gap-3 pt-2">
                  <button onClick={closeModal} className="flex-1 py-3 rounded-2xl bg-app-elevated dark:bg-dark-elevated text-app-text dark:text-dark-text text-sm font-bold cursor-pointer hover:bg-app-hover dark:hover:bg-dark-hover transition-colors">Cancelar</button>
                  <button
                    onClick={modal.mode === "create" ? handleCreate : handleEdit}
                    disabled={createGoal.isPending || updateGoal.isPending}
                    className="flex-1 py-3 rounded-2xl bg-app-accent dark:bg-dark-accent text-app-accent-fg text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {createGoal.isPending || updateGoal.isPending ? "Salvando..." : modal.mode === "create" ? "Criar" : "Salvar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
