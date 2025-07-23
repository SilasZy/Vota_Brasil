
import Link from "next/link"

export default function Inicial() {
  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
  
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      <div className="relative z-10 flex flex-col gap-8 p-12 rounded-3xl bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 max-w-lg w-full mx-4 shadow-2xl">
      
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent mb-3">
            Vota Brasil
          </h1>
          <p className="text-gray-300 text-lg">
            Acompanhe a atuação dos deputados federais
          </p>
        </div>

   
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="flex items-center gap-3 text-gray-300">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span>Dados atualizados em tempo real</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span>Análise de votação e projetos</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Transparência política completa</span>
          </div>
        </div>

   
        <div className="flex flex-col gap-4">
          <Link href="/routes/dashboard" className="w-full">
            <button className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Ver Deputados
            </button>
          </Link>

        
        </div>

   
        <div className="text-center text-sm text-gray-400">
          <p>Dados oficiais da Câmara dos Deputados do Brasil</p>
        </div>
      </div>

   
      <div className="absolute top-20 left-20 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
    </div>
  )
}