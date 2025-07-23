

import { Button } from "@/components/ui/button";
import DeputadosTable from "@/components/ui/deputadosTable";
import Header from "@/components/ui/header"


export  default function dashboard () {
    return (
        <div>
          <main>
            <Header/>
            <div>

          
        <section className="bg-[#f1fafa] p-4">
      <h1 className="text-2xl font-bold text-black">
        Visão Geral dos Deputados
      </h1>
      <p className="text-gray-600 text-sm mt-1">
        Pesquise, filtre e explore informações sobre os deputados federais do Brasil.
      </p>
    </section>
    <div className="flex justify-end">
   <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Novo Deputado</Button>
    </div>
 
      </div>

 <DeputadosTable deputados={[]} />
        </main>
        </div>
    );
}