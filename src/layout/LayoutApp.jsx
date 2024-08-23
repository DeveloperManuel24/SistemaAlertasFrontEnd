import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaTv, FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa';
import jwtDecode from 'jwt-decode';  // Importación estándar
import Swal from 'sweetalert2';

const LayoutApp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Decodificar el JWT utilizando la clave correcta
  const token = localStorage.getItem('AUTH_TOKEN'); // Usar la clave correcta para obtener el token
  let userEmail = '';

  if (token) {
    try {
      const decoded = jwtDecode(token);  // Decodificar usando jwtDecode
      userEmail = decoded.email || 'Usuario';
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

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
        localStorage.removeItem('AUTH_TOKEN'); // Eliminar el token usando la clave correcta
        navigate('/auth/login'); // Redirigir al usuario a la página de inicio de sesión
      }
    });
  };

  return (
    <div>
      <div className='md:flex md:min-h-screen'>
        <aside className='md:w-1/4 bg-gray-800 px-5 py-10'>
          <h2 className='text-4xl font-black text-center text-white'>Sistema de alerta</h2>
          <p className='mt-3 text-center text-white'>Agua contaminada</p>
          <p className='mt-5 text-center text-sky-300'>Hola, {userEmail}</p>

          <nav className='mt-10'>
            <Link 
              className={`mt-9 ${location.pathname === '/' ? 'text-blue-300' : 'text-white'} text-xl block mt-6 hover:text-blue-300 flex items-center`} 
              to="/"
            >
              <FaHome className="mr-2" /> Resumen de Datos
            </Link>
            <Link 
              className={`mt-9 ${location.pathname === '/PantallaMonitoreo' ? 'text-blue-300' : 'text-white'} text-xl block mt-6 hover:text-blue-300 flex items-center`} 
              to="/PantallaMonitoreo"
            >
              <FaTv className="mr-2" /> Pantalla de Monitoreo
            </Link>
            <Link 
              className={`mt-9 ${location.pathname === '/alertas' ? 'text-blue-300' : 'text-white'} text-xl block mt-6 hover:text-blue-300 flex items-center`} 
              to="/alertas"
            >
              <FaBell className="mr-2" /> Alertas
            </Link>
            <Link 
              className={`mt-9 ${location.pathname === '/sensores' ? 'text-blue-300' : 'text-white'} text-xl block mt-6 hover:text-blue-300 flex items-center`} 
              to="/sensores"
            >
              <FaCog className="mr-2" /> Manejo de Sensores
            </Link>
            <Link 
              className={`mt-9 ${location.pathname === '/usuarios' ? 'text-blue-300' : 'text-white'} text-xl block mt-6 hover:text-blue-300 flex items-center`} 
              to="/usuarios"
            >
              <FaCog className="mr-2" /> Manejo de Usuarios
            </Link>
            
            <button 
              className="mt-9 text-white text-xl block mt-6 hover:text-blue-300 flex items-center w-full"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </nav>
        </aside>
        <main className='md:w-3/4 p-10 md:h-screen overflow-scroll'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutApp;
