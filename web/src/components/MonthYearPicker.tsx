import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, CalendarRange } from "lucide-react";

type DateRange = { start: string; end: string };

type Props = {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
  dateRange?: DateRange | null;
  onDateRangeChange?: (range: DateRange | null) => void;
};

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const monthShort = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

type Mode = "month" | "range";

export default function MonthYearPicker({
  month,
  year,
  onChange,
  dateRange,
  onDateRangeChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(year);
  const [mode, setMode] = useState<Mode>(dateRange ? "range" : "month");
  const [rangeStart, setRangeStart] = useState(dateRange?.start ?? "");
  const [rangeEnd, setRangeEnd] = useState(dateRange?.end ?? "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function handleSelectMonth(m: number) {
    setMode("month");
    if (onDateRangeChange) onDateRangeChange(null);
    onChange(m, viewYear);
    setIsOpen(false);
  }

  function handleApplyRange() {
    if (!rangeStart || !rangeEnd) return;
    if (onDateRangeChange) {
      onDateRangeChange({ start: rangeStart, end: rangeEnd });
    }
    setIsOpen(false);
  }

  function handleClearRange() {
    setRangeStart("");
    setRangeEnd("");
    setMode("month");
    if (onDateRangeChange) onDateRangeChange(null);
  }

  function formatRangeLabel() {
    if (!dateRange) return `${monthShort[month - 1]} ${year}`;
    const s = new Date(dateRange.start + "T00:00:00");
    const e = new Date(dateRange.end + "T00:00:00");
    const fmt = (d: Date) =>
      `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    return `${fmt(s)} — ${fmt(e)}`;
  }

  const isRangeActive = !!dateRange;
  const canApply = rangeStart && rangeEnd && rangeStart <= rangeEnd;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 h-10 px-4 bg-app-card dark:bg-dark-card rounded-2xl text-sm font-medium border shadow-sm transition-colors cursor-pointer ${
          isRangeActive
            ? "text-app-accent dark:text-dark-accent border-app-accent/40 dark:border-dark-accent/40"
            : "text-app-muted dark:text-dark-muted border-app-border dark:border-dark-border hover:border-app-muted dark:hover:border-dark-muted"
        }`}
      >
        {isRangeActive ? (
          <CalendarRange className="h-4 w-4" />
        ) : (
          <Calendar className="h-4 w-4 text-app-faint dark:text-dark-faint" />
        )}
        {formatRangeLabel()}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 bg-app-card dark:bg-dark-card border border-app-border dark:border-dark-border rounded-3xl shadow-xl p-4 w-80">
          {/* Mode Toggle */}
          {onDateRangeChange && (
            <div className="flex gap-1 p-1 bg-app-elevated dark:bg-dark-elevated rounded-2xl mb-4">
              <button
                onClick={() => setMode("month")}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  mode === "month"
                    ? "bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg shadow-sm"
                    : "text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text"
                }`}
              >
                Mês
              </button>
              <button
                onClick={() => setMode("range")}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  mode === "range"
                    ? "bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg shadow-sm"
                    : "text-app-muted dark:text-dark-muted hover:text-app-text dark:hover:text-dark-text"
                }`}
              >
                Período
              </button>
            </div>
          )}

          {mode === "month" ? (
            <>
              {/* Year navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setViewYear((y) => y - 1)}
                  className="h-8 w-8 rounded-xl flex items-center justify-center bg-app-elevated dark:bg-dark-elevated hover:bg-app-hover dark:hover:bg-dark-hover transition-colors cursor-pointer text-app-muted dark:text-dark-muted"
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="text-sm font-black text-app-text dark:text-dark-text">
                  {viewYear}
                </span>
                <button
                  onClick={() => setViewYear((y) => y + 1)}
                  className="h-8 w-8 rounded-xl flex items-center justify-center bg-app-elevated dark:bg-dark-elevated hover:bg-app-hover dark:hover:bg-dark-hover transition-colors cursor-pointer text-app-muted dark:text-dark-muted"
                >
                  <ChevronRight size={15} />
                </button>
              </div>

              {/* Month grid */}
              <div className="grid grid-cols-3 gap-2">
                {monthNames.map((name, i) => {
                  const isSelected = i + 1 === month && viewYear === year && !isRangeActive;
                  return (
                    <button
                      key={name}
                      onClick={() => handleSelectMonth(i + 1)}
                      className={`py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg"
                          : "text-app-muted dark:text-dark-muted hover:bg-app-elevated dark:hover:bg-dark-elevated hover:text-app-text dark:hover:text-dark-text"
                      }`}
                    >
                      {monthShort[i]}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Date range inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-1.5">
                    De
                  </label>
                  <input
                    type="date"
                    value={rangeStart}
                    onChange={(e) => setRangeStart(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-app-elevated dark:bg-dark-elevated border border-app-border dark:border-dark-border text-app-text dark:text-dark-text text-sm font-medium outline-none focus:border-app-accent dark:focus:border-dark-accent transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-app-muted dark:text-dark-muted uppercase tracking-widest mb-1.5">
                    Até
                  </label>
                  <input
                    type="date"
                    value={rangeEnd}
                    min={rangeStart}
                    onChange={(e) => setRangeEnd(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-app-elevated dark:bg-dark-elevated border border-app-border dark:border-dark-border text-app-text dark:text-dark-text text-sm font-medium outline-none focus:border-app-accent dark:focus:border-dark-accent transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                {isRangeActive && (
                  <button
                    onClick={handleClearRange}
                    className="flex-1 h-9 rounded-xl text-xs font-semibold text-app-muted hover:text-app-text transition-colors cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
                <button
                  onClick={handleApplyRange}
                  disabled={!canApply}
                  className="flex-1 h-9 rounded-xl text-xs font-semibold bg-app-accent dark:bg-dark-accent text-app-accent-fg dark:text-dark-accent-fg transition-opacity hover:opacity-80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Aplicar
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
