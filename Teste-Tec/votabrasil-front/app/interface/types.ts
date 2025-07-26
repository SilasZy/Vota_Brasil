 export interface Deputado {
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


  export interface Despesa {
  id: number;
  deputado_id: number;
  tipo: string;
  data: string; // Ex: "2025-02-05"
  valor: number; // Embora a API envie como string, converta para number ao setar no estado
  fornecedor: string;
  cnpj_cpf: string;
  descricao: string;
  ano: number;
  mes: number;
  url_documento: string;
  cod_documento: string;
  cod_lote: string;
  created_at: string; // ISO format
  updated_at: string; // ISO format
  id_legislatura: number;
}