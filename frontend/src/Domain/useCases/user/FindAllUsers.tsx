import { AuthRepositoryImpl } from "../../../Data/repositories/AuthRepositoryImpl";

const { findAll } = new AuthRepositoryImpl();

export const FindAllUsersUseCase = async () => {
    return await findAll();
};