import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSensor, updateSensor, getSensorById } from '../../api/SensorAPI';

const FormularioSensor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    nombreSensor: '',
    location: '',
    status: '',
  });

  // Cargar los datos del sensor si el id está presente
  const { data: sensorData, isLoading: isLoadingSensor } = useQuery({
    queryKey: ['sensor', id],
    queryFn: () => getSensorById(id),
    enabled: !!id,
    onSuccess: (data) => {
      setFormData({
        nombreSensor: data.nombreSensor || '',
        location: data.location || '',
        status: data.status || '',
      });
    },
    onError: (error) => {
      console.error('Error al cargar el sensor:', error.message);
    },
  });

  // Mutación para crear un nuevo sensor
  const createMutation = useMutation({
    mutationFn: createSensor,
    onSuccess: () => {
      queryClient.invalidateQueries(['sensors']);
      navigate('/sensores');
    },
    onError: (error) => {
      console.error('Error al crear el sensor:', error.message);
    },
  });

  // Mutación para actualizar un sensor existente
  const updateMutation = useMutation({
    mutationFn: (updatedData) => updateSensor(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(['sensors']);
      navigate('/sensores');
    },
    onError: (error) => {
      console.error('Error al actualizar el sensor:', error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  useEffect(() => {
    if (sensorData) {
      setFormData({
        nombreSensor: sensorData.nombreSensor || '',
        location: sensorData.location || '',
        status: sensorData.status || '',
      });
    }
  }, [sensorData]);

  if (isLoadingSensor) {
    return <p className="text-center py-6">Cargando datos del sensor...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {id ? 'Editar Sensor' : 'Crear Sensor'}
        </h2>
        <div className="mb-6">
          <label className="block text-gray-700 text-lg font-semibold mb-2">
            Nombre del Sensor
          </label>
          <input
            type="text"
            name="nombreSensor"
            value={formData.nombreSensor}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-lg font-semibold mb-2">
            Localidad
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-lg font-semibold mb-2">
            Estatus
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecciona un estatus</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            {id ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>

      <button
        onClick={() => navigate('/sensores')}
        className="mt-10 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
      >
        Volver a la lista de Sensores
      </button>
    </div>
  );
};

export default FormularioSensor;
