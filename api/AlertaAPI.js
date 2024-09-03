import api from "../src/config/axios";
import { isAxiosError } from "axios";

// Obtener todas las alertas
export async function getAlerts() {
    try {
        const { data } = await api.get('/alertas/alertas');
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Error desconocido durante la obtención de alertas");
        }
    }
}

// Obtener una alerta por ID
export async function getAlertById(id) {
    try {
        const { data } = await api.get(`/alertas/alertas/${id}`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Error desconocido durante la obtención de la alerta");
        }
    }
}
