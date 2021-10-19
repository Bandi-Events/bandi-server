import { getMockReq, getMockRes } from '@jest-mock/express';

import TransactionsService from '@services/transactions.service';
import TransactionsController from '../transactions.controller';

const MOCK_TRANSACTON = {
  id: 1,
  userId: 1,
  amount: 3.0,
  date: new Date(),
};
const MOCK_ERROR = new Error('unexpected error occured');

describe('transactions.controller', () => {
  let transactionsController, req, res, next;

  beforeEach(() => {
    const mockReq = getMockReq();
    const mockRes = getMockRes();

    req = mockReq;
    res = mockRes.res;
    next = mockRes.next;

    transactionsController = new TransactionsController();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('getTransactions', () => {
    it('should 200 and return correct value', async () => {
      jest.spyOn(TransactionsService.prototype, 'findAllTransactions').mockReturnValue(Promise.resolve([MOCK_TRANSACTON]));

      await transactionsController.getTransactions(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [MOCK_TRANSACTON],
      });
    });

    it('should pass errors to next', async () => {
      jest.spyOn(TransactionsService.prototype, 'findAllTransactions').mockImplementation(() => {
        throw MOCK_ERROR;
      });

      await transactionsController.getTransactions(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(MOCK_ERROR);
    });
  });

  describe('getTransactionById', () => {
    it('should 200 and return correct value', async () => {
      const findBalanceByIdSpy = jest.spyOn(TransactionsService.prototype, 'findTransactionById').mockReturnValue(Promise.resolve(MOCK_TRANSACTON));

      req = getMockReq({
        params: {
          id: 1,
        },
      });

      await transactionsController.getTransactionById(req, res, next);

      expect(findBalanceByIdSpy).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: MOCK_TRANSACTON,
      });
    });

    it('should pass errors to next', async () => {
      jest.spyOn(TransactionsService.prototype, 'findTransactionById').mockImplementation(() => {
        throw MOCK_ERROR;
      });

      await transactionsController.getTransactionById(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(MOCK_ERROR);
    });
  });

  describe('getTransactionsByUser', () => {
    it('should 200 and return correct value', async () => {
      const findBalanceForUserSpy = jest
        .spyOn(TransactionsService.prototype, 'findAllUserTransactions')
        .mockReturnValue(Promise.resolve([MOCK_TRANSACTON]));

      req = getMockReq({
        params: {
          user_id: 1,
        },
      });

      await transactionsController.getTransactionsByUser(req, res, next);

      expect(findBalanceForUserSpy).toHaveBeenCalledWith(req.params.user_id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [MOCK_TRANSACTON],
      });
    });

    it('should pass errors to next', async () => {
      jest.spyOn(TransactionsService.prototype, 'findAllUserTransactions').mockImplementation(() => {
        throw MOCK_ERROR;
      });

      await transactionsController.getTransactionsByUser(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(MOCK_ERROR);
    });
  });

  describe('createTransaction', () => {
    it('should 201 and return created balance', async () => {
      const createBalanceSpy = jest.spyOn(TransactionsService.prototype, 'createTransaction').mockReturnValue(Promise.resolve(MOCK_TRANSACTON));

      req = getMockReq({
        body: {
          MOCK_TRANSACTON,
        },
      });

      await transactionsController.createTransaction(req, res, next);

      expect(createBalanceSpy).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: MOCK_TRANSACTON,
      });
    });

    it('should pass errors to next', async () => {
      jest.spyOn(TransactionsService.prototype, 'createTransaction').mockImplementation(() => {
        throw MOCK_ERROR;
      });

      await transactionsController.createTransaction(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(MOCK_ERROR);
    });
  });
});
