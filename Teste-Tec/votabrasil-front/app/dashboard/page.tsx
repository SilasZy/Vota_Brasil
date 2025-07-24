"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface Deputado {
  id: number;
  id_api: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  email: string;
  url: string;
  urlFoto: string;
  uriPartido: string;
  id_legislatura: number | null;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const [deputados, setDeputados] = useState<Deputado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
  async function fetchDeputados() {
    try {
      setLoading(true);
      let response;

   
      if (searchTerm.trim() !== "") {
        response = await axios.get("http://localhost:8080/deputados/pesquisar", {
          params: { nome: searchTerm.trim() }
        });

        console.log("Resultado da pesquisa:", response.data);
        setDeputados(response.data);
        setTotalPages(1); 
      } else {
     
        response = await axios.get("http://localhost:8080/deputados", {
          params: {
            page: currentPage,
            limit: 10
          }
        });

        console.log("Dados da API paginada:", response.data);

        if (response.data && Array.isArray(response.data.data.data)) {
          setDeputados(response.data.data.data);
          setTotalPages(response.data.data.last_page || 1);
        } else {
          throw new Error("Formato de dados inválido");
        }
      }
    } catch (error) {
      console.error("Erro ao buscar deputados:", error);
      setError("Não foi possível carregar os deputados. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  fetchDeputados();
}, [currentPage, searchTerm]);



  const filteredDeputados = useMemo(() => {
    if (!searchTerm) return deputados;
    
    const term = searchTerm.toLowerCase();
    return deputados.filter(deputado => 
      deputado.nome.toLowerCase().includes(term) ||
      deputado.siglaPartido.toLowerCase().includes(term) ||
      (deputado.siglaUf && deputado.siglaUf.toLowerCase().includes(term))
    );
  }, [deputados, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }


  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[...Array(6)].map((_, i) => (
                <th key={i} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Skeleton className="h-4 w-24 bg-black/80" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(2)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {[...Array(6)].map((_, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                    {cellIndex === 0 ? (
                      <Skeleton className="h-10 w-10 rounded-full bg-black/80" />
                    ) : (
                      <Skeleton className="h-4 w-20 bg-black/80" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Input de pesquisa */}
      <div className="w-full max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Pesquisar por nome, partido ou sigla..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full"
        />
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Foto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partido
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeputados.length > 0 ? (
                  filteredDeputados.map((deputado) => (
                    <tr key={deputado.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Image
                            src={deputado.urlFoto}
                            alt={deputado.nome}
                            width={40}
                            height={40}
                            className="rounded-full"
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{deputado.nome}</div>
                        <div className="text-xs text-gray-500">ID: {deputado.id_api}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{deputado.siglaPartido}</div>
                        <a href={deputado.uriPartido} className="text-xs text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                          Ver partido
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{deputado.siglaUf}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href={`mailto:${deputado.email}`} className="text-sm text-blue-500 hover:underline">
                          {deputado.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                        <a href={deputado.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            API
                          </Button>
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm ? "Nenhum deputado encontrado para sua pesquisa" : "Nenhum deputado encontrado"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredDeputados.length > 0 && (
            <div className="flex items-center justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      isActive={currentPage > 1}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <Button
                          variant={currentPage === pageNum ? "default" : "ghost"}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      </PaginationItem>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      isActive={currentPage < totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}