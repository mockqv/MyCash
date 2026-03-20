import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  Sparkles,
  Tag,
} from "lucide-react";
import PageLayout from "../components/PageLayout";
import { usePageTitle } from "../hooks/usePageTitle";
import {
  useCustomCategories,
  useCreateCustomCategory,
  useUpdateCustomCategory,
  useDeleteCustomCategory,
} from "../hooks/useCustomCategories";
import type { CustomCategory } from "../types/customCategory";
import { ICON_MAP, AVAILABLE_ICON_NAMES, getIconComponent, AVAILABLE_COLORS } from "../utils/icons";

const TYPE_OPTIONS = [
  { label: "Receita", value: 0 },
  { label: "Despesa", value: 1 },
  { label: "Ambos", value: 2 },
];

type FormState = {
  name: string;
  color: string;
  icon: string;
  type: number;
};
const emptyForm: FormState = { name: "", color: "#3b82f6", icon: "Tag", type: 2 };

export default function Customize() {
  usePageTitle("Personalizar");

  const { data: categories = [], isLoading } = useCustomCategories();
  const createMutation = useCreateCustomCategory();
  const updateMutation = useUpdateCustomCategory();
  const deleteMutation = useDeleteCustomCategory();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<CustomCategory | null>(null);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function openEdit(cat: CustomCategory) {
    setEditingId(cat.id);
    setForm({ name: cat.name, color: cat.color, icon: cat.icon, type: cat.type });
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, ...form });
    } else {
      await createMutation.mutateAsync(form);
    }
    closeForm();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  }

  function getTypeLabel(type: number) {
    return TYPE_OPTIONS.find((t) => t.value === type)?.label ?? "Ambos";
  }

  return (
    <>
      <PageLayout
        title="Personalizar"
        subtitle="Customize categorias e preferências da sua conta."
        actions={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 h-10 px-5 rounded-2xl bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg text-sm font-semibold transition-opacity hover:opacity-80 cursor-pointer"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Nova Categoria</span>
            <span className="sm:hidden">Nova</span>
          </button>
        }
      >
        <div className="space-y-8">
          {/* Categorias section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-app-accent dark:text-dark-accent" />
              <span className="text-sm font-bold text-app-text dark:text-dark-text tracking-tight uppercase">
                Categorias Personalizadas
              </span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-app-card dark:bg-dark-card rounded-2xl border border-app-border dark:border-dark-border p-5 animate-pulse"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-app-elevated dark:bg-dark-elevated" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 w-24 bg-app-elevated dark:bg-dark-elevated rounded-lg" />
                        <div className="h-2 w-16 bg-app-elevated dark:bg-dark-elevated rounded-lg" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="bg-app-card dark:bg-dark-card rounded-3xl border border-dashed border-app-border dark:border-dark-border p-8 sm:p-12 flex flex-col items-center justify-center gap-3">
                <Tag className="h-10 w-10 text-app-muted dark:text-dark-muted opacity-50" />
                <p className="text-[15px] font-semibold text-app-text dark:text-dark-text text-center">
                  Nenhuma categoria criada ainda
                </p>
                <p className="text-sm text-app-muted dark:text-dark-muted text-center">
                  Crie categorias para organizar melhor suas transações.
                </p>
                <button
                  onClick={openCreate}
                  className="mt-3 text-sm font-bold text-app-accent dark:text-dark-accent bg-app-accent/5 px-5 py-2.5 rounded-xl hover:bg-app-accent/10 transition-colors cursor-pointer"
                >
                  Criar minha primeira
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const IconComp = getIconComponent(cat.icon);
                  return (
                    <div
                      key={cat.id}
                      className="bg-app-card dark:bg-dark-card rounded-2xl border border-app-border dark:border-dark-border p-4 sm:p-5 hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div
                            className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${cat.color}18` }}
                          >
                            <IconComp
                              className="h-5 w-5"
                              style={{ color: cat.color }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[15px] font-bold text-app-text dark:text-dark-text leading-tight truncate">
                              {cat.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: cat.color }}
                              />
                              <span className="text-xs font-medium text-app-muted dark:text-dark-muted truncate">
                                {getTypeLabel(cat.type)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => openEdit(cat)}
                            className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-app-elevated dark:hover:bg-dark-elevated text-app-muted hover:text-app-text transition-colors cursor-pointer"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(cat)}
                            className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-red-500/10 text-app-muted hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Future features placeholder */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-app-accent dark:text-dark-accent" />
              <span className="text-sm font-bold text-app-text dark:text-dark-text tracking-tight uppercase">
                Mais Personalizações
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-app-elevated dark:bg-dark-elevated text-app-muted dark:text-dark-muted ml-1 border border-app-border dark:border-dark-border">
                Breve
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Metas Financeiras", desc: "Defina objetivos e acompanhe a evolução" },
                { title: "Notificações", desc: "Alertas personalizados sobre vencimentos" },
                { title: "Exportar Dados", desc: "Gere relatórios em PDF ou Excel" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-app-card to-app-hover dark:from-dark-card dark:to-dark-hover rounded-2xl border border-app-border dark:border-dark-border p-5 opacity-60 hover:opacity-80 transition-opacity"
                >
                  <p className="text-[15px] font-bold text-app-text dark:text-dark-text">
                    {item.title}
                  </p>
                  <p className="text-sm text-app-muted dark:text-dark-muted mt-1">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeForm}
          />
          <div className="relative bg-app-card dark:bg-dark-card rounded-3xl border border-app-border dark:border-dark-border shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-app-border dark:border-dark-border shrink-0">
              <h3 className="text-lg font-black text-app-text dark:text-dark-text tracking-tight">
                {editingId ? "Editar Categoria" : "Nova Categoria"}
              </h3>
              <button
                onClick={closeForm}
                className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-app-elevated dark:hover:bg-dark-elevated text-app-muted transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Name input */}
              <div>
                <label className="block text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ex: Educação, Pet, Investimentos..."
                  maxLength={50}
                  className="w-full h-12 px-4 rounded-2xl bg-app-elevated dark:bg-dark-elevated border border-app-border dark:border-dark-border text-app-text dark:text-dark-text text-sm font-medium placeholder:text-app-faint dark:placeholder:text-dark-faint outline-none focus:border-app-accent dark:focus:border-dark-accent transition-colors"
                />
              </div>

              {/* Type selector */}
              <div>
                <label className="block text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-2">
                  Tipo de Transação
                </label>
                <div className="flex gap-2 p-1 bg-app-elevated dark:bg-dark-elevated rounded-2xl">
                  {TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: opt.value })}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        form.type === opt.value
                          ? opt.value === 0
                            ? "bg-green-500 text-white shadow-sm"
                            : opt.value === 1
                              ? "bg-red-500 text-white shadow-sm"
                              : "bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg shadow-sm"
                          : "text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-2">
                  Cor
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm({ ...form, color })}
                      className={`h-9 w-9 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                        form.color === color
                          ? "ring-2 ring-offset-2 ring-offset-app-card dark:ring-offset-dark-card scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{
                        backgroundColor: color,
                        ...(form.color === color
                          ? { ringColor: color }
                          : {}),
                      }}
                    >
                      {form.color === color && (
                        <Check size={14} className="text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon picker */}
              <div>
                <label className="block text-xs font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-2">
                  Ícone
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {AVAILABLE_ICON_NAMES.map((name) => {
                    const Icon = ICON_MAP[name];
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setForm({ ...form, icon: name })}
                        className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          form.icon === name
                            ? "bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg shadow-md scale-110"
                            : "bg-app-elevated dark:bg-dark-elevated text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text hover:bg-app-hover dark:hover:bg-dark-hover"
                        }`}
                      >
                        <Icon size={18} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-app-elevated dark:bg-dark-elevated rounded-2xl p-4 flex items-center gap-4">
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${form.color}18` }}
                >
                  {(() => {
                    const PreviewIcon = getIconComponent(form.icon);
                    return (
                      <PreviewIcon
                        className="h-5 w-5"
                        style={{ color: form.color }}
                      />
                    );
                  })()}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-app-text dark:text-dark-text truncate">
                    {form.name || "Nome da categoria"}
                  </p>
                  <p className="text-xs text-app-muted dark:text-dark-muted mt-0.5">
                    {getTypeLabel(form.type)} · Preview
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-app-border dark:border-dark-border flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={closeForm}
                className="h-10 px-5 rounded-2xl text-sm font-semibold text-app-muted hover:text-app-text transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || isSaving}
                className="flex items-center gap-2 h-10 px-6 rounded-2xl bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg text-sm font-semibold transition-opacity hover:opacity-80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                {editingId ? "Salvar" : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-app-card dark:bg-dark-card rounded-3xl border border-app-border dark:border-dark-border shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-black text-app-text dark:text-dark-text">
                Excluir categoria?
              </h3>
              <p className="text-sm text-app-muted dark:text-dark-muted">
                A categoria <strong>"{deleteTarget.name}"</strong> será
                removida permanentemente.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-app-border dark:border-dark-border flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="h-10 px-5 rounded-2xl text-sm font-semibold text-app-muted hover:text-app-text transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 h-10 px-6 rounded-2xl bg-red-500 text-white text-sm font-semibold transition-opacity hover:opacity-80 cursor-pointer disabled:opacity-40"
              >
                {deleteMutation.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
