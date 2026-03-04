import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

type Props = {
  month: number
  year: number
  onChange: (month: number, year: number) => void
}

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
const monthShort = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

export default function MonthYearPicker({ month, year, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewYear, setViewYear] = useState(year)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  function handleSelect(m: number) {
    onChange(m, viewYear)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 h-10 px-4 bg-white dark:bg-slate-800 rounded-2xl text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-colors shadow-sm cursor-pointer"
      >
        <Calendar className="h-4 w-4 text-slate-400" />
        {monthShort[month - 1]} {year}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-xl p-4 w-72">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setViewYear((y) => y - 1)}
              className="h-8 w-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer text-slate-500 dark:text-slate-300"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-sm font-black text-slate-900 dark:text-white">{viewYear}</span>
            <button
              onClick={() => setViewYear((y) => y + 1)}
              className="h-8 w-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer text-slate-500 dark:text-slate-300"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {monthNames.map((name, i) => {
              const isSelected = i + 1 === month && viewYear === year
              return (
                <button
                  key={name}
                  onClick={() => handleSelect(i + 1)}
                  className={`py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {monthShort[i]}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}