import { IsNumber, IsDate } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  public amount: number;

  @IsNumber()
  public userId: number;

  @IsDate()
  public date: string;
}
