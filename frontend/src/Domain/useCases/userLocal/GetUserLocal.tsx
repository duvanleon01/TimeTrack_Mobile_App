import { UserLocalRepositoryImpl } from '../../../Data/repositories/UserLocalRepositoryImpl';

const { getUser } = new UserLocalRepositoryImpl(); 

export const GetUserLocalUseCase = async() => {
    return await getUser(); 
};