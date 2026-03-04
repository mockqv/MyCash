import { CheckCircle2, XCircle } from "lucide-react";

type Toast = {
  id: number;
  message: string;
  type: "success" | "error";
};

type Props = {
  toasts: Toast[];
};

export default function ToastContainer({ toasts }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg bg-app-card dark:bg-dark-card border border-app-border dark:border-dark-border text-sm font-medium text-app-text dark:text-dark-text animate-fade-in"
          style={{ minWidth: "260px" }}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
          ) : (
            <XCircle size={18} className="text-red-500 shrink-0" />
          )}
          {toast.message}
        </div>
      ))}
    </div>
  );
}
