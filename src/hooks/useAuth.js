import { useQuery } from '@tanstack/react-query';
import { getUserById } from "@/api/AuthAPI";

export const useAuth = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUserById("currentUserId"), // Reemplaza "currentUserId" con la lógica para obtener el ID del usuario actual
        retry: 1,
        refetchOnWindowFocus: false,
    });

    return { data, isError, isLoading };
};
