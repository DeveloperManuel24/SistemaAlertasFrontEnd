import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../../../api/AuthAPI';

const VerUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserById(id);
        setUserData(data);
      } catch (error) {
        setError(error.message); // Guardamos el mensaje de error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error al obtener los detalles del usuario: {error}</p>;
  }

  if (!userData) {
    return <p>Usuario no encontrado.</p>;
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Detalles del Usuario</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4"><strong>ID:</strong> {userData.id}</p>
        <p className="mb-4"><strong>Correo Electrónico:</strong> {userData.correoElectronico}</p>
        <p className="mb-4"><strong>Rol:</strong> {userData.derechosUsuario}</p>
        <p className="mb-4"><strong>Registrado el:</strong> {new Date(userData.fechaRegistro).toLocaleDateString()}</p>
        <button
        onClick={() => navigate('/usuarios')}
        className="bg-blue-500 hover:bg-blue-700 mt-8 text-white font-bold py-2 px-4 rounded mx-auto block"
      >
        Volver a la lista de usuarios
      </button>
      </div>
    </div>
  );
};

export default VerUsuario;
