import React, { useMemo } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';

const PantallaMonitoreo = () => {
  const data = useMemo(() => [
    { no: 1, fecha: '22/05/2024', hora: '01:00', ubicacion: 'Distribuidor de agua - El paraíso', turbidez: 0.5, ph: 7.2, orp: 250, temperatura: 25, estado: 'Normal' },
    { no: 2, fecha: '22/05/2024', hora: '13:00', ubicacion: 'Distribuidor de lodo - El paraíso', turbidez: 1.0, ph: 7.4, orp: 300, temperatura: 24, estado: 'Normal' },
    // Añade más datos aquí...
  ], []);

  const columns = useMemo(() => [
    { Header: 'NO.', accessor: 'no' },
    { Header: 'Fecha', accessor: 'fecha' },
    { Header: 'Hora', accessor: 'hora' },
    { Header: 'Ubicación', accessor: 'ubicacion' },
    { Header: 'Sensor de Turbidez (NTU)', accessor: 'turbidez' },
    { Header: 'Sensor de pH', accessor: 'ph' },
    { Header: 'Sensor de ORP (mV)', accessor: 'orp' },
    { Header: 'Sensor de Temperatura (°C)', accessor: 'temperatura' },
    { Header: 'Estado', accessor: 'estado' },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using rows, we'll use page
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    setGlobalFilter, // Añadimos esto para la búsqueda global
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Start on the first page
    },
    useGlobalFilter, // Añadimos el filtro global
    usePagination
  );

  const { pageIndex, pageSize, globalFilter } = state; // Añadimos globalFilter al estado

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
      {/* Paginación */}
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
