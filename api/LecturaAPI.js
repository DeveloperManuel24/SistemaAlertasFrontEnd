import api from "../src/config/axios";
import { isAxiosError } from "axios";

// Crear una lectura
export async function createReading(formData) {
    try {
        const { data } = await api.post('/lecturas/lecturas', formData);
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
        const { data } = await api.get('/lecturas/lecturas');
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
        const { data } = await api.get(`/lecturas/lecturas/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Error desconocido durante la obtención de la lectura");
        }
    }
}
