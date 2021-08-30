import { NextFunction, Request, Response } from 'express';
import { Transaction } from '@prisma/client';
import { CreateTransactionDto } from '@dtos/transactions.dto';
import transactionsService from '@services/transactions.service';

class TransactionsController {
  public transactionsService = new transactionsService();

  public getTransactions = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactionData: Transaction[] = await this.transactionsService.findAllTransactions();

      res.status(200).json({ data: transactionData });
    } catch (error) {
      next(error);
    }
  };

  public getTransactionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactionId = Number(req.params.id);
      const transactionData: Transaction = await this.transactionsService.findTransactionById(transactionId);

      res.status(200).json({ data: transactionData });
    } catch (error) {
      next(error);
    }
  };

  public getTransactionsByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.user_id);
      const userTransaction: Transaction[] = await this.transactionsService.findAllUserTransactions(userId);

      res.status(200).json({ data: userTransaction });
    } catch (error) {
      next(error);
    }
  };

  public createTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactionData: CreateTransactionDto = req.body;
      const newTransaction: Transaction = await this.transactionsService.createTransaction(transactionData);

      res.status(201).json({ data: newTransaction });
    } catch (error) {
      next(error);
    }
  };
}

export default TransactionsController;
