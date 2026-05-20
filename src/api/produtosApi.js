import apiClient from "./config";

const produtosApi = {
    getAll(){
        return apiClient.get('/produtos/')
    },
}

export default produtosApi;