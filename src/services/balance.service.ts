import { PrismaClient, Balance } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { CreateBalanceDto } from '@dtos/balances.dto';

class BalanceService {
  public balances = new PrismaClient().balance;

  public async findAllBalances(): Promise<Balance[]> {
    const allBalances: Balance[] = await this.balances.findMany();
    return allBalances;
  }

  public async findBalanceById(balanceId: number): Promise<Balance> {
    if (isEmpty(balanceId)) throw new HttpException(400, 'balance ID was not provided');

    const findBalance: Balance = await this.balances.findUnique({ where: { id: balanceId } });
    if (!findBalance) throw new HttpException(409, 'balance was not found');

    return findBalance;
  }

  public async findBalanceForUser(userId: number): Promise<Balance> {
    const userBalance: Balance = await this.balances.findFirst({ where: { userId } });
    return userBalance;
  }

  public async createBalance(balanceData: CreateBalanceDto): Promise<Balance> {
    if (isEmpty(balanceData)) throw new HttpException(400, 'required data was not provided');

    const createBalanceData: Balance = await this.balances.create({ data: { ...balanceData } });
    return createBalanceData;
  }

  public async updateBalance(userId: number, updatedBalance: CreateBalanceDto): Promise<Balance> {
    if (isEmpty(updatedBalance)) throw new HttpException(400, 'required data was not provided');

    const findUserBalance: Balance = await this.balances.findFirst({ where: { userId } });
    if (!findUserBalance) throw new HttpException(409, 'balance was not found');

    const updatedBalanceData = await this.balances.update({ where: { id: userId }, data: { ...updatedBalance } });
    return updatedBalanceData;
  }
}

export default BalanceService;
