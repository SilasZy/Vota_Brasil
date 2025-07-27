"use client";



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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; 
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { FileSearch, FileText } from "lucide-react";
import { useDeputados } from "../apis/deputados";


export default function Dashboard() {
   const {
    deputados,
    loading,
    error,
    currentPage,
    totalPages,
    searchTerm,
    selectedPartido,
    selectedUf,
    allPartidos,
    allUfs,
    despesas,
    selectedDeputado,
    loadingDespesas,
    isModalOpen,
    setCurrentPage,
    handleSearch,
    handlePartidoChange,
    handleUfChange,
    resetFilters,
    handleDetailsClick,
    closeModal,
    formatDate,
    formatCurrency
  } = useDeputados();


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

      {error && (
        <div className="text-red-500 text-center mt-4">
          <p>{error}</p>
        </div>
      )}

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
                  <th scope="col" className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gerenciar
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
  className="ml-2 cursor-pointer"
  variant="outline" 
  size="sm"
  onClick={() => handleDetailsClick(deputado.id)}
  disabled={loadingDespesas}
>
  {loadingDespesas && selectedDeputado?.id === deputado.id ? (
    "Carregando..."
  ) : (
    <>
      <FaFileInvoiceDollar className="w-4 h-4 mr-2" />
      Despesas
    </>
  )}
</Button>
                        

                        


                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm || selectedPartido !== "all" || selectedUf !== "all" 
                        ? "Nenhum deputado encontrado com os filtros aplicados" 
                        : "Nenhum deputado encontrado"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {loading && (
            <div className="flex justify-center py-4">
              <Skeleton className="h-10 w-64" />
            </div>
          )}
 <Dialog open={isModalOpen} onOpenChange={closeModal}>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <Image
            src={selectedDeputado?.urlFoto || "/placeholder.png"}
            alt={selectedDeputado?.nome || "Deputado"}
            fill
            className="rounded-full object-cover border-2 border-primary"
            unoptimized
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{selectedDeputado?.nome}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {selectedDeputado?.siglaPartido}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
              {selectedDeputado?.siglaUf}
            </span>
          </div>
        </div>
      </DialogTitle>
    </DialogHeader>

    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Despesas</h3>
        {despesas.length > 0 && !loadingDespesas && (
          <span className="text-sm text-gray-500">
            Total: {despesas.length} registros
          </span>
        )}
      </div>
      
      {loadingDespesas ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : despesas.length > 0 ? (
        <div className="space-y-4">
          {despesas.map((despesa) => (
            <div key={despesa.id} className="border rounded-lg p-5 hover:shadow-sm transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tipo</p>
                    <p className="font-medium">{despesa.tipo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fornecedor</p>
                    <p>{despesa.fornecedor || "Não informado"}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data</p>
                    <p>{formatDate(despesa.data)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">CNPJ/CPF</p>
                    <p>{despesa.cnpj_cpf || "Não informado"}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Valor</p>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(despesa.valor )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Período</p>
                    <p>{despesa.ano}/{despesa.mes.toString().padStart(2, '0')}</p>
                  </div>
                </div>
              </div>
              
              {despesa.url_documento && (
                <div className="mt-4 pt-4 border-t">
                  <a 
                    href={despesa.url_documento} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Acessar documento comprobatório
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <FileSearch className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Nenhuma despesa encontrada</p>
          <p className="text-gray-400 text-sm mt-1">
            Não há registros de despesas para este deputado no período
          </p>
        </div>
      )}
    </div>
  </DialogContent>
</Dialog>

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




