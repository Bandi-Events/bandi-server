import { getMockReq, getMockRes } from '@jest-mock/express';

import IndexController from '../index.controller';

describe('index.controller', () => {
  describe('index', () => {
    it('should 200', async () => {
      const indexController = new IndexController();
      const req = getMockReq();
      const { res, next } = getMockRes();

      await indexController.index(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });
  });
});
