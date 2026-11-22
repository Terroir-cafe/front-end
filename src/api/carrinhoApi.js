import apiClient from './config';

// Lê o carrinho em aberto do usuário logado (GET /compras/carrinho/)
async function getCarrinhoApi() {
    const { data } = await apiClient.get('/compras/carrinho/');
    return data;
}

// Adiciona um produto ao carrinho (POST /compras/).
// Se o produto já estiver no carrinho, o back-end soma a quantidade.
async function adicionarItemApi(produtoId, quantidade = 1) {
    const { data } = await apiClient.post('/compras/', {
        itens: [{ produto: produtoId, quantidade }],
    });
    return data;
}

// Substitui todos os itens do carrinho (PATCH /compras/:id/).
// Usado para mudar quantidade e remover itens. Lista vazia = carrinho vazio.
async function substituirItensApi(compraId, itens) {
    const { data } = await apiClient.patch(`/compras/${compraId}/`, { itens });
    return data;
}

// Finaliza a compra (POST /compras/:id/finalizar/): o back-end confere o
// estoque, dá baixa nos produtos e muda o status para FINALIZADO.
async function finalizarCompraApi(compraId) {
    const { data } = await apiClient.post(`/compras/${compraId}/finalizar/`);
    return data;
}

export { getCarrinhoApi, adicionarItemApi, substituirItensApi, finalizarCompraApi };
