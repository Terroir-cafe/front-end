import apiClient from './config'

export async function getCarrinhoApi(opcoes) {
    const { data } = await apiClient.get('/compras/carrinho/', opcoes)
    return data;
}

export async function finalizarCompraApi(compraId, contaEsperada) {
    const { data } = await apiClient.post(`/compras/${compraId}/finalizar/`, null, { contaEsperada });
    return data;
}
