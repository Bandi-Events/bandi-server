import { getMockReq, getMockRes } from '@jest-mock/express';

import BalancesService from '@services/balances.service';
import BalancesController from '../balances.controller';

const MOCK_BALANCE = {
  id: 1,
  userId: 1,
  total: 3.0,
  updatedAt: new Date(),
};
const MOCK_ERROR = new Error('unexpected error occured');

describe('balances.controller', () => {
  let balancesController, req, res, next;

  beforeEach(() => {
    const mockReq = getMockReq();
    const mockRes = getMockRes();

    req = mockReq;
    res = mockRes.res;
    next = mockRes.next;

    balancesController = new BalancesController();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('getBalances', () => {
    it('should 200 and return correct value', async () => {
      jest.spyOn(BalancesService.prototype, 'findAllBalances').mockReturnValue(Promise.resolve([MOCK_BALANCE]));

      await balancesController.getBalances(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [MOCK_BALANCE],
      });
    });

    it('should pass errors to next', async () => {
      jest.spyOn(BalancesService.prototype, 'findAllBalances').mockImplementation(() => {
        throw MOCK_ERROR;
      });

      await balancesController.getBalances(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(MOCK_ERROR);
    });
  });

  describe('getBalanceById', () => {
    it('should 200 and return correct value', async () => {
      const findBalanceByIdSpy = jest.spyOn(BalancesService.prototype, 'findBalanceById').mockReturnValue(Promise.resolve(MOCK_BALANCE));

      req = getMockReq({
        params: {
          id: 1,
        },
      });

      await balancesController.getBalanceById(req, res, next);

      expect(findBalanceByIdSpy).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: MOCK_BALANCE,
      });
    });

    it('should pass errors to next', async () => {
      jest.spyOn(BalancesService.prototype, 'findBalanceById').mockImplementation(() => {
        throw MOCK_ERROR;
      });

      await balancesController.getBalanceById(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(MOCK_ERROR);
    });
  });

  describe('getUserBalance', () => {
    it('should 200 and return correct value', async () => {
      const findBalanceForUserSpy = jest.spyOn(BalancesService.prototype, 'findBalanceForUser').mockReturnValue(Promise.resolve(MOCK_BALANCE));

      req = getMockReq({
        params: {
          user_id: 1,
        },
      });

      await balancesController.getUserBalance(req, res, next);

      expect(findBalanceForUserSpy).toHaveBeenCalledWith(req.params.user_id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: MOCK_BALANCE,
      });
    });

    it('should pass errors to next', async () => {
      jest.spyOn(BalancesService.prototype, 'findBalanceForUser').mockImplementation(() => {
        throw MOCK_ERROR;
      });

      await balancesController.getUserBalance(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(MOCK_ERROR);
    });
  });

  describe('createOrUpdateBalance', () => {
    describe('create', () => {
      beforeEach(() => {
        jest.spyOn(BalancesService.prototype, 'findBalanceForUser').mockReturnValue(Promise.resolve(null));
      });

      it('should 201 and return created balance', async () => {
        const createBalanceSpy = jest.spyOn(BalancesService.prototype, 'createBalance').mockReturnValue(Promise.resolve(MOCK_BALANCE));

        req = getMockReq({
          body: {
            MOCK_BALANCE,
          },
        });

        await balancesController.createOrUpdateBalance(req, res, next);

        expect(createBalanceSpy).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          data: MOCK_BALANCE,
        });
      });

      it('should pass errors to next', async () => {
        jest.spyOn(BalancesService.prototype, 'createBalance').mockImplementation(() => {
          throw MOCK_ERROR;
        });

        await balancesController.createOrUpdateBalance(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(MOCK_ERROR);
      });
    });

    describe('update', () => {
      beforeEach(() => {
        jest.spyOn(BalancesService.prototype, 'findBalanceForUser').mockReturnValue(Promise.resolve(MOCK_BALANCE));
      });

      it('should 200 and return updated balance', async () => {
        const updateBalanceSpy = jest.spyOn(BalancesService.prototype, 'updateBalance').mockReturnValue(Promise.resolve(MOCK_BALANCE));

        req = getMockReq({
          body: {
            MOCK_BALANCE,
          },
        });

        await balancesController.createOrUpdateBalance(req, res, next);

        expect(updateBalanceSpy).toHaveBeenCalledWith(req.body.userId, req.body);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          data: MOCK_BALANCE,
        });
      });

      it('should pass errors to next', async () => {
        jest.spyOn(BalancesService.prototype, 'updateBalance').mockImplementation(() => {
          throw MOCK_ERROR;
        });

        await balancesController.createOrUpdateBalance(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(MOCK_ERROR);
      });
    });
  });
});
