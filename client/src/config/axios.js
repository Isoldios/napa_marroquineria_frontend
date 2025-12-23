import axios from 'axios';
import { auth } from '../../firebase';

const initAxiosInterceptors = () => {
    // Interceptamos TODAS las peticiones que salen (request)
    axios.interceptors.request.use(async (config) => {
        const user = auth.currentUser;

        // Si hay un usuario logueado en Firebase...
        if (user) {
            try {
                // Obtenemos su token actual (si expiró, Firebase lo renueva solo)
                const token = await user.getIdToken();
                
                // Lo pegamos en la cabecera "Authorization"
                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                console.error("Error obteniendo token:", error);
            }
        }

        return config; // Soltamos la petición para que viaje al servidor
    }, (error) => {
        return Promise.reject(error);
    });
};

export default initAxiosInterceptors;