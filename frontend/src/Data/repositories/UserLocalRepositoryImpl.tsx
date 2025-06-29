import { User } from "../../Domain/entities/User";
import { UserLocalRepository } from "../../Domain/repositories/UserLocalRepository";
import { LocalStorage } from "../sources/local/LocalStorage";

export class UserLocalRepositoryImpl implements UserLocalRepository {
    async save(user: User): Promise<void> {
        const { save } = LocalStorage(); 
        await save('user', JSON.stringify(user));
    }

    async getUser(): Promise<User | null> {
        const { getItem } = LocalStorage();
        const data = await getItem('user');
        if (data) {
            const user: User = JSON.parse(data);
            return user;
        }
        return null;
    }

    async remove(): Promise<void> {
        const { remove } = LocalStorage(); 
        await remove('user'); 
    }
}