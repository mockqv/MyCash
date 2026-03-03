import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  LayoutGrid,
  Receipt,
  Settings,
  LogOut,
  EyeOff,
  Eye,
  Calendar,
} from "lucide-react";

export function Dashboard() {
  const [isPrivacyMode, setIsPrivacyMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const maskValue = (value: string) => (isPrivacyMode ? "••••" : value);

  return (
    <div className="flex min-h-screen w-full bg-linen text-slate-900 font-sans">
      {/* Sidebar */}
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
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-spruce/10 text-spruce rounded-2xl font-semibold transition-colors cursor-pointer">
            <LayoutGrid className="h-5 w-5" />
            Visão Geral
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-spruce-dark hover:bg-slate-50 rounded-2xl font-medium transition-colors cursor-pointer">
            <Receipt className="h-5 w-5" />
            Transações
          </button>
        </nav>

        <div className="p-4 pt-0 space-y-1 mb-2 border-t border-slate-100 mx-4 mt-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-spruce-dark hover:bg-slate-50 rounded-2xl font-medium transition-colors cursor-pointer mt-2">
            <Settings className="h-5 w-5" />
            Ajustes
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500/80 hover:text-red-600 hover:bg-red-50 rounded-2xl font-medium transition-colors cursor-pointer">
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-24 px-8 lg:px-12 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-spruce-dark">
              Painel de Controle
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Acompanhe suas finanças deste mês.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 h-10 px-4 bg-white rounded-full text-sm font-medium text-slate-600 border border-slate-200 hover:border-spruce/30 transition-colors shadow-sm mr-2 cursor-pointer">
              <Calendar className="h-4 w-4 text-spruce" />
              01 Mar - 31 Mar, 2026
            </button>

            <button
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              className={`h-10 w-10 rounded-full flex items-center justify-center border shadow-sm transition-colors cursor-pointer ${isPrivacyMode ? "bg-spruce/10 border-spruce text-spruce" : "bg-white border-slate-200 text-slate-400 hover:text-spruce"}`}
              title={isPrivacyMode ? "Mostrar valores" : "Ocultar valores"}
            >
              {isPrivacyMode ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>

            <div
              className="h-10 w-10 rounded-full bg-spruce text-white flex items-center justify-center font-bold border-2 border-white shadow-sm cursor-pointer ml-1 hover:bg-spruce-dark transition-colors"
              title="Menu do Perfil"
            >
              US
            </div>
          </div>
        </header>

        {/* Área de Conteúdo Central */}
        <div className="p-8 lg:p-12 pt-0 w-full max-w-[1400px] mx-auto">
          {/* 3 KPIs Principais */}
          <div className="grid gap-6 sm:grid-cols-3 mb-8">
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  Entradas
                </span>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div>
                {isLoading ? (
                  <div className="h-9 w-32 bg-slate-200/70 animate-pulse rounded-md"></div>
                ) : (
                  <h3 className="text-3xl font-bold text-slate-900">
                    {maskValue("R$ 4.500,00")}
                  </h3>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  Saídas
                </span>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                </div>
              </div>
              <div>
                {isLoading ? (
                  <div className="h-9 w-32 bg-slate-200/70 animate-pulse rounded-md"></div>
                ) : (
                  <h3 className="text-3xl font-bold text-slate-900">
                    {maskValue("R$ 2.150,00")}
                  </h3>
                )}
              </div>
            </div>

            <div className="bg-spruce rounded-[24px] p-6 shadow-md flex flex-col justify-between text-white relative overflow-hidden h-40">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-sm font-semibold text-linen/90">
                  Saldo Atual
                </span>
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="relative z-10">
                {isLoading ? (
                  <div className="h-9 w-32 bg-white/20 animate-pulse rounded-md"></div>
                ) : (
                  <h3 className="text-3xl font-bold">
                    {maskValue("R$ 2.350,00")}
                  </h3>
                )}
              </div>
            </div>
          </div>

          {/* Tabela de Transações */}
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden min-h-[300px]">
            <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-xl font-bold text-spruce-dark">
                Últimas Transações
              </h2>
              <button className="text-sm font-semibold text-spruce hover:text-spruce-dark transition-colors px-4 py-2 bg-spruce/5 rounded-xl cursor-pointer">
                Ver todas
              </button>
            </div>

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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-slate-50 cursor-default"
                      >
                        <TableCell className="px-4 py-5">
                          <div className="h-4 w-3/4 bg-slate-200/70 animate-pulse rounded"></div>
                        </TableCell>
                        <TableCell className="px-4 py-5">
                          <div className="h-6 w-20 bg-slate-200/70 animate-pulse rounded-full"></div>
                        </TableCell>
                        <TableCell className="px-4 py-5">
                          <div className="h-4 w-24 bg-slate-200/70 animate-pulse rounded"></div>
                        </TableCell>
                        <TableCell className="px-4 py-5 flex justify-end">
                          <div className="h-4 w-24 bg-slate-200/70 animate-pulse rounded"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <>
                      <TableRow className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-bold text-slate-700 px-4 py-4">
                          Salário Desenvolvedor
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <span className="px-3 py-1.5 rounded-full bg-green-100 text-[11px] font-bold text-green-700 uppercase tracking-wider">
                            Renda
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-500 font-medium px-4 py-4">
                          02 Mar 2026
                        </TableCell>
                        <TableCell className="text-right text-green-600 font-bold text-base px-4 py-4">
                          {maskValue("+ R$ 4.500,00")}
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-bold text-slate-700 px-4 py-4">
                          Ifood - Hambúrguer
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                            Alimentação
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-500 font-medium px-4 py-4">
                          01 Mar 2026
                        </TableCell>
                        <TableCell className="text-right text-red-600 font-bold text-base px-4 py-4">
                          {maskValue("- R$ 65,90")}
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-bold text-slate-700 px-4 py-4">
                          Assinatura Netflix
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                            Entretenimento
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-500 font-medium px-4 py-4">
                          01 Mar 2026
                        </TableCell>
                        <TableCell className="text-right text-red-600 font-bold text-base px-4 py-4">
                          {maskValue("- R$ 59,90")}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
