import { AxiosError } from "axios";
import { ApiDelivery } from "../sources/remote/api/ApiDelivery";
import { ResponseApiDelivery } from "../sources/remote/models/ResponseApiDelivery";

export class AttendanceRepositoryImpl {

    async clockIn(userId: string): Promise<ResponseApiDelivery> {
        try {
            const response = await ApiDelivery.post<ResponseApiDelivery>('/attendance/clockIn', { user_id: userId });
            return response.data;
        } catch (error) {
            let e = (error as AxiosError);
            return Promise.resolve(e.response?.data as ResponseApiDelivery);
        }
    }

    async clockOut(userId: string): Promise<ResponseApiDelivery> {
        try {
            const response = await ApiDelivery.post<ResponseApiDelivery>('/attendance/clockOut', { user_id: userId });
            return response.data;
        } catch (error) {
            let e = (error as AxiosError);
            return Promise.resolve(e.response?.data as ResponseApiDelivery);
        }
    }

    // Buscar el ÚLTIMO REGISTRO de cualquier tipo (IN o OUT)
    async findLastClockInByUserId(userId: string): Promise<any> {
        try {
            const response = await ApiDelivery.get<ResponseApiDelivery>(`/attendance/user/${userId}`);
            if (response.data.success && response.data.data && response.data.data.length > 0) {
                return response.data.data[0]; 
            }
            return null;
        } catch (error) {
            let e = (error as AxiosError);
            console.error('Error en repositorio al buscar último registro:', e.response?.data);
            return null;
        }
    }

    // Busca el último registro de CLOCK_OUT ***
    async findLastClockOutByUserId(userId: string): Promise<any> {
        try {
            const response = await ApiDelivery.get<ResponseApiDelivery>(`/attendance/user/${userId}`);
            if (response.data.success && response.data.data && response.data.data.length > 0) {
                const clockOutRecords = response.data.data.filter((record: any) => record.event_type === 'CLOCK_OUT');
                if (clockOutRecords.length > 0) {
                    return clockOutRecords[0];
                }
            }
            return null; 
        } catch (error) {
            let e = (error as AxiosError);
            console.error('Error en repositorio al buscar último Clock Out:', e.response?.data);
            return null; 
        }
    }

    // Actualizar el timestamp de un registro de asistencia
    async updateTimestamp(recordId: number, newTimestamp: string, userId: string): Promise<ResponseApiDelivery> {
        try {
            const response = await ApiDelivery.put<ResponseApiDelivery>('/attendance/updateTimestamp', { recordId, newTimestamp, user_id: userId });
            return response.data;
        } catch (error) {
            let e = (error as AxiosError);
            console.error('Error en repositorio al actualizar timestamp:', e.response?.data);
            return Promise.resolve(e.response?.data as ResponseApiDelivery);
        }
    }

    // Eliminar un registro de asistencia (y su par) 
    async deleteRecord(recordId: number, userId: string): Promise<ResponseApiDelivery> {
        try {
            const response = await ApiDelivery.post<ResponseApiDelivery>('/attendance/deleteRecord', { recordId, user_id: userId });
            return response.data;
        } catch (error) {
            let e = (error as AxiosError);
            console.error('Error en repositorio al eliminar registro:', e.response?.data);
            return Promise.resolve(e.response?.data as ResponseApiDelivery);
        }
    }

    async getRecordsByUserId(userId: string): Promise<any[]> {
    try {
          const response = await ApiDelivery.get<ResponseApiDelivery>(`/attendance/user/${userId}`);
          if (response.data.success) {
              return response.data.data;
          }
          return []; 
      } catch (error) {
          let e = (error as AxiosError);
          console.error('Error en repositorio al obtener registros por ID:', e.response?.data);
          return []; 
      }
    }

    async findAllRecords(): Promise<any[]> {
      try {
          const response = await ApiDelivery.get<ResponseApiDelivery>('/attendance/getAll');
          if (response.data.success) {
              return response.data.data;
          }
          return [];
      } catch (error) {
          let e = (error as AxiosError);
          console.error('Error en repositorio al obtener todos los registros:', e.response?.data);
          return [];
      }
    }
}