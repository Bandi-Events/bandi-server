import { Router } from 'express';
import BalancesController from '@/controllers/balances.controller';
import { CreateBalanceDto } from '@dtos/balances.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class BalancesRoute implements Routes {
  public path = '/balances';
  public router = Router();
  public balancesController = new BalancesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.balancesController.getBalances);
    this.router.get(`${this.path}/user/:id(\\d+)`, this.balancesController.getUserBalance);
    this.router.get(`${this.path}/:id(\\d+)`, this.balancesController.getBalanceById);
    this.router.post(`${this.path}`, validationMiddleware(CreateBalanceDto, 'body'), this.balancesController.createOrUpdateBalance);
  }
}

export default BalancesRoute;
