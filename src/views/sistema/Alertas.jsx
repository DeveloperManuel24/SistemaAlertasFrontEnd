import React, { useMemo } from 'react';
import { useTable, useGlobalFilter } from 'react-table';
import { FaExclamationTriangle } from 'react-icons/fa';  // Ícono para las alertas
import { useQuery } from '@tanstack/react-query';
import { getAlerts } from '../../../api/AlertaAPI';  // Ruta de tu API para obtener alertas
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const PantallaAlertas = () => {
  // Usar `useQuery` para obtener los datos de las alertas
  const { data: alertas, isLoading, error } = useQuery({
    queryKey: ['alertas'],
    queryFn: getAlerts,  // Usamos la función que me pasaste para obtener todas las alertas
  });

  // Función para aplicar color según el nivel de alerta
  const getIconColor = (level) => {
    switch (level.toLowerCase()) {
      case 'crítico':
        return 'text-red-600'; // Rojo para "Crítico"
      case 'advertencia':
        return 'text-yellow-500'; // Amarillo para "Advertencia"
      case 'alerta':
      default:
        return 'text-orange-500'; // Naranja para "Alerta"
    }
  };

  // Definir las columnas de la tabla
  const columns = useMemo(() => [
    {
      Header: 'NO.',
      accessor: 'id', // Campo adecuado para mostrar el ID o número de alerta
      Cell: ({ row }) => (
        <div className="flex items-center">
          <FaExclamationTriangle className={`${getIconColor(row.original.level)} mr-2`} />
        </div>
      ),
    },
    { Header: 'Nombre de Alerta', accessor: 'type' }, // Ajustar según el nombre de tu campo
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

    // Encabezado centrado con estilo
    doc.setFontSize(18);
    doc.text('Reporte de Alertas', doc.internal.pageSize.getWidth() / 2, 16, null, null, 'center');

    // Espacio antes de la tabla
    doc.setFontSize(12);
    doc.text('Generado el ' + new Date().toLocaleString('es-ES'), 14, 25);

    // Generar la tabla con un estilo mejorado
    doc.autoTable({
      startY: 30, // Esto asegura que la tabla comience un poco más abajo del título
      headStyles: { fillColor: [22, 160, 133] }, // Cambiar color del encabezado de la tabla
      head: [['NO', 'Nombre de Alerta', 'Id del sensor', 'Fecha', 'Nivel', 'Descripción']],
      body: rows.map((row) => [
        row.index + 1,
        row.original.type,
        row.original.sensorId,
        new Date(row.original.registerDate).toLocaleString('es-ES'),
        row.original.level,
        row.original.description,
      ]),
      styles: { cellPadding: 3, fontSize: 10 }, // Ajustar el padding y tamaño de la fuente
    });

    doc.save('reporte-alertas.pdf');
  };

  // Función para descargar el reporte en Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows.map((row) => ({
      NO: row.index + 1,
      'Nombre de Alerta': row.original.type,
      'Id del sensor': row.original.sensorId,
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
    return <p>Cargando alertas...</p>;
  }

  if (error) {
    return <p>Error al cargar las alertas: {error.message}</p>;
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Pantalla de Alertas</h1>
      <div className="flex justify-between mb-4">
        <input
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar alerta..."
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
                <tr {...row.getRowProps()} key={row.original.alertId || row.index} className="border-b">
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

export default PantallaAlertas;
