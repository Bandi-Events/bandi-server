import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';
import { CreateUserDto } from '@dtos/users.dto';
import userService from '@services/users.service';

class UsersController {
  public userService = new userService();

  public getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: Partial<User>[] = await this.userService.findAllUser();

      res.status(200).json({ data: userData });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData: Partial<User> = await this.userService.findUserById(userId);

      res.status(200).json({ data: userData });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const newUser: User = await this.userService.createUser(userData);

      res.status(201).json({ data: newUser });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData: CreateUserDto = req.body;
      const updatedUser: User = await this.userService.updateUser(userId, userData);

      res.status(200).json({ data: updatedUser });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const deletedUser: User = await this.userService.deleteUser(userId);

      res.status(200).json({ data: deletedUser });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
