import { createContext, useContext, useEffect, useState } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '../../firebase'; 
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);       // Usuario Firebase
    const [userData, setUserData] = useState(null); // Usuario MongoDB
    const [loading, setLoading] = useState(true);

    const API_URL = `${import.meta.env.VITE_API_URL}/usuarios`;

    // Función para obtener datos de MongoDB
    const sincronizarUsuario = async (firebaseUser, datosExtra = {}) => {
        if (!firebaseUser) return;

        try {
            // Usamos POST /login para buscar o crear
            const res = await axios.post(`${API_URL}/login`, {
                email: firebaseUser.email,
                nombre: datosExtra.nombre || firebaseUser.displayName,
                firebaseUid: firebaseUser.uid,
                telefono: datosExtra.telefono,
                direccion: datosExtra.direccion
            });
            setUserData(res.data);
            return res.data;
        } catch (error) {
            console.error("Error sincronizando usuario:", error);
        }
    };

    const registrarse = async (email, password, datos) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sincronizarUsuario(userCredential.user, datos);
    };

    const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

    const loginGoogle = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    // --- CORRECCIÓN DEL LOGOUT ---
    const logout = async () => {
        setUserData(null); // 1. Limpiamos datos de Mongo
        setUser(null);     // 2. Limpiamos usuario Firebase (visual)
        await signOut(auth); // 3. Ejecutamos salida real
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            
            if (currentUser) {
                // Si hay usuario, traemos sus datos de Mongo
                await sincronizarUsuario(currentUser);
            } else {
                // SI NO HAY USUARIO (LOGOUT), LIMPIAMOS TODO OBLIGATORIAMENTE
                setUserData(null);
            }
            
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, 
            userData, 
            registrarse, 
            login, 
            loginGoogle,
            sincronizarUsuario,
            logout, 
            loading 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};