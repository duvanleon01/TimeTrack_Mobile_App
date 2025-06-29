import { AuthRepositoryImpl } from "../../../Data/repositories/AuthRepositoryImpl";

const { deleteUser } = new AuthRepositoryImpl();

export const DeleteUserUseCase = async (userId: string) => {
    return await deleteUser(userId);
};