import React, { useMemo } from 'react';
import { useTable, useGlobalFilter } from 'react-table';
import { FaArrowLeft, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
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

  // Definir rangos para cada parámetro
  const MinPH = 6.5;
  const MaxPH = 8.5;
  const MinORP = 200;
  const MaxORP = 600;
  const MaxTurbidez = 1.0;
  const MinTurbidez = 0.1;

  // Función para obtener el ícono basado en el valor del parámetro
  const getIconForValue = (parameter, type) => {
    const thresholds = {
      ph: { low: MinPH, high: MaxPH },
      turbidez: { low: MinTurbidez, high: MaxTurbidez },
      orp: { low: MinORP, high: MaxORP },
    };

    const threshold = thresholds[type];
    if (!threshold) return null;

    if (parameter < threshold.low) {
      return <FaExclamationCircle className="text-yellow-500" />; // Amarillo: bajo
    } else if (parameter > threshold.high) {
      return <FaExclamationCircle className="text-red-500" />; // Rojo: alto
    } else {
      return <FaCheckCircle className="text-green-500" />; // Verde: normal
    }
  };

  // Definir las columnas
  const columns = useMemo(() => [
    {
      Header: 'Fecha',
      accessor: 'registerDate',
      Cell: ({ value }) => (
        <div className="text-center">
          {new Date(value).toLocaleString('es-ES')}
        </div>
      ),
    },
    { Header: 'Unidad', accessor: 'unity' },
    {
      Header: 'Cloro Residual (mV)',
      accessor: 'orp_parameter',
      Cell: ({ value }) => (
        <div className="text-center flex items-center justify-center space-x-2">
          <span>{value}</span> {getIconForValue(value, 'orp')}
        </div>
      ),
    },
    {
      Header: 'Potencial de Hidrógeno',
      accessor: 'ph_parameter',
      Cell: ({ value }) => (
        <div className="text-center flex items-center justify-center space-x-2">
          <span>{value}</span> {getIconForValue(value, 'ph')}
        </div>
      ),
    },
    {
      Header: 'Turbidez (NTU)',
      accessor: 'turbidez_parameter',
      Cell: ({ value }) => (
        <div className="text-center flex items-center justify-center space-x-2">
          <span>{value}</span> {getIconForValue(value, 'turbidez')}
        </div>
      ),
    },
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
    return <p className="text-red-500 font-bold text-center mt-4">Error al cargar las lecturas: {error.message}</p>;
  }

  return (
    <div className="p-8 bg-white-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Lecturas del Sensor: {sensorData?.nombreSensor}</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar lectura..."
          className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={() => navigate('/sensores')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md flex items-center transform transition-transform hover:scale-105"
        >
          <FaArrowLeft className="mr-2" /> Volver a Sensores
        </button>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        {isLoading ? (
          <p className="text-center py-4 text-gray-500">Cargando lecturas...</p>
        ) : lecturas && lecturas.length > 0 ? (
          <table {...getTableProps()} className="min-w-full bg-white rounded-lg">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id} className="bg-blue-500 text-white text-lg font-semibold">
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} key={column.id} className="py-4 px-6 text-center">
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, index) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.id}
                    className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-200`}
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} key={cell.column.id} className="py-4 px-6 text-center">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <h1 className="text-center text-2xl font-bold mb-5 text-gray-500 py-6">Sin lecturas registradas</h1>
        )}
      </div>
    </div>
  );
};

export default LecturasDeSensor;
