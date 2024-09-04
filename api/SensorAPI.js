import api from "../src/config/axios";
import { isAxiosError } from "axios";

// Crear un sensor
export async function createSensor(formData) {
    try {
        const token = localStorage.getItem('AUTH_TOKEN');
        const { data } = await api.post('/api/sensores', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Error desconocido durante la creación del sensor");
        }
    }
}

// Obtener todos los sensores
export async function getSensors() {
    try {
        const token = localStorage.getItem('AUTH_TOKEN');
        const { data } = await api.get('/api/sensores', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Error desconocido durante la obtención de sensores");
        }
    }
}

// Obtener un sensor por ID
export async function getSensorById(id) {
    try {
        const token = localStorage.getItem('AUTH_TOKEN');
        const { data } = await api.get(`/api/sensores/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Error desconocido durante la obtención del sensor");
        }
    }
}

// Actualizar un sensor
export async function updateSensor(id, formData) {
    try {
        const token = localStorage.getItem('AUTH_TOKEN');
        const { data } = await api.put(`/api/sensores/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Error desconocido durante la actualización del sensor");
        }
    }
}

// Eliminar un sensor
export async function deleteSensor(id) {
    try {
        const token = localStorage.getItem('AUTH_TOKEN');
        await api.delete(`/api/sensores/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Error desconocido durante la eliminación del sensor");
        }
    }
}
