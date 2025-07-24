import axios from "axios";

// apis/deputados.ts
// export async function getDeputados(page = 1, nome?: string, partido?: string, estado?: string) {
//   const params = new URLSearchParams();
//   params.append("page", page.toString());
//   if (nome) params.append("nome", nome);
//   if (partido) params.append("partido", partido);
//   if (estado) params.append("estado", estado);

//   const res = await axios.get(`http://localhost:8080/deputados/pesquisar?${params.toString()}`);
//   return res.data;
// }


export async function getDeputados() {
  try {
    const res = await axios.get(`http://localhost:8080/deputados`);
    if (!res.data || !res.data.data) throw new Error('Nenhum dado retornado');
    
  return res.data;
  } catch (error) {
    console.error(error, 'erro ao buscar deputados');
    throw error;
  }
}


export async function getCountDeputados() {
  try {
    const res = await axios.get(`http://localhost:8080/deputados/count`);
    if (!res.data || !res.data.data) throw new Error('Nenhum número de deputados retornado');
    return res.data.data; 
  } catch (error) {
    console.error(error, 'erro ao buscar deputados');
    throw error;
  }
  
}

export async function getDeputado(id: number) {
  try {
    const res = await axios.get(`http://localhost:8080/deputados/${id}`);
    if (!res.data || !res.data.data) throw new Error('Nenhum dado retornado');
    return res.data.data; 
  } catch (error) {
    console.error(error, 'erro ao buscar deputados');
    throw error;
  }
}

//aqui posso procurar por nome ou partido ou estado
export async function searchDeputados(nome?: string, partido?: string, estado?: string) {
  try {
    const params = new URLSearchParams();
    if (nome) params.append("nome", nome);
    if (partido) params.append("partido", partido);
    if (estado) params.append("estado", estado);

    const url = `http://localhost:8080/deputados/pesquisar?${params.toString()}`;
    const res = await axios.get(url);

    if (!res.data || res.data.length === 0) {
      throw new Error("Nenhum deputado encontrado");
    }

    return res.data; 
  } catch (error) {
    console.error("Erro ao buscar deputados:", error);
    throw error;
  }
  
}



