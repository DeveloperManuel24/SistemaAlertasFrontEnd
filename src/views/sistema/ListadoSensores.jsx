import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getSensors } from '../../../api/SensorAPI';  // Asegúrate de tener la ruta correcta

const ListadoSensores = () => {
  const navigate = useNavigate();

  // Usar `useQuery` para obtener los sensores
  const { data: sensors, isLoading, error } = useQuery({
    queryKey: ['sensors'],
    queryFn: getSensors,
  });

  // Manejar errores y estado de carga
  if (isLoading) {
    return <p>Cargando sensores...</p>;
  }

  if (error) {
    return <p>Error al cargar sensores: {error.message}</p>;
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Listado de Sensores</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Nombre del Sensor</th>
              <th className="py-3 px-6 text-left">Localidad</th>
              <th className="py-3 px-6 text-left">Estado</th>
              <th className="py-3 px-6 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map(sensor => (
              <tr key={sensor.sensorId} className="border-b">
                <td className="py-3 px-6">{sensor.nombreSensor}</td>
                <td className="py-3 px-6">{sensor.location}</td>
                <td className="py-3 px-6">{sensor.status}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => navigate(`GraficasPorSensor/${sensor.sensorId}`)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FaEye className="mr-1" /> Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListadoSensores;
