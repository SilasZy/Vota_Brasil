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
    const res = await axios.get(`http://localhost:8080/api/deputados`);
    if (!res.data || !res.data.data) throw new Error('Nenhum dado retornado');
    
  return res.data;
  } catch (error) {
    console.error(error, 'erro ao buscar deputados');
    throw error;
  }
}


export async function getCountDeputados() {
  try {
    const res = await axios.get(`http://localhost:8080/api/deputados/count`);
    if (!res.data || !res.data.data) throw new Error('Nenhum número de deputados retornado');
    return res.data.data; 
  } catch (error) {
    console.error(error, 'erro ao buscar deputados');
    throw error;
  }
  
}








