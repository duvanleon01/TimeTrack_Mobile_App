import { UserLocalRepositoryImpl } from '../../../Data/repositories/UserLocalRepositoryImpl';
import { User } from '../../entities/User';

const { remove } = new UserLocalRepositoryImpl(); 

export const RemoveUserLocalUseCase = async() => {
    return await remove(); 
};