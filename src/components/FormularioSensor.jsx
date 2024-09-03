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
    enabled: !!id, // Solo ejecuta la consulta si hay un ID presente
    onSuccess: (data) => {
      // Verifica si los datos vienen correctamente y se asignan a formData
      console.log("Datos del sensor:", data);
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
      queryClient.invalidateQueries(['sensors']); // Refrescar los datos de sensores
      navigate('/sensores'); // Redirigir al listado de sensores
    },
    onError: (error) => {
      console.error('Error al crear el sensor:', error.message);
    },
  });

  // Mutación para actualizar un sensor existente
  const updateMutation = useMutation({
    mutationFn: (updatedData) => updateSensor(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(['sensors']); // Refrescar los datos de sensores
      navigate('/sensores'); // Redirigir al listado de sensores
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
      updateMutation.mutate(formData); // Actualizar sensor
    } else {
      createMutation.mutate(formData); // Crear sensor
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
    return <p>Cargando datos del sensor...</p>;
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Sensor' : 'Crear Sensor'}</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Nombre del Sensor</label>
        <input
          type="text"
          name="nombreSensor"
          value={formData.nombreSensor}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
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
        
    <button
        onClick={() => navigate('/sensores')}
        className="bg-blue-500 hover:bg-blue-700 mt-8 text-white font-bold py-2 px-4 rounded mx-auto block"
      >
        Volver a la lista de Sensores
      </button>
    </>
  );
};

export default FormularioSensor;
