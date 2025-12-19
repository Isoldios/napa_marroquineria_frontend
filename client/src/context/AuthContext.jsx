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
    const [user, setUser] = useState(null); // Usuario de Firebase
    const [userData, setUserData] = useState(null); // Datos de MongoDB (Rol, Dirección)
    const [loading, setLoading] = useState(true);

    const API_URL = `${import.meta.env.VITE_API_URL}/usuarios`;

    // Función para sincronizar con Backend
    const sincronizarUsuario = async (firebaseUser) => {
        if (!firebaseUser) {
            setUserData(null);
            return;
        }
        try {
            const res = await axios.post(`${API_URL}/login`, {
                email: firebaseUser.email,
                nombre: firebaseUser.displayName || 'Usuario',
                firebaseUid: firebaseUser.uid
            });
            setUserData(res.data); // Aquí viene el rol: 'admin' o 'cliente'
        } catch (error) {
            console.error("Error sincronizando usuario:", error);
        }
    };

    // Registro con Email
    const registrarse = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Login con Email
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Login con Google
    const loginGoogle = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    // Logout
    const logout = () => {
        setUserData(null);
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            sincronizarUsuario(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, 
            userData, // Aquí vive el rol
            registrarse, 
            login, 
            loginGoogle, 
            logout, 
            loading 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};