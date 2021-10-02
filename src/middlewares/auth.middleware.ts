import { NextFunction, Response } from 'express';
import config from 'config';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, UserRequest } from '@interfaces/auth.interface';
import { ERROR_MESSAGES } from '@constants/errors';

const authMiddleware = async (req: UserRequest, _res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || req.header('Authorization').split('Bearer ')[1] || null;

    if (Authorization) {
      const secretKey: string = config.get('secretKey');
      const verificationResponse = (await jwt.verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse.id;
      const users = new PrismaClient().user;
      const findUser = await users.findUnique({ where: { id: Number(userId) } });

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, ERROR_MESSAGES.unauthorized));
      }
    } else {
      next(new HttpException(404, ERROR_MESSAGES.tokenMissing));
    }
  } catch (error) {
    next(new HttpException(401, ERROR_MESSAGES.unauthorized));
  }
};

export default authMiddleware;
