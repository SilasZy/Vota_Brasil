
'use client';
import { getDeputados } from "@/app/apis/deputados";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "./pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";





type deputadosTableProps = {
    deputados: Deputados[]
};






export default function DeputadosTable({ deputados}: deputadosTableProps) {
    const [depList, setDeputados] = useState<Deputados[]>(deputados);
const [page, setPage] = useState(1);
const [lastPage, setLastPage] = useState(1);

     

async function fetchDeputados(page = 1) {
  try {
    const data = await getDeputados(page);

    setDeputados(data.data); 
    setPage(data.current_page); 
    setLastPage(data.last_page); 
  } catch (error) {
    console.error("Erro ao buscar deputados", error);
    setDeputados([]);
  }
}

    useEffect(() => {
        fetchDeputados(page);
    }, [page]);


    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                        <table className="min-w-full text-left text-sm font-light">
                            <thead className="border-b font-medium dark:border-neutral-500">
                                <tr>
                                       <th scope="col" className="px-6 py-4">Foto</th>
                                    <th scope="col" className="px-6 py-4">Nome</th>
                                    <th scope="col" className="px-6 py-4">Partido</th>
                                    <th scope="col" className="px-6 py-4">Estado</th>
                                      <th scope="col" className="px-6 py-4">Ações</th>
                                  
                                </tr>
                            </thead>
                         <tbody>
  {depList.map((deputado) => (
    <tr className="border-b dark:border-neutral-500" key={deputado.id}>
      <td className="whitespace-nowrap px-6 py-4 font-medium">
        <Image
          src={deputado.urlFoto}
          alt={deputado.nome}
          width={40}
          height={40}
          className="rounded-full"
        />
      </td>
      <td className="whitespace-nowrap px-6 py-4 font-medium">{deputado.nome}</td>
      <td className="whitespace-nowrap px-6 py-4">{deputado.siglaPartido}</td>
      <td className="whitespace-nowrap px-6 py-4">{deputado.siglaUf}</td>
   <Button className="mt-5">Detalhes</Button>
    </tr>
  ))}
</tbody>
                        </table>
                        
                    </div>

                    
                </div>
               
        


<Pagination>

  <PaginationContent className=" flex justify-start items-end md:justify-end">

    <PaginationItem>
      <PaginationLink
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        size="icon"
        className={page === 1 ? "pointer-events-none opacity-50" : ""}
        aria-disabled={page === 1}
      >
        <ChevronLeftIcon className="size-4" />
      </PaginationLink>
    </PaginationItem>

     <span className="px-4 py-2 text-sm font-medium">
      Página {page} de {lastPage}
    </span>

    <PaginationItem>
      <PaginationLink
        onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
        size="icon"
        className={page === lastPage ? "pointer-events-none opacity-50" : ""}
        aria-disabled={page === lastPage}
      >
        <ChevronRightIcon className="size-4" />
      </PaginationLink>
    </PaginationItem>

  </PaginationContent>
</Pagination>

            </div>
        </div>
    );
}