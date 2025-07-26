'use client'
import axios from "axios";

import { useState } from "react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);



async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();

  if (isLoading) return; // Evita múltiplos cliques

  setIsLoading(true);

  try {
    const response = await axios.post('http://localhost:8080/api/deputados/sincronizar');

    if (response.status !== 200) {
      throw new Error('Erro ao disparar a fila de deputados');
    }

    console.log("Sincronização concluída:", response.data);

    // Aguarda só um pouco para UX (ex: mostrar spinner)
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);

  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao sincronizar deputados. Tente novamente.');
    setIsLoading(false); // Permite tentar de novo
  }
}

  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-[#f5f8fa] px-4">
      <div className="flex flex-col gap-8 p-10 rounded-2xl bg-white border border-gray-200 shadow-md max-w-2xl w-full">

        {/* Cabeçalho com ícone */}
        <div className="text-center">
          <div className="mb-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vota Brasil</h1>
          <p className="text-gray-600 text-base">
            Acompanhe a atuação dos deputados federais com transparência.
          </p>
        </div>

        {/* Benefícios */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 text-sm mt-1">Dados atualizados em tempo real</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 text-sm mt-1">Análise de votação e projetos</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600 text-sm mt-1">Transparência política completa</span>
          </div>
        </div>

        {/* Botão */}
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <button 
              onClick={handleClick}
              disabled={isLoading}
              className={`w-full px-6 py-4 rounded-xl ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer`}
            >
              {isLoading ? 'Iniciando...' : 'Ver Deputados'}
            </button>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center text-sm text-gray-400">
          <p>Dados oficiais da Câmara dos Deputados do Brasil</p>
        </div>
      </div>
    </div>
  );
}