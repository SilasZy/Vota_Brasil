
'use client';
import { useEffect, useState } from "react";
import { getCountDeputados } from "../apis/deputados";

export default function Header() {
const [count, setCount] = useState(0);


    async function getCount() {
   try {
    const res = await getCountDeputados();
   setCount(res);
   } catch (error) {
    console.error(error, 'erro ao buscar Countagem de  Deputados');
    throw error;
   }

}
useEffect(() => {
  getCount();
}, []);

  return (
    <header className="bg-[#f3fafa] border-b border-gray-200 p-4">
      <div className="gap-2">
        <span className="text-teal-700 text-sm font-semibold flex items-center gap-2">
          <ShieldIcon className="w-5 h-5" />
          Deputados Insights
        </span>
      </div>
  

      <div className="mt-5">
        <h1 className="text-xl font-bold text-gray-900">
          Visão Geral dos Deputados
        </h1>
        <p className="text-sm text-gray-600">
          Pesquise, filtre e explore informações sobre os deputados federais do Brasil.
        </p>
        <div className="flex justify-end">
          <p className="text-sm text-gray-600">
            Total de Deputados: {count}
          </p>
        </div>
      </div>
    </header>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 3L4 6v6c0 5.25 3.25 9.75 8 11 4.75-1.25 8-5.75 8-11V6l-8-3z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
