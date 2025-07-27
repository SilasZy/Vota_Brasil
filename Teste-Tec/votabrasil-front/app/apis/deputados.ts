import { useState, useEffect } from "react";
import axios from "axios";
import { Deputado, Despesa } from "../interface/types";

export function useDeputados() {
  // Estados para deputados e paginação
  const [deputados, setDeputados] = useState<Deputado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para filtros
  const [selectedPartido, setSelectedPartido] = useState<string>("all");
  const [selectedUf, setSelectedUf] = useState<string>("all");
  const [allPartidos, setAllPartidos] = useState<string[]>([]);
  const [allUfs, setAllUfs] = useState<string[]>([]);

  // Estados para despesas
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [selectedDeputado, setSelectedDeputado] = useState<Deputado | null>(null);
  const [loadingDespesas, setLoadingDespesas] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Buscar opções de filtro
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

  // Buscar deputados com base nos filtros
  useEffect(() => {
    async function fetchDeputados() {
      try {
        setLoading(true);
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

        const response = await axios.get("http://localhost:8080/api/deputados/pesquisar", {
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

  // Buscar despesas de um deputado
  const handleDetailsClick = async (deputadoId: number) => {
    const deputado = deputados.find(dep => dep.id === deputadoId);
    if (!deputado) return;

    try {
      setLoadingDespesas(true);
      setSelectedDeputado(deputado);

      const processResponse = await axios.post("http://localhost:8080/api/despesas/processar", {
        deputado_id: deputadoId
      });

      if (processResponse.data.success) {
        const despesasResponse = await axios.get(`http://localhost:8080/api/despesas/deputado/${deputadoId}`);

        if (despesasResponse.data.success) {
          setDespesas(despesasResponse.data.data);
          setIsModalOpen(true);
        } else {
          throw new Error("Falha ao buscar despesas");
        }
      } else {
        throw new Error("Falha ao processar despesas");
      }
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
      setError("Não foi possível carregar as despesas do deputado.");
    } finally {
      setLoadingDespesas(false);
    }
  };

  // Fechar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDeputado(null);
    setDespesas([]);
  };

  // Manipuladores de filtros
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

  // Funções de formatação
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return {
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
  };
}