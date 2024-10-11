import api from "../src/config/axios";
import { isAxiosError } from "axios";

// Crear un sensor
export async function createSensor(formData) {
    try {
        const token = localStorage.getItem('AUTH_TOKEN');
        if (!token) throw new Error("No se encontró el token de autenticación");

        const { data } = await api.post('/api/sensores', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        return manejarError(error, "Error desconocido durante la creación del sensor");
    }
}

// Obtener todos los sensores
export async function getSensors() {
    try {
        const token = localStorage.getItem('AUTH_TOKEN');
        if (!token) throw new Error("No se encontró el token de autenticación");

        const { data } = await api.get('/api/sensores', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        return manejarError(error, "Error desconocido durante la obtención de sensores");
    }
}

// Obtener un sensor por ID
export async function getSensorById(id) {
    try {
        const token = localStorage.getItem('AUTH_TOKEN');
        if (!token) throw new Error("No se encontró el token de autenticación");

        const { data } = await api.get(`/api/sensores/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        return manejarError(error, "Error desconocido durante la obtención del sensor");
    }
}

// Actualizar un sensor
export async function updateSensor(id, formData) {
    try {
        const token = localStorage.getItem('AUTH_TOKEN');
        if (!token) throw new Error("No se encontró el token de autenticación");

        const { data } = await api.put(`/api/sensores/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        return manejarError(error, "Error desconocido durante la actualización del sensor");
    }
}

// Eliminar un sensor
export async function deleteSensor(id) {
    try {
        const token = localStorage.getItem('AUTH_TOKEN');
        if (!token) throw new Error("No se encontró el token de autenticación");

        await api.delete(`/api/sensores/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        return manejarError(error, "Error desconocido durante la eliminación del sensor");
    }
}

// Función para manejar los errores de Axios
function manejarError(error, mensajePorDefecto) {
    if (isAxiosError(error) && error.response) {
        console.error('Error Axios:', error.response.data);
        throw new Error(error.response.data.error || mensajePorDefecto);
    } else {
        console.error('Error desconocido:', error);
        throw new Error(mensajePorDefecto);
    }
}
