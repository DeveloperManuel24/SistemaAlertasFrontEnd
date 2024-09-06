import { useState } from "react";  // Necesitamos usar useState para controlar la visibilidad de la contraseña
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "../../components/ErrorMessage";
import { authenticateUser } from "../../../api/AuthAPI"; 
import { FaEye, FaEyeSlash } from "react-icons/fa";  // Importamos los iconos de ojo
import Swal from "sweetalert2";

export default function Login() {

  const [showPassword, setShowPassword] = useState(false);  // Estado para controlar si la contraseña es visible o no

  const initialValues = {
    email: '',
    password: '',
  };

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: authenticateUser,
    onError: (error) => {
      console.log(error.message);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Hubo un problema al iniciar sesión',
        confirmButtonText: 'Intentar de nuevo'
      });
    },
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Iniciaste sesión correctamente',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate('/');
      });
    }
  });

  const handleLogin = (formData) => {
    // Ajustar el formData para que coincida con lo que espera el backend
    const payload = {
      correoElectronico: formData.email,
      password: formData.password
    };
    mutate(payload);
  };

  return (
    <>
      <h1 className="text-5xl font-black text-white">Iniciar Sesión</h1>
      <p className="text-2xl font-light text-white mt-5">
        Empieza a controlar mejor el agua potable. {''}
        <span className="text-sky-500 font-bold">Iniciando sesión en este formulario</span>
      </p>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-8 p-10 mt-10 bg-white"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Password</label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}  // Cambiar el tipo de input según el estado
              placeholder="Password de Registro"
              className="w-full p-3 border-gray-300 border"
              {...register("password", {
                required: "El Password es obligatorio",
              })}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}  // Alternar el estado
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}  {/* Cambiar el ícono */}
            </span>
          </div>
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Iniciar Sesión'
          className="bg-sky-600 hover:bg-sky-700 w-full p-3 text-white font-black text-xl cursor-pointer"
        />
      </form>
    </>
  );
}
