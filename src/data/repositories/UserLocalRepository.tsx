import { User } from "../../domain/entities/User";
import { UserLocalRepository } from "../../domain/repositories/UserLocalRepository";
import { LocalStorage } from "../sources/local/LocalStorage";

export class UserLocalRepositoryImp implements UserLocalRepository {
  async save(user: User): Promise<void> {
    const { save } = LocalStorage();
    await save('user_giveandgo', JSON.stringify(user));
  }

  async getUser(): Promise<User | null> {
    const { getItem } = LocalStorage();
    const data = await getItem('user_giveandgo');
    if (!data) return null;
    try {
      const user: User = JSON.parse(data);
      return user;
    } catch {
      return null;
    }
  }

  async remove(): Promise<void> {
    const { remove } = LocalStorage();
    await remove('user_giveandgo');
  }
}
