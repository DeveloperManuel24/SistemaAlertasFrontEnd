import React, { useMemo } from 'react';
import { useTable, useGlobalFilter } from 'react-table';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getAlerts } from '../../../api/AlertaAPI';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const PantallaAlertas = () => {
  // Obtener los datos de alertas usando `useQuery`
  const { data: alertas, isLoading, error } = useQuery({
    queryKey: ['alertas'],
    queryFn: getAlerts,
  });

  // Función para aplicar color según el nivel de alerta
  const getIconColor = (level) => {
    switch (level.toLowerCase()) {
      case 'crítico':
        return 'text-red-600';
      case 'advertencia':
        return 'text-yellow-500';
      case 'alerta':
      default:
        return 'text-orange-500';
    }
  };

  // Definir las columnas de la tabla
  const columns = useMemo(() => [
    {
      Header: 'NO.',
      accessor: 'id',
      Cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <FaExclamationTriangle className={`${getIconColor(row.original.level)} mr-2`} />
        </div>
      ),
    },
    { Header: 'Nombre de Alerta', accessor: 'type' },
    { Header: 'Id del sensor', accessor: 'sensorId', Cell: ({ value }) => <div className="text-center">{value}</div> },
    { Header: 'Fecha y Hora', accessor: 'registerDate', Cell: ({ value }) => new Date(value).toLocaleString('es-ES') },
    { Header: 'Nivel', accessor: 'level' },
    { Header: 'Descripción', accessor: 'description' },
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
  } = useTable({ columns, data: alertas || [] }, useGlobalFilter);

  const { globalFilter } = state;

  // Función para descargar el reporte en PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Alertas', doc.internal.pageSize.getWidth() / 2, 16, null, null, 'center');
    doc.setFontSize(12);
    doc.text('Generado el ' + new Date().toLocaleString('es-ES'), 14, 25);
    doc.autoTable({
      startY: 30,
      headStyles: { fillColor: [22, 160, 133] },
      head: [['NO', 'Nombre de Alerta', 'Id del sensor', 'Fecha', 'Nivel', 'Descripción']],
      body: rows.map((row) => [
        row.index + 1,
        row.original.type,
        row.original.sensorId,
        new Date(row.original.registerDate).toLocaleString('es-ES'),
        row.original.level,
        row.original.description,
      ]),
      styles: { cellPadding: 3, fontSize: 10 },
    });
    doc.save('reporte-alertas.pdf');
  };

  // Función para descargar el reporte en Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows.map((row) => ({
      NO: row.index + 1,
      'Nombre de Alerta': row.original.type,
      'Id del Sensor': row.original.sensorId,
      Fecha: new Date(row.original.registerDate).toLocaleString('es-ES'),
      Nivel: row.original.level,
      Descripción: row.original.description,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ReporteAlertas');
    XLSX.writeFile(workbook, 'reporte-alertas.xlsx');
  };

  // Manejar errores y estado de carga
  if (isLoading) {
    return <p className="text-center py-4 text-gray-500">Cargando alertas...</p>;
  }

  if (error) {
    return <p className="text-red-500 font-bold text-center mt-4">Error al cargar las alertas: {error.message}</p>;
  }

  return (
    <div className="p-8 bg-white-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Pantalla de Alertas</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar alerta..."
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
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  key={row.original.alertId || row.index}
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
      </div>
    </div>
  );
};

export default PantallaAlertas;
