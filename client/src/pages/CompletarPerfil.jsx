import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompletarPerfil = () => {
    const { user, userData, sincronizarUsuario } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: ''
    });

    // Cargar datos que ya tengamos
    useEffect(() => {
        if (userData) {
            // Si ya tiene todo completo, echarlo al home
            if (userData.nombre && userData.email && userData.telefono && userData.direccion) {
                navigate('/');
            }
            setForm({
                nombre: userData.nombre || user.displayName || '',
                email: userData.email || user.email || '',
                telefono: userData.telefono || '',
                direccion: userData.direccion || ''
            });
        }
    }, [userData, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // VERIFICACIÓN: Imprimimos la URL antes de enviar
            console.log("Enviando PUT a:", `${import.meta.env.VITE_API_URL}/usuarios/${user.uid}`);
            
            await axios.put(`${import.meta.env.VITE_API_URL}/usuarios/${user.uid}`, form);
            
            // Forzamos actualización visual
            await sincronizarUsuario(user);
            
            alert('Datos guardados correctamente');
            navigate('/carrito'); 
            
        } catch (error) {
            console.error(error);
            alert('Error al guardar datos. Revisa la consola.');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <h2>¡Casi terminamos! 🚀</h2>
            <p>Por favor completa tus datos para poder realizar pedidos.</p>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" placeholder="Nombre Completo" required 
                    value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} 
                    style={{ padding: '10px' }}
                />
                <input 
                    type="email" placeholder="Correo Electrónico" required 
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} 
                    // Si entró con Google, el email quizás no debería editarse, pero si es teléfono sí.
                    disabled={user?.email} 
                    style={{ padding: '10px', background: user?.email ? '#eee' : 'white' }}
                />
                <input 
                    type="tel" placeholder="Teléfono" required 
                    value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} 
                    style={{ padding: '10px' }}
                />
                <input 
                    type="text" placeholder="Dirección de envío" required 
                    value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} 
                    style={{ padding: '10px' }}
                />
                <button type="submit" style={{ padding: '15px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Guardar y Continuar
                </button>
            </form>
        </div>
    );
};

export default CompletarPerfil;