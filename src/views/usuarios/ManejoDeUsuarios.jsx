import React from 'react';
import { useTable, useGlobalFilter } from 'react-table';
import { FaTrash, FaEdit, FaEye, FaUserPlus } from 'react-icons/fa'; // Íconos para acciones
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser } from '../../../api/AuthAPI';
import Swal from 'sweetalert2';

const ManejoDeUsuarios = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

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
        deleteUser(id)
          .then(() => {
            Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
            queryClient.invalidateQueries('users');
          })
          .catch((error) => Swal.fire('Error', error.message, 'error'));
      }
    });
  };

  // Definir las columnas de la tabla
  const columns = React.useMemo(
    () => [
      {
        Header: 'Correo Electrónico',
        accessor: 'correoElectronico', // Correo del usuario
      },
      {
        Header: 'Rol',
        accessor: 'derechosUsuario', // Rol del usuario
        Cell: ({ value }) => <div className="text-center">{value}</div>,
      },
      {
        Header: 'Acciones',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => navigate(`/usuarios/view/${row.original.id}`)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <FaEye className="mr-1" /> Ver
            </button>
            <button
              onClick={() => navigate(`/usuarios/edit/${row.original.id}`)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <FaEdit className="mr-1" /> Editar
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <FaTrash className="mr-1" /> Eliminar
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  // Inicializar la tabla con los datos obtenidos
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data: users || [] }, useGlobalFilter);

  const { globalFilter } = state;

  if (error) {
    return (
      <p className="text-red-500 font-bold text-center mt-4">
        Error al cargar los usuarios: {error.message}
      </p>
    );
  }

  return (
    <div className="p-8 bg-white-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Gestión de Usuarios
      </h1>
      <div className="flex justify-between items-center mb-6">
        <input
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar usuario..."
          className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={() => navigate('/usuarios/create')}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105 flex items-center"
        >
          <FaUserPlus className="mr-2" /> Crear Usuario
        </button>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        {isLoading ? (
          <p className="text-center py-4 text-gray-500">Cargando usuarios...</p>
        ) : users && users.length > 0 ? (
          <table {...getTableProps()} className="min-w-full bg-white rounded-lg">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={headerGroup.id}
                  className="bg-blue-500 text-white text-lg font-semibold"
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      key={column.id}
                      className="py-4 px-6 text-center"
                    >
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
                    key={row.original.id}
                    className={`border-b ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    } hover:bg-gray-100 transition-colors duration-200`}
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className="py-4 px-6 text-center"
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <h1 className="text-center text-2xl font-bold mb-5 text-gray-500 py-6">
            Sin usuarios registrados
          </h1>
        )}
      </div>
    </div>
  );
};

export default ManejoDeUsuarios;
