import usersDAO from '~/model/DAO/usersDAO';
import mails from './mails';
import { NewUserType, NoPasswordUserType } from '~/types/User';

class UserService {
  async add(newUser: NewUserType): Promise<NoPasswordUserType> {
    try {
      const addedUser = await usersDAO.add(newUser);
      const message = JSON.stringify(addedUser);
      await mails.sendToAdmin(
        `Nuevo usuario: ${addedUser.name}`,
        `<b>Se ha agregado al nuevo usuario</b>: ${message}.`,
      );
      return addedUser;
    } catch (error) {
      throw error;
    }
  }

  async getByEmail(email: string): Promise<NoPasswordUserType | null> {
    return usersDAO.getByEmail(email);
  }

  async getById(id: string): Promise<NoPasswordUserType> {
    return usersDAO.getById(id);
  }

  async login(email: string, password: string): Promise<NoPasswordUserType> {
    return usersDAO.login(email, password);
  }
}

export default new UserService();
