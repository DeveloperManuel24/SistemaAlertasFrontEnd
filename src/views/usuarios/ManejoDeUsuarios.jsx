import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser } from '../../../api/AuthAPI';
import Swal from 'sweetalert2';

export default function ManejoDeUsuarios() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  console.log('Usuarios obtenidos de la API:', users);

  if (isLoading) return 'Cargando...';

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
            queryClient.invalidateQueries('users'); // Refresca la lista de usuarios después de eliminar
          })
          .catch(error => Swal.fire('Error', error.message, 'error'));
      }
    });
  };

  return (
    <>
      <h1 className="text-5xl font-black">Gestión de Usuarios</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">Administra tus usuarios</p>

      <nav className="my-5">
        <button
          onClick={() => navigate('/usuarios/create')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Crear Usuario
        </button>
      </nav>

      {users?.length ? (
        <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg">
          {users.map((user) => (
            <li key={user.id} className="flex justify-between gap-x-6 px-5 py-10">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto space-y-2">
                  <p 
                    className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                    onClick={() => navigate(`/usuarios/view/${user.id}`)}
                  >
                    {user.correoElectronico}
                  </p>
                  <p className="text-sm text-gray-400">
                    Rol: {user.derechosUsuario}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                <Menu as="div" className="relative flex-none">
                  <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                  </Menu.Button>
                  <Transition as={Fragment} enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items
                      className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                    >
                      <Menu.Item>
                        <button onClick={() => navigate(`/usuarios/view/${user.id}`)}
                          className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                          Ver Usuario
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button onClick={() => navigate(`/usuarios/edit/${user.id}`)}
                          className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                          Editar Usuario
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button
                          type='button'
                          className='block px-3 py-1 text-sm leading-6 text-red-500'
                          onClick={() => handleDelete(user.id)}
                        >
                          Eliminar Usuario
                        </button>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center py-20">No hay usuarios disponibles.</p>
      )}
    </>
  );
}
