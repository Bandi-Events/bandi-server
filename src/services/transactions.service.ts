import { PrismaClient, Transaction } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { CreateTransactionDto } from '@dtos/transactions.dto';

class TransactionsService {
  public transactions = new PrismaClient().transaction;

  public async findAllTransactions(): Promise<Transaction[]> {
    const allTransactions: Transaction[] = await this.transactions.findMany();
    return allTransactions;
  }

  public async findTransactionById(transactionId: number): Promise<Transaction> {
    if (isEmpty(transactionId)) throw new HttpException(400, 'transaction ID was not provided');

    const findTransaction: Transaction = await this.transactions.findUnique({ where: { id: transactionId } });
    if (!findTransaction) throw new HttpException(409, 'transaction was not found');

    return findTransaction;
  }

  public async findAllUserTransactions(userId: number): Promise<Transaction[]> {
    const userTransactions: Transaction[] = await this.transactions.findMany({
      where: {
        userId,
      },
    });
    return userTransactions;
  }

  public async createTransaction(transactionData: CreateTransactionDto): Promise<Transaction> {
    if (isEmpty(transactionData)) throw new HttpException(400, 'required data was not provided');

    const createTransactionData: Transaction = await this.transactions.create({ data: { ...transactionData } });
    return createTransactionData;
  }
}

export default TransactionsService;
