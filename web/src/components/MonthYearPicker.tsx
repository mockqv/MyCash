import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

type Props = {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
};

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const monthShort = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export default function MonthYearPicker({ month, year, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(year);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function handleSelect(m: number) {
    onChange(m, viewYear);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 h-10 px-4 bg-app-card dark:bg-dark-card rounded-2xl text-sm font-medium text-app-muted dark:text-dark-muted border border-app-border dark:border-dark-border hover:border-app-muted dark:hover:border-dark-muted transition-colors shadow-sm cursor-pointer"
      >
        <Calendar className="h-4 w-4 text-app-faint dark:text-dark-faint" />
        {monthShort[month - 1]} {year}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 bg-app-card dark:bg-dark-card border border-app-border dark:border-dark-border rounded-3xl shadow-xl p-4 w-72">
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

          <div className="grid grid-cols-3 gap-2">
            {monthNames.map((name, i) => {
              const isSelected = i + 1 === month && viewYear === year;
              return (
                <button
                  key={name}
                  onClick={() => handleSelect(i + 1)}
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
        </div>
      )}
    </div>
  );
}
