import React, { useMemo } from 'react';
import { useTable, useGlobalFilter } from 'react-table';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getSensors, deleteSensor } from '../../../api/SensorAPI';

const ManejoDeSensor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetching sensors data using useQuery
  const { data: sensors, isLoading, error } = useQuery({
    queryKey: ['sensors'],
    queryFn: getSensors,
  });
  console.log("API Data:", sensors);

  // Mutation for deleting a sensor
  const deleteMutation = useMutation({
    mutationFn: deleteSensor,
    onSuccess: () => {
      queryClient.invalidateQueries(['sensors']); // Refrescar los datos después de eliminar
      Swal.fire('Eliminado!', 'El sensor ha sido eliminado.', 'success');
    },
    onError: (error) => {
      Swal.fire('Error', error.message, 'error');
    },
  });

  // Handle delete sensor
  const handleDelete = async (sensorId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(sensorId);
      }
    });
  };

  // Definir las columnas
  const columns = useMemo(() => [
    { Header: 'Nombre Sensor', accessor: 'nombreSensor' },
    { Header: 'Localidad', accessor: 'location' },
    { Header: 'Estatus', accessor: 'status' },
    {
      Header: 'Acciones',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/sensores/view/${row.original.sensorId}`)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaEye className="mr-1" /> Ver Lecturas
          </button>
          <button
            onClick={() => navigate(`/sensores/edit/${row.original.sensorId}`)}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaEdit className="mr-1" /> Editar
          </button>
          <button
            onClick={() => handleDelete(row.original.sensorId)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaTrash className="mr-1" /> Eliminar
          </button>
        </div>
      ),
    },
  ], [navigate]);

  // Inicializar la tabla con los datos obtenidos
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data: sensors || [] }, useGlobalFilter);

  const { globalFilter } = state;

  if (error) {
    return <p>Error al cargar los sensores: {error.message}</p>;
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Gestión de Sensores</h1>
      <div className="flex justify-between mb-4">
        <input
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar sensor..."
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={() => navigate('/sensores/create')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Crear Sensor
        </button>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <p>Cargando sensores...</p>
        ) : sensors && sensors.length > 0 ? (
          <table {...getTableProps()} className="min-w-full bg-white border border-gray-200">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id} className="bg-gray-800 text-white">
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} key={column.id} className="py-3 px-6 text-left">
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.original.sensorId} className="border-b">
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} key={cell.column.id} className="py-3 px-6">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <h1 className="mt-9 text-center text-2xl font-bold mb-5">Sin sensores registrados</h1>
        )}
      </div>
    </div>
  );
};

export default ManejoDeSensor;
