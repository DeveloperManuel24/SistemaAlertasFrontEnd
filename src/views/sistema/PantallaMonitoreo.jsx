import React, { useMemo } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { useQuery } from '@tanstack/react-query';
import { getReadings } from '../../../api/LecturaAPI';
import { FaCircle, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const PantallaMonitoreo = () => {
  // Función para convertir fecha UTC a la hora de Guatemala (UTC-6)
  const convertToGuatemalaTime = (utcDateStr) => {
    const utcDate = new Date(utcDateStr);

    // Usar Intl.DateTimeFormat para la conversión correcta a la zona horaria de Guatemala
    const options = {
      timeZone: 'America/Guatemala',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };

    return new Intl.DateTimeFormat('es-ES', options).format(utcDate);
  };

  // Fetching readings data using useQuery
  const { data: readingsData, isLoading, error } = useQuery({
    queryKey: ['readings'],
    queryFn: getReadings,
  });

  // Prevenir errores si no hay lecturas aún
  const data = readingsData || [];

  // Función para obtener el ícono basado en el valor del parámetro
  const getIconForValue = (parameter, type) => {
    const thresholds = {
      ph: { low: 6.8, high: 7.8 },
      turbidez: { low: 0.1, high: 1.0 },
      orp: { low: 200, high: 600 },
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

  // Definir las columnas de la tabla
  const columns = useMemo(() => [
    { Header: 'NO.', accessor: 'readId', Cell: ({ value }) => <div className="text-center">{value}</div> },
    {
      Header: 'Fecha y Hora',
      accessor: 'registerDate',
      Cell: ({ value }) => (
        <div className="text-center">
          {convertToGuatemalaTime(value)}
        </div>
      )
    },
    { Header: 'Id del sensor', accessor: 'sensorId', Cell: ({ value }) => <div className="text-center">{value}</div> },
    {
      Header: 'Sensor de Turbidez (NTU)',
      accessor: 'turbidez_parameter',
      Cell: ({ value }) => (
        <div className="text-center flex items-center justify-center space-x-2">
          <span>{value}</span> {getIconForValue(value, 'turbidez')}
        </div>
      ),
    },
    {
      Header: 'Sensor de pH',
      accessor: 'ph_parameter',
      Cell: ({ value }) => (
        <div className="text-center flex items-center justify-center space-x-2">
          <span>{value}</span> {getIconForValue(value, 'ph')}
        </div>
      ),
    },
    {
      Header: 'Sensor de ORP (mV)',
      accessor: 'orp_parameter',
      Cell: ({ value }) => (
        <div className="text-center flex items-center justify-center space-x-2">
          <span>{value}</span> {getIconForValue(value, 'orp')}
        </div>
      ),
    },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
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
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    usePagination
  );

  const { pageIndex, pageSize, globalFilter } = state;

  // Función para descargar el reporte en PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Reporte de Lecturas', 14, 16);
    doc.setFontSize(12);

    doc.autoTable({
      startY: 22,
      head: [['NO', 'Fecha y Hora', 'Id del Sensor', 'Turbidez (NTU)', 'pH', 'ORP (mV)']],
      body: page.map((row) => [
        row.index + 1,
        convertToGuatemalaTime(row.original.registerDate),
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
      Fecha: convertToGuatemalaTime(row.original.registerDate),
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
    <div className="p-8 bg-white-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Monitoreo de Lecturas</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
          className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring focus:border-blue-300"
        />
        <div className="flex space-x-2">
          <button
            onClick={downloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transform transition-transform hover:scale-105"
          >
            Descargar PDF
          </button>
          <button
            onClick={downloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transform transition-transform hover:scale-105"
          >
            Descargar Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
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
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  key={row.original.readId || row.index}
                  className={`border-b ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100 transition-colors duration-200`}
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
      </div>
      <div className="mt-8 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className={`px-3 py-2 text-sm font-semibold text-white rounded-lg shadow-md ${
              canPreviousPage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {'<<'}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className={`px-3 py-2 text-sm font-semibold text-white rounded-lg shadow-md ${
              canPreviousPage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {'<'}
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className={`px-3 py-2 text-sm font-semibold text-white rounded-lg shadow-md ${
              canNextPage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {'>'}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className={`px-3 py-2 text-sm font-semibold text-white rounded-lg shadow-md ${
              canNextPage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
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
            className="px-3 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring focus:border-blue-300"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Mostrar {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PantallaMonitoreo;
