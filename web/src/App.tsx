import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-slate-900">
          MyCash 💸
        </h1>
        <p className="text-slate-500">
          O Front-end está vivo e respirando!
        </p>
        
        {/* Olha o nosso botão elegante do shadcn aqui! */}
        <Button onClick={() => alert("Arquitetura de sucesso!")}>
          Testar Componente
        </Button>
      </div>
    </div>
  )
}

export default App