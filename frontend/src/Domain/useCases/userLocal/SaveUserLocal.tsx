import { UserLocalRepositoryImpl } from '../../../Data/repositories/UserLocalRepositoryImpl';
import { User } from '../../entities/User';

const { save } = new UserLocalRepositoryImpl(); 

export const SaveUserUseCase = async(user: User) => {
    return await save(user); 
};