import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createAccount, updateUser, assignRole, removeAdminRole, getUserById } from '../../api/AuthAPI';
import ErrorMessage from '../components/ErrorMessage';

const FormularioUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [originalRole, setOriginalRole] = useState(''); // Almacena el rol original del usuario

  const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm({
    mode: 'onChange', // Esto permite que se valide mientras se escribe
    defaultValues: {
      correoElectronico: '',
      password: '',
      tipoClaim: '',
    }
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const userData = await getUserById(id);
          setValue('correoElectronico', userData.correoElectronico);
          setValue('tipoClaim', userData.derechosUsuario === 'Administrador' ? 'esadmin' : 'Usuario General');
          setOriginalRole(userData.derechosUsuario);
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error.message);
        }
      }
    };

    fetchUserData();
  }, [id, setValue]);

  const onSubmit = async (formData) => {
    try {
      if (id) {
        await updateUser(id, { correoElectronico: formData.correoElectronico, password: formData.password });

        // Manejar la asignación o remoción de roles
        if (formData.tipoClaim !== originalRole) {
          if (originalRole === 'Administrador' && formData.tipoClaim !== 'esadmin') {
            // Remover rol de administrador
            await removeAdminRole({ correoElectronico: formData.correoElectronico });
          } else if (formData.tipoClaim === 'esadmin') {
            // Asignar rol de administrador
            await assignRole({ correoElectronico: formData.correoElectronico, tipoClaim: 'esadmin' });
          }
        }
      } else {
        await createAccount({ correoElectronico: formData.correoElectronico, password: formData.password });

        // Asignar rol después de la creación
        if (formData.tipoClaim) {
          await assignRole({ correoElectronico: formData.correoElectronico, tipoClaim: formData.tipoClaim });
        }
      }

      // Redirigir a la lista de usuarios después de guardar o actualizar
      navigate('/usuarios');
    } catch (error) {
      console.error('Error al guardar el usuario:', error.message);
      navigate('/usuarios');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Usuario' : 'Crear Usuario'}</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            {...register("correoElectronico", {
              required: "El correo electrónico es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Correo electrónico no válido",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.correoElectronico && <ErrorMessage>{errors.correoElectronico.message}</ErrorMessage>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contraseña</label>
          <input
            type="password"
            {...register("password", {
              required: !id ? "La contraseña es obligatoria" : false,
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
                message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder={id ? 'Dejar en blanco para no cambiar' : 'Ingrese una contraseña'}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Rol</label>
          <select
            {...register("tipoClaim", {
              required: "El rol es obligatorio",
            })}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Selecciona un rol</option>
            <option value="esadmin">Administrador</option>
            <option value="Usuario General">Usuario General</option>
          </select>
          {errors.tipoClaim && <ErrorMessage>{errors.tipoClaim.message}</ErrorMessage>}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!isValid && !id ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isValid && !id} // Deshabilitar el botón solo si el formulario no es válido y no estamos en modo edición
          >
            {id ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
      <button
        onClick={() => navigate('/usuarios')}
        className="bg-blue-500 hover:bg-blue-700 mt-8 text-white font-bold py-2 px-4 rounded mx-auto block"
      >
        Volver a la lista de usuarios
      </button>
    </>
  );
};

export default FormularioUsuario;
