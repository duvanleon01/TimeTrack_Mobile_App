import { AxiosError } from "axios";
import { User } from "../../Domain/entities/User";
import { AuthRepository } from "../../Domain/repositories/AuthRepository";
import { ApiDelivery } from "../sources/remote/api/ApiDelivery";
import { ResponseApiDelivery } from "../sources/remote/models/ResponseApiDelivery";

export class AuthRepositoryImpl implements AuthRepository {

  async register(user: User): Promise<ResponseApiDelivery> {
    try {
      const response = await ApiDelivery.post<ResponseApiDelivery>('/users/create', user);
      console.log('RESPONSE: ' + JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      let e = (error as AxiosError);
      console.log('Error: ' + JSON.stringify(e.response?.data));
      return Promise.resolve(e.response?.data as ResponseApiDelivery);
    }
  }

  // *** IMPLEMENTACIÓN DEL MÉTODO DE LOGIN (NUEVA) ***
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
}