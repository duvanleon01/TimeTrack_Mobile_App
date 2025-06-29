import { User } from "../entities/User";
import { ResponseApiDelivery } from "../../Data/sources/remote/models/ResponseApiDelivery";

export interface AuthRepository {
  login(email: string, password: string): Promise<ResponseApiDelivery>; 
  register(user: User): Promise<ResponseApiDelivery>;
}