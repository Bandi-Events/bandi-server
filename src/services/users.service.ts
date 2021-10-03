import bcrypt from 'bcrypt';

import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { ERROR_MESSAGES } from '@constants/errors';

class UserService {
  public users = new PrismaClient().user;

  public async findAllUser(): Promise<Partial<User>[]> {
    const allUsers: Partial<User>[] = await this.users.findMany({ select: { email: true } });

    return allUsers;
  }

  public async findUserById(userId: number): Promise<Partial<User>> {
    if (isEmpty(userId)) throw new HttpException(400, ERROR_MESSAGES.invalidBody);

    const findUser: Partial<User> = await this.users.findUnique({ select: { email: true }, where: { id: userId } });

    if (!findUser) throw new HttpException(409, ERROR_MESSAGES.notFound);

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, ERROR_MESSAGES.invalidBody);

    const findUser: User = await this.users.findUnique({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.users.create({ data: { ...userData, password: hashedPassword } });

    return createUserData;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, ERROR_MESSAGES.invalidBody);

    const findUser: User = await this.users.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, ERROR_MESSAGES.notFound);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const updateUserData = await this.users.update({ where: { id: userId }, data: { ...userData, password: hashedPassword } });

    return updateUserData;
  }

  public async deleteUser(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, ERROR_MESSAGES.invalidBody);

    const findUser: User = await this.users.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, ERROR_MESSAGES.notFound);

    const deleteUserData = await this.users.delete({ where: { id: userId } });

    return deleteUserData;
  }
}

export default UserService;
