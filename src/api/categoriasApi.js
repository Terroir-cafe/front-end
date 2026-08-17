import apiClient from "./config";

async function getCategoriasApi(){
    const { data } = await apiClient.get(`/categorias/`);
    return data;
}

export default getCategoriasApi;