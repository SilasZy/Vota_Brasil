"use client";
import { useEffect, useState } from "react";
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
import Header from "../components/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";




export default function Dashboard() {
  const [deputados, setDeputados] = useState<Deputado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartido, setSelectedPartido] = useState<string>("all");
  const [selectedUf, setSelectedUf] = useState<string>("all");
  const [allPartidos, setAllPartidos] = useState<string[]>([]);
  const [allUfs, setAllUfs] = useState<string[]>([]);

  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const [partidosRes, ufsRes] = await Promise.all([
          axios.get("http://localhost:8080/api/deputados/partidos"),
          axios.get("http://localhost:8080/api/deputados/ufs")
        ]);
        
        if (partidosRes.data.success) {
          setAllPartidos(partidosRes.data.data);
        }
        if (ufsRes.data.success) {
          setAllUfs(ufsRes.data.data);
        }
      } catch (error) {
        console.error("Erro ao buscar opções:", error);
      }
    }
    
    fetchFilterOptions();
  }, []);

  
  useEffect(() => {
    async function fetchDeputados() {
      try {
        setLoading(true);
        let response;
        let params: any = {
          page: currentPage,
          per_page: 10
        };

        if (searchTerm.trim() !== "") {
          params.nome = searchTerm.trim();
        }
        if (selectedPartido !== "all") {
          params.partido = selectedPartido;
        }
        if (selectedUf !== "all") {
          params.uf = selectedUf;
        }

        response = await axios.get("http://localhost:8080/api/deputados/pesquisar", {
          params: params
        });

        if (response.data.success) {
          setDeputados(response.data.data);
          setTotalPages(response.data.meta?.last_page || 1);
        } else {
          throw new Error("Formato de dados inválido");
        }
      } catch (error) {
        console.error("Erro ao buscar deputados:", error);
        setError("Não foi possível carregar os deputados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }

    fetchDeputados();
  }, [currentPage, searchTerm, selectedPartido, selectedUf]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePartidoChange = (value: string) => {
    setSelectedPartido(value);
    setCurrentPage(1);
  };

  const handleUfChange = (value: string) => {
    setSelectedUf(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedPartido("all");
    setSelectedUf("all");
    setCurrentPage(1);
  };

const handleDetailsClick = async (deputadoId: number) => {
  try {
    const response = await axios.post("http://localhost:8080/api/deputados/trigger-expenses", {
      deputado_id: deputadoId
    });
    
    if (response.data.success) {
      // You can add a toast notification here if you want
      console.log(`Expenses job triggered for deputy ${deputadoId}`);
    } else {
      console.error("Failed to trigger expenses job:", response.data.message);
    }
  } catch (error) {
    console.error("Error triggering expenses job:", error);
  }
};


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

{error && (
    <div className="text-red-500 text-center mt-4">
      <p>{error}</p>
    </div>
  )}
  return (
    <div className="space-y-4">
      <Header />
      
      
      <div className="w-full max-w-6xl mx-auto px-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            type="text"
            placeholder="Pesquisar por nome, partido ou sigla..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full md:w-1/3"
          />
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3">
            <Select onValueChange={handlePartidoChange} value={selectedPartido}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por partido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os partidos</SelectItem>
                {allPartidos.map((partido) => (
                  <SelectItem key={partido} value={partido}>
                    {partido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={handleUfChange} value={selectedUf}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                {allUfs.map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="whitespace-nowrap"
            >
              Limpar filtros
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="overflow-x-auto px-4">
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
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deputados.length > 0 ? (
                  deputados.map((deputado) => (
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
                        <Button 
  variant="outline" 
  size="sm"
  onClick={() => handleDetailsClick(deputado.id)}
>
  Detalhes
</Button>
                        <a href={deputado.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            Ver XML
                          </Button>
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm || selectedPartido !== "all" || selectedUf !== "all" 
                        ? "Nenhum deputado encontrado com os filtros aplicados" 
                        : "Nenhum deputado encontrado"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {deputados.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center pb-4">
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
                          className="cursor-pointer"
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