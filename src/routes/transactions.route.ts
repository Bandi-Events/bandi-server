import { Router } from 'express';
import TransactionsController from '@controllers/transactions.controller';
import { CreateTransactionDto } from '@dtos/transactions.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class TransactionsRoute implements Routes {
  public path = '/transactions';
  public router = Router();
  public transactionsController = new TransactionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.transactionsController.getTransactions);
    this.router.get(`${this.path}/user/:id(\\d+)`, this.transactionsController.getTransactionsByUser);
    this.router.get(`${this.path}/:id(\\d+)`, this.transactionsController.getTransactionById);
    this.router.post(`${this.path}`, validationMiddleware(CreateTransactionDto, 'body'), this.transactionsController.createTransaction);
  }
}

export default TransactionsRoute;
