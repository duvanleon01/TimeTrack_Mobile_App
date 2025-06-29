import { AuthRepositoryImpl } from "../../../Data/repositories/AuthRepositoryImpl"; 
import { User } from "../../entities/User";

// Crea una instancia del repositorio de autenticación
const authRepository = new AuthRepositoryImpl(); 

// Define el caso de uso de registro
export const RegisterAuthUseCase = async (user: User) => {
  // Llama al método 'register' desde la instancia del repositorio
  return await authRepository.register(user); 
};