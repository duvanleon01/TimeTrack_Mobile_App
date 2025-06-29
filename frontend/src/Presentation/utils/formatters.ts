import moment from 'moment';

// Función para formatear un timestamp ISO a un formato de fecha y hora local legible
export const formatTimestamp = (timestamp: string | Date | null | undefined): string => {
    if (!timestamp) {
        return 'N/A';
    }
    // Usa moment para parsear el timestamp y luego formatearlo a un string local
    return moment(timestamp).format('DD/MM/YYYY, hh:mm A');
};