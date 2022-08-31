import bcrypt from 'bcrypt';
import { isNull, omit } from 'lodash';

import UserORM from '~/model/ORM/UserORM';
import { NewUserType, NoPasswordUserType } from '~/types/User';

class UserDAO {
  async add(newUser: NewUserType): Promise<NoPasswordUserType> {
    try {
      const existingUser = await this.getByEmail(newUser.email);
      if (existingUser) {
        throw new Error('User already exists.');
      }
      const newUserData = { ...newUser };
      const { password } = newUserData;
      newUserData.password = bcrypt.hashSync(password, 5);
      const addedUser = new UserORM(newUserData);
      await addedUser.save();
      const parsedUser = addedUser.toObject();
      return omit(parsedUser, 'password');
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<any> {
    const result = await UserORM.find();
    return result;
  }

  async getByEmail(email: string): Promise<NoPasswordUserType | null> {
    try {
      const foundUser = await UserORM.findOne({ email });
      if (!foundUser) {
        return null;
      }
      const parsedUser = foundUser.toObject();
      return omit(parsedUser, 'password');
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string): Promise<NoPasswordUserType> {
    try {
      const user = await UserORM.findOne({ _id: id });
      if (!user) {
        throw new Error('ELEMENT_NOT_FOUND');
      }
      const parsedUser = user.toObject();
      return omit(parsedUser, 'password');
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<NoPasswordUserType> {
    try {
      const user = await UserORM.findOne({ email });
      if (isNull(user)) {
        throw new Error(`Invalid email or password.`);
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        throw new Error(`Invalid email or password.`);
      }
      return omit(user, 'password');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new UserDAO();
