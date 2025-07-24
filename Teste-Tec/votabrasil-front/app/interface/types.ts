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
