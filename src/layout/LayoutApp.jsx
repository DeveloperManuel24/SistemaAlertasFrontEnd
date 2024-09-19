import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChartLine, FaTv, FaBell, FaMicrochip, FaUserCog, FaSignOutAlt } from 'react-icons/fa';
import jwtDecode from 'jwt-decode'; 
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';

const LayoutApp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('AUTH_TOKEN'); 
    if (token) {
      try {
        const decoded = jwtDecode(token); 
        console.log('Token decodificado:', decoded); 

        setUserEmail(decoded.email || 'Usuario');

        if (decoded.esadmin) {
          console.log('Rol de administrador encontrado');
          if (decoded.esadmin === 'true') {
            setIsAdmin(true);
          }
        } else {
          console.warn('El token no contiene el campo "esadmin"');
        }
      } catch (error) {
        console.error('Error decodificando el token:', error);
      }
    }
  }, []); 

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Serás desconectado del sistema!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('AUTH_TOKEN'); 
        navigate('/auth/login'); 
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="md:w-1/4 bg-gray-800 text-white px-5 py-10 shadow-lg rounded-lg">
        <h2 className="text-4xl font-black text-center mb-10">
          Sistema de alerta
        </h2>
        <p className="text-center mb-4">Agua contaminada</p>
        <p className="text-center text-sky-300 mb-8">Hola, {userEmail}</p>

        <nav className="mt-10">
          <Link
            className={`mt-9 ${location.pathname === '/' ? 'bg-blue-600 text-white' : 'text-white'} 
            text-xl block mt-6 hover:bg-blue-600 hover:text-white flex items-center transition-all transform hover:scale-105 rounded-lg px-4 py-2`}
            to="/"
          >
            <FaChartLine className="mr-3" /> Gráfica de Sensores
          </Link>
          <Link
            className={`mt-9 ${location.pathname === '/PantallaMonitoreo' ? 'bg-blue-600 text-white' : 'text-white'} 
            text-xl block mt-6 hover:bg-blue-600 hover:text-white flex items-center transition-all transform hover:scale-105 rounded-lg px-4 py-2`}
            to="/PantallaMonitoreo"
          >
            <FaTv className="mr-3" /> Pantalla de Monitoreo
          </Link>
          <Link
            className={`mt-9 ${location.pathname === '/alertas' ? 'bg-blue-600 text-white' : 'text-white'} 
            text-xl block mt-6 hover:bg-blue-600 hover:text-white flex items-center transition-all transform hover:scale-105 rounded-lg px-4 py-2`}
            to="/alertas"
          >
            <FaBell className="mr-3" /> Alertas
          </Link>
          <Link
            className={`mt-9 ${location.pathname === '/sensores' ? 'bg-blue-600 text-white' : 'text-white'} 
            text-xl block mt-6 hover:bg-blue-600 hover:text-white flex items-center transition-all transform hover:scale-105 rounded-lg px-4 py-2`}
            to="/sensores"
          >
            <FaMicrochip className="mr-3" /> Manejo de Sensores
          </Link>

          {isAdmin && (
            <Link
              className={`mt-9 ${location.pathname === '/usuarios' ? 'bg-blue-600 text-white' : 'text-white'} 
              text-xl block mt-6 hover:bg-blue-600 hover:text-white flex items-center transition-all transform hover:scale-105 rounded-lg px-4 py-2`}
              to="/usuarios"
            >
              <FaUserCog className="mr-3" /> Manejo de Usuarios
            </Link>
          )}

          <button
            className="mt-9 bg-red-500 text-white text-xl block mt-6 hover:bg-red-600 flex items-center w-full transition-all transform hover:scale-105 rounded-lg px-4 py-2"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </nav>
      </aside>

      <main className="md:w-3/4 p-10 md:h-screen overflow-scroll bg-white rounded-lg shadow-lg" style={{ boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.1)' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutApp;
