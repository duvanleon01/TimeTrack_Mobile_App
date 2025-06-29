import { AuthRepositoryImpl } from "../../../Data/repositories/AuthRepositoryImpl";

// Crea una instancia del repositorio de autenticación
const { login } = new AuthRepositoryImpl();

// Define el caso de uso de login
export const LoginAuthUseCase = async (email: string, password: string) => {
  // Llama a la lógica del repositorio para realizar la petición a la API
  return await login(email, password);
};