import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FormularioSensor = ({ onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: '',
    location: '',
    status: '',
  });

  useEffect(() => {
    if (id) {
      // Simular la carga de datos si el ID está presente (modo edición)
      const sensorData = {
        id,
        type: 'Grave', // Aquí puedes cambiar según los datos que cargues
        location: 'Sector 1',
        status: 'Activo',
      };
      setFormData(sensorData);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    navigate('/sensores');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Sensor' : 'Crear Sensor'}</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Tipo de Alerta</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Selecciona un tipo</option>
          <option value="Grave">Grave</option>
          <option value="Moderado">Moderado</option>
          <option value="Leve">Leve</option>
          <option value="Normal">Normal</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Localidad</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Estatus</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Selecciona un estatus</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {id ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default FormularioSensor;
