import axios from "axios";

// apis/deputados.ts
export async function getDeputados(page: number = 1) {
  try {
    const res = await axios.get(`http://localhost:8080/deputados/listar?page=${page}`);
    if (!res.data || !res.data.data) throw new Error('Nenhum dado retornado');
    
    return res.data.data; // aqui vem: data, current_page, last_page, etc.
  } catch (error) {
    console.error(error, 'erro ao buscar deputados');
    throw error;
  }
}
