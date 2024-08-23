import React, { useMemo, useState } from 'react';
import { useTable, useGlobalFilter } from 'react-table';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ManejoDeSensor = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([
    { id: 1, type: 'Grave', location: 'Sector 1', status: 'Activo' },
    { id: 2, type: 'Moderado', location: 'Sector 2', status: 'Inactivo' },
    // Añade más sensores aquí...
  ]);

  const handleDelete = (id) => {
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
        setData(data.filter((sensor) => sensor.id !== id));
        Swal.fire('Eliminado!', 'El sensor ha sido eliminado.', 'success');
      }
    });
  };

  const columns = useMemo(() => [
    { Header: 'NO.', accessor: 'id' },
    { Header: 'Tipo de Alerta', accessor: 'type' },
    { Header: 'Localidad', accessor: 'location' },
    { Header: 'Estatus', accessor: 'status' },
    {
      Header: 'Acciones',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/sensores/view/${row.original.id}`)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaEye className="mr-1" /> View
          </button>
          <button
            onClick={() => navigate(`/sensores/edit/${row.original.id}`)}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaEdit className="mr-1" /> Edit
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaTrash className="mr-1" /> Delete
          </button>
        </div>
      ),
    },
  ], [data, navigate]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter);

  const { globalFilter } = state;

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

export default ManejoDeSensor;
