import apiClient from './config';

export default {
    login(email, password){
        return apiClient.post('/token/', {email, password});
    },
    register(email, name, password){
        return apiClient.post('/registro/', {email, name, password});
    },
    getUser(){
        return apiClient.get('/usuarios/me/');
    },
    patchUser(userId, userData){
        return apiClient.patch(`/usuarios/${userId}/`, userData);
    },
    uploadAvatar(file, description = '') {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);
    return apiClient.post('/media/images/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};