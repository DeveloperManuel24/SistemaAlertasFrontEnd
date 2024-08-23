import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerSensor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    // Simulación de carga de datos
    const fakeData = {
      id,
      type: 'Grave',
      location: 'Sector 1',
      status: 'Activo',
    };
    setSensorData(fakeData);
  }, [id]);

  if (!sensorData) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Detalles del Sensor</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4"><strong>ID:</strong> {sensorData.id}</p>
        <p className="mb-4"><strong>Tipo de Alerta:</strong> {sensorData.type}</p>
        <p className="mb-4"><strong>Localidad:</strong> {sensorData.location}</p>
        <p className="mb-4"><strong>Estatus:</strong> {sensorData.status}</p>
        <button
          onClick={() => navigate('/sensores')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Volver a la lista de sensores
        </button>
      </div>
    </div>
  );
};

export default VerSensor;
