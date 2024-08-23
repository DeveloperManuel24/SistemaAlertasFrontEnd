import React, { useMemo } from 'react';
import { useTable, useGlobalFilter } from 'react-table';
import { FaExclamationTriangle } from 'react-icons/fa';

const Alertas = () => {
  const data = useMemo(() => [
    { no: 1, nombre: 'Alerta niveles de pH demasiado elevados.', parametro: '5.2', fecha: '25/05/2024', hora: '13:00' },
    { no: 2, nombre: 'Alerta niveles de ORP demasiado bajos.', parametro: '50', fecha: '25/05/2024', hora: '13:00' },
    // Añade más datos aquí...
  ], []);

  const columns = useMemo(() => [
    {
      Header: '',
      accessor: 'icono',
      Cell: () => <FaExclamationTriangle className="text-red-500" />,
    },
    { Header: 'NO.', accessor: 'no' },
    { Header: 'Nombre de Alerta', accessor: 'nombre' },
    { Header: 'Parámetro', accessor: 'parametro' },
    { Header: 'Fecha', accessor: 'fecha' },
    { Header: 'Hora', accessor: 'hora' },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    state,
    setGlobalFilter, // Añadimos esto para la búsqueda global
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter // Añadimos el filtro global
  );

  const { globalFilter } = state;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Pantalla de Alertas</h1>
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
      </div>
    </div>
  );
};

export default Alertas;
