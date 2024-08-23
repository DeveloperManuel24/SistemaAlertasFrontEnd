import api from "../src/config/axios";
import { isAxiosError } from "axios";

// Crear una cuenta nueva
export async function createAccount(formData) {
    try {
        const url = '/usuarios/registrar';
        const { data } = await api.post(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// Autenticar a un usuario (Login)
export async function authenticateUser(formData) {
    try {
        const url = '/usuarios/Login';
        console.log("Final URL:", api.defaults.baseURL + url); // Verifica que la URL final sea correcta
        const { data } = await api.post(url, formData);
        localStorage.setItem('AUTH_TOKEN', data.token);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Error desconocido durante la autenticación");
        }
    }
}

// Obtener todos los usuarios (Requiere ser admin)
export async function getUsers() {
    try {
        const token = localStorage.getItem('AUTH_TOKEN');

        const { data } = await api.get('/usuarios/usuarios', {            
            
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        console.error('Error al obtener usuarios:', error); // Mostrar el error en la consola
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}


// Obtener un usuario por ID (Requiere ser admin)
export async function getUserById(id) {
    try {
        const { data } = await api.get(`/usuarios/usuarios/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('AUTH_TOKEN')}`,
            },
        });
        console.log('AAAAAAAAAAAAA',data);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// Actualizar un usuario (Requiere ser admin)
export async function updateUser(id, formData) {
    try {
        const { data } = await api.put(`/usuarios/usuarios/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('AUTH_TOKEN')}`,
            },
        });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// Eliminar un usuario (Requiere ser admin)
export async function deleteUser(id) {
    try {
        await api.delete(`/usuarios/usuarios/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('AUTH_TOKEN')}`,
            },
        });
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// Asignar rol a un usuario (Requiere ser admin)
export async function assignRole(formData) {
    try {
        const url = '/usuarios/asignar-rol';
        const { data } = await api.post(url, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('AUTH_TOKEN')}`,
            },
        });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// Remover rol de admin a un usuario (Requiere ser admin)
export async function removeAdminRole(formData) {
    try {
        const url = '/usuarios/remover-rol-admin';
        const { data } = await api.post(url, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('AUTH_TOKEN')}`,
            },
        });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

// Hook para obtener los datos de autenticación del usuario
import { useQuery } from '@tanstack/react-query';

export const useAuth = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUserById("currentUserId"), // Reemplaza "currentUserId" con la lógica para obtener el ID del usuario actual
        retry: 1,
        refetchOnWindowFocus: false,
    });

    return { data, isError, isLoading };
};
