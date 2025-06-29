import { AuthRepositoryImpl } from "../../../Data/repositories/AuthRepositoryImpl";
import { User } from "../../entities/User";

const { updateUser } = new AuthRepositoryImpl();

export const UpdateUserUseCase = async (user: User) => {
    return await updateUser(user);
};