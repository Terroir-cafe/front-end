import apiClient from "./config";

async function getProdutosApi(page=1, search=''){
    const { data } = await apiClient.get(`/produtos/?page=${page}&search=${search}`);
    return data;
}    
export default getProdutosApi;