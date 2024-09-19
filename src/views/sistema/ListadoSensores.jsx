import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getSensors } from '../../../api/SensorAPI';

const ListadoSensores = () => {
  const navigate = useNavigate();

  // Usar `useQuery` para obtener los sensores
  const { data: sensors, isLoading, error } = useQuery({
    queryKey: ['sensors'],
    queryFn: getSensors,
  });

  // Manejar errores y estado de carga
  if (isLoading) {
    return <p className="text-center text-gray-500 py-4">Cargando sensores...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-4">Error al cargar sensores: {error.message}</p>;
  }

  return (
    <div className="p-8 bg-white-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Listado de Sensores</h1>
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        {sensors && sensors.length > 0 ? (
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white text-lg font-semibold">
                <th className="py-4 px-6 text-center">Nombre del Sensor</th>
                <th className="py-4 px-6 text-center">Localidad</th>
                <th className="py-4 px-6 text-center">Estado</th>
                <th className="py-4 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sensors.map((sensor, index) => (
                <tr
                  key={sensor.sensorId}
                  className={`border-b ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100 transition-colors duration-200`}
                >
                  <td className="py-4 px-6 text-center">{sensor.nombreSensor}</td>
                  <td className="py-4 px-6 text-center">{sensor.location}</td>
                  <td className="py-4 px-6 text-center">
                    {sensor.status === 'Activo' ? (
                      <span className="text-green-500 font-semibold">Activo</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Inactivo</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center flex justify-center items-center"> {/* Alineación centrada */}
                    <button
                      onClick={() => navigate(`GraficasPorSensor/${sensor.sensorId}`)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transform transition-transform hover:scale-105 flex items-center space-x-2"
                    >
                      <FaEye />
                      <span>Ver Detalles</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h1 className="mt-9 text-center text-2xl font-bold mb-5 text-gray-500">No hay sensores registrados</h1>
        )}
      </div>
    </div>
  );
};

export default ListadoSensores;
