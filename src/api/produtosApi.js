import apiClient from "./config";

async function getProdutosApi(page=1, search='', ordering='', marca='', categoria=''){
    const { data } = await apiClient.get('/produtos/', {
        params: { page, search, ordering, marca__nome: marca, categoria__nome: categoria },
    });
    return data;
}    

async function getProdutoByIdApi(id){
    const { data } = await apiClient.get(`/produtos/${id}/`);
    return data;
}
export { getProdutosApi, getProdutoByIdApi };