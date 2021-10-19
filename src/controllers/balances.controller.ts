import { NextFunction, Request, Response } from 'express';
import { Balance } from '@prisma/client';
import { CreateBalanceDto } from '@dtos/balances.dto';
import balanceService from '@/services/balances.service';

class BalancesController {
  public balancesService = new balanceService();

  public getBalances = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const balanceData: Balance[] = await this.balancesService.findAllBalances();

      res.status(200).json({ data: balanceData });
    } catch (error) {
      next(error);
    }
  };

  public getBalanceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const balanceId = Number(req.params.id);
      const balanceData: Balance = await this.balancesService.findBalanceById(balanceId);

      res.status(200).json({ data: balanceData });
    } catch (error) {
      next(error);
    }
  };

  public getUserBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.user_id);
      const userBalance: Balance = await this.balancesService.findBalanceForUser(userId);

      res.status(200).json({ data: userBalance });
    } catch (error) {
      next(error);
    }
  };

  public createOrUpdateBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const balanceData: CreateBalanceDto = req.body;
      const userId = balanceData.userId;
      const userBalance: Balance = await this.balancesService.findBalanceForUser(userId);

      if (!userBalance) {
        const newBalance: Balance = await this.balancesService.createBalance(balanceData);
        res.status(201).json({ data: newBalance });
      } else {
        const updatedBalance: Balance = await this.balancesService.updateBalance(userId, balanceData);
        res.status(200).json({ data: updatedBalance });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default BalancesController;
