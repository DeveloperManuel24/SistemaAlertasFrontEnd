import React, { useMemo } from 'react';
import { useTable, useGlobalFilter } from 'react-table';
import { FaArrowLeft } from 'react-icons/fa';  // Cambio de icono aquí
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSensorById } from '../../../api/SensorAPI';

const LecturasDeSensor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetching sensor data using useQuery
  const { data: sensorData, isLoading, error } = useQuery({
    queryKey: ['sensor', id],
    queryFn: () => getSensorById(id),
  });

  const lecturas = sensorData?.lecturaEntidades || [];

  // Definir las columnas
  const columns = useMemo(() => [
    { Header: 'Fecha', accessor: 'registerDate' },
    { Header: 'Unidad', accessor: 'unity' },
    { Header: 'ORP', accessor: 'orp_parameter' },  // Aquí puedes ajustar el accessor según el parámetro que necesites mostrar
    { Header: 'PH', accessor: 'ph_parameter' },
    { Header: 'Turbidez', accessor: 'turbidez_parameter' },
  ], []);

  // Inicializar la tabla con los datos obtenidos
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data: lecturas }, useGlobalFilter);

  const { globalFilter } = state;

  if (error) {
    return <p>Error al cargar las lecturas: {error.message}</p>;
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Lecturas del Sensor: {sensorData?.nombreSensor}</h1>
      <div className="flex justify-between mb-4">
        <input
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar lectura..."
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={() => navigate('/sensores')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Volver a Sensores
        </button>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <p>Cargando lecturas...</p>
        ) : (
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
                  <tr {...row.getRowProps()} key={row.id} className="border-b">
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
        )}
      </div>
    </div>
  );
};

export default LecturasDeSensor;
