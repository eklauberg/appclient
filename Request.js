import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

import { BASE_API } from './BASE_API';

const apiClient = axios.create({
    baseURL: BASE_API,
});

apiClient.defaults.headers['Content-Type'] = 'application/json';
apiClient.defaults.headers['Accept'] = 'application/json';

apiClient.interceptors.request.use(async (request) => {
    let token = await AsyncStorage.getItem('token');
    //console.log( token );
    if (token) {
        request.headers['Authorization'] = `Bearer ${token}`
    }
    return request;
}, (error) => {
    Promise.reject(error);
});



export default apiClient;
