import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, registrarse, loginGoogle } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isRegister) {
                await registrarse(email, password);
            } else {
                await login(email, password);
            }
            navigate('/'); // Redirigir al Home
        } catch (err) {
            setError('Error: Verifica tus credenciales o intenta de nuevo.');
        }
    };

    const handleGoogle = async () => {
        try {
            await loginGoogle();
            navigate('/');
        } catch (error) {
            setError('Error con Google');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '8px' }}/>
                <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '8px' }}/>
                <button type="submit" style={{ padding: '10px', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {isRegister ? 'Registrarse' : 'Ingresar'}
                </button>
            </form>

            <button onClick={handleGoogle} style={{ marginTop: '10px', width: '100%', padding: '10px', background: '#DB4437', color: 'white', border: 'none', cursor: 'pointer' }}>
                Acceder con Google
            </button>

            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                <button 
                    onClick={() => setIsRegister(!isRegister)} 
                    style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px' }}
                >
                    {isRegister ? 'Inicia Sesión' : 'Regístrate'}
                </button>
            </p>
        </div>
    );
};

export default LoginPage;