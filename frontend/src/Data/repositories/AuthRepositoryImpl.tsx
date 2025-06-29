import { AxiosError } from "axios";
import { User } from "../../Domain/entities/User";
import { AuthRepository } from "../../Domain/repositories/AuthRepository";
import { ApiDelivery } from "../sources/remote/api/ApiDelivery";
import { ResponseApiDelivery } from "../sources/remote/models/ResponseApiDelivery";

export class AuthRepositoryImpl implements AuthRepository {
    async register(user: User): Promise<ResponseApiDelivery> {
        try {
            const response = await ApiDelivery.post<ResponseApiDelivery>('/users/create', user);
            return response.data;
        } catch (error) {
            let e = (error as AxiosError);
            console.log('Error: ' + JSON.stringify(e.response?.data));
            const apiError: ResponseApiDelivery = JSON.parse(JSON.stringify(e.response?.data));
            return Promise.resolve(apiError);
        }
    }

    async login(email: string, password: string): Promise<ResponseApiDelivery> {
        try {
            const response = await ApiDelivery.post<ResponseApiDelivery>('/users/login', { email, password });
            console.log('API Response:', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            let e = (error as AxiosError);
            console.log('API Error:', JSON.stringify(e.response?.data));
            return Promise.resolve(e.response?.data as ResponseApiDelivery);
        }
    }

    async findAll(): Promise<any[]> {
        try {
            const response = await ApiDelivery.get<ResponseApiDelivery>('/users/getAll');
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            let e = (error as AxiosError);
            console.error('Error en repositorio al obtener todos los usuarios:', e.response?.data);
            return [];
        }
    }

    async deleteUser(userId: string): Promise<ResponseApiDelivery> {
        try {
            const response = await ApiDelivery.delete<ResponseApiDelivery>(`/users/delete/${userId}`);
            return response.data;
        } catch (error) {
            let e = (error as AxiosError);
            console.error('Error en repositorio al eliminar usuario:', e.response?.data);
            return Promise.resolve(e.response?.data as ResponseApiDelivery);
        }
    }

    async updateUser(user: User): Promise<ResponseApiDelivery> {
        try {
            const response = await ApiDelivery.put<ResponseApiDelivery>('/users/update', user);
            return response.data;
        } catch (error) {
            let e = (error as AxiosError);
            console.error('Error en repositorio al actualizar usuario:', e.response?.data);
            return Promise.resolve(e.response?.data as ResponseApiDelivery);
        }
    }
}