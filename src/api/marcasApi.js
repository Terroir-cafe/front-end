import apiClient from "./config";

async function getMarcasApi(){
    const { data } = await apiClient.get(`/marcas/`);
    return data;
}

export default getMarcasApi;