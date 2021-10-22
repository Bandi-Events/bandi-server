process.env['NODE_CONFIG_DIR'] = process.cwd() + '/src/configs';

import { getMockReq, getMockRes } from '@jest-mock/express';

import AuthService from '@services/auth.service';
import AuthController from '../auth.controller';

jest.mock('config');

const MOCK_USER = {
  id: 1,
  email: 'user@test.com',
  password: '1234',
  createdAt: new Date(),
  updatedAt: new Date(),
};
const MOCK_ERROR = new Error('unexpected error occured');

describe('auth.controller', () => {
  let authController, req, res, next;

  beforeEach(() => {
    const mockReq = getMockReq();
    const mockRes = getMockRes();

    req = mockReq;
    res = mockRes.res;
    next = mockRes.next;

    authController = new AuthController();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('signUp', () => {
    it('should 201 and return correct value', async () => {
      const signupSpy = jest.spyOn(AuthService.prototype, 'signup').mockReturnValue(Promise.resolve(MOCK_USER));

      req = getMockReq({
        body: {
          MOCK_USER,
        },
      });

      await authController.signUp(req, res, next);

      expect(signupSpy).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: MOCK_USER,
      });
    });

    it('should pass errors to next', async () => {
      jest.spyOn(AuthService.prototype, 'signup').mockImplementation(() => {
        throw MOCK_ERROR;
      });

      await authController.signUp(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(MOCK_ERROR);
    });
  });

  describe('signIn', () => {
    it('should 200 and return correct value', async () => {
      const loginSpy = jest.spyOn(AuthService.prototype, 'login').mockReturnValue(
        Promise.resolve({
          cookie: 'test-cookie',
          findUser: MOCK_USER,
        }),
      );

      req = getMockReq({
        body: {
          MOCK_USER,
        },
      });

      await authController.signIn(req, res, next);

      expect(loginSpy).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: MOCK_USER,
      });
    });

    it('should pass errors to next', async () => {
      jest.spyOn(AuthService.prototype, 'login').mockImplementation(() => {
        throw MOCK_ERROR;
      });

      await authController.signIn(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(MOCK_ERROR);
    });
  });

  describe('signOut', () => {
    it('should 200 and return correct value', async () => {
      const logoutSpy = jest.spyOn(AuthService.prototype, 'logout').mockReturnValue(Promise.resolve(MOCK_USER));

      req = getMockReq({
        user: MOCK_USER,
      });

      await authController.signOut(req, res, next);

      expect(logoutSpy).toHaveBeenCalledWith(req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: MOCK_USER,
      });
    });
  });

  it('should pass errors to next', async () => {
    jest.spyOn(AuthService.prototype, 'logout').mockImplementation(() => {
      throw MOCK_ERROR;
    });

    await authController.signOut(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(MOCK_ERROR);
  });
});
