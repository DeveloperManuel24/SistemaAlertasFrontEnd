import React, { useMemo } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { useQuery } from '@tanstack/react-query';
import { getReadings } from '../../../api/LecturaAPI'; // Asegúrate de usar el endpoint correcto para las lecturas

const PantallaMonitoreo = () => {
  // Fetching readings data using useQuery
  const { data: readingsData, isLoading, error } = useQuery({
    queryKey: ['readings'],
    queryFn: getReadings, // Obtener los datos desde la API
  });
console.log(readingsData)
  // Prevenir errores si no hay lecturas aún
  const data = readingsData || [];

  // Definir las columnas de la tabla
  const columns = useMemo(() => [
    { Header: 'NO.', accessor: 'readId' }, // Aquí uso 'readId' como el ID único
    { Header: 'Fecha', accessor: 'registerDate' },
    { Header: 'Hora', accessor: 'registerTime' }, // Si tienes una hora separada, ajusta el accessor
    { Header: 'Ubicación', accessor: 'location' }, // Asegúrate de que exista este campo en tus datos
    { Header: 'Sensor de Turbidez (NTU)', accessor: 'turbidez_parameter' },
    { Header: 'Sensor de pH', accessor: 'ph_parameter' },
    { Header: 'Sensor de ORP (mV)', accessor: 'orp_parameter' },
    { Header: 'Sensor de Temperatura (°C)', accessor: 'temperature' }, // Asegúrate de tener la temperatura en los datos
    { Header: 'Estado', accessor: 'estado' }, // Asegúrate de que 'estado' sea parte de tus datos o puedes omitirlo
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using rows, we'll use page for pagination
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data, // Usar los datos obtenidos de la API
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    usePagination
  );

  const { pageIndex, pageSize, globalFilter } = state;

  if (isLoading) {
    return <p>Cargando lecturas...</p>;
  }

  if (error) {
    return <p>Error al cargar las lecturas: {error.message}</p>;
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Pantalla Resumen de Datos</h1>
      <div className="mb-4">
        <input
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="overflow-x-auto">
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
            {page.map((row) => {
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
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className={`px-3 py-2 text-sm font-semibold text-white rounded ${canPreviousPage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {'<<'}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className={`px-3 py-2 text-sm font-semibold text-white rounded ${canPreviousPage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {'<'}
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className={`px-3 py-2 text-sm font-semibold text-white rounded ${canNextPage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {'>'}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className={`px-3 py-2 text-sm font-semibold text-white rounded ${canNextPage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {'>>'}
          </button>
          <span className="text-sm font-medium">
            Página{' '}
            <strong>
              {pageIndex + 1} de {pageOptions.length}
            </strong>
          </span>
        </div>
        <div>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Mostrar {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PantallaMonitoreo;
