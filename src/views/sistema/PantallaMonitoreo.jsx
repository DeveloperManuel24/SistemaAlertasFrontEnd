import React, { useMemo } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { useQuery } from '@tanstack/react-query';
import { getReadings } from '../../../api/LecturaAPI'; // Asegúrate de usar el endpoint correcto para las lecturas
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const PantallaMonitoreo = () => {
  // Fetching readings data using useQuery
  const { data: readingsData, isLoading, error } = useQuery({
    queryKey: ['readings'],
    queryFn: getReadings, // Obtener los datos desde la API
  });

  console.log(readingsData);
  
  // Prevenir errores si no hay lecturas aún
  const data = readingsData || [];

  // Definir las columnas de la tabla
  const columns = useMemo(() => [
    { Header: 'NO.', accessor: 'readId', Cell: ({ value }) => <div className="text-center">{value}</div> }, 
    { Header: 'Fecha y Hora', accessor: 'registerDate', Cell: ({ value }) => <div className="text-center">{new Date(value).toLocaleString('es-ES')}</div> },
    { Header: 'Id del sensor', accessor: 'sensorId', Cell: ({ value }) => <div className="text-center">{value}</div> },
    { Header: 'Sensor de Turbidez (NTU)', accessor: 'turbidez_parameter', Cell: ({ value }) => <div className="text-center">{value}</div> },
    { Header: 'Sensor de pH', accessor: 'ph_parameter', Cell: ({ value }) => <div className="text-center">{value}</div> },
    { Header: 'Sensor de ORP (mV)', accessor: 'orp_parameter', Cell: ({ value }) => <div className="text-center">{value}</div> },
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

  // Función para descargar el reporte en PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Encabezado
    doc.setFontSize(18);
    doc.text('Reporte de Lecturas', 14, 16);
    doc.setFontSize(12);

    // Generar la tabla automáticamente
    doc.autoTable({
      startY: 22,
      head: [['NO', 'Fecha y Hora', 'Id del Sensor', 'Turbidez (NTU)', 'pH', 'ORP (mV)']],
      body: page.map((row) => [
        row.index + 1,
        new Date(row.original.registerDate).toLocaleString('es-ES'),
        row.original.sensorId,
        row.original.turbidez_parameter,
        row.original.ph_parameter,
        row.original.orp_parameter,
      ]),
    });

    doc.save('reporte-lecturas.pdf');
  };

  // Función para descargar el reporte en Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(page.map((row) => ({
      NO: row.index + 1,
      Fecha: new Date(row.original.registerDate).toLocaleString('es-ES'),
      'Id del Sensor': row.original.sensorId,
      'Turbidez (NTU)': row.original.turbidez_parameter,
      'pH': row.original.ph_parameter,
      'ORP (mV)': row.original.orp_parameter,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ReporteLecturas');
    XLSX.writeFile(workbook, 'reporte-lecturas.xlsx');
  };

  if (isLoading) {
    return <p>Cargando lecturas...</p>;
  }

  if (error) {
    return <p>Error al cargar las lecturas: {error.message}</p>;
  }

  return (
    <div className="p-5">
      <h1 className="text-4xl font-bold mb-6 ">Monitoreo de Lecturas</h1>
      <div className="flex justify-between mb-4">
        <input
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
          className="p-2 border border-gray-300 rounded"
        />
        <div className="flex space-x-2">
          <button
            onClick={downloadPDF}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Descargar PDF
          </button>
          <button
            onClick={downloadExcel}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Descargar Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full bg-white border border-gray-200">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id} className="bg-gray-800 text-white">
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} key={column.id} className="py-3 px-6 text-center">
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
                <tr {...row.getRowProps()} key={row.original.readId || row.index} className="border-b">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} key={cell.column.id} className="py-3 px-6 text-center">
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
