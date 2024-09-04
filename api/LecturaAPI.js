import api from "../src/config/axios";
import { isAxiosError } from "axios";

// Obtener el token almacenado en localStorage
const getToken = () => localStorage.getItem('AUTH_TOKEN');

// Crear una lectura
export async function createReading(formData) {
    try {
        const token = getToken();
        const { data } = await api.post('/lecturas/lecturas', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Error desconocido durante la creación de la lectura");
        }
    }
}

// Obtener todas las lecturas
export async function getReadings() {
    try {
        const token = getToken();
        const { data } = await api.get('/lecturas/lecturas', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Error desconocido durante la obtención de lecturas");
        }
    }
}

// Obtener una lectura por ID
export async function getReadingById(id) {
    try {
        const token = getToken();
        const { data } = await api.get(`/lecturas/lecturas/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Error desconocido durante la obtención de la lectura");
        }
    }
}
