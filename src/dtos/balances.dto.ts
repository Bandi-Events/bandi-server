import { IsNumber } from 'class-validator';

export class CreateBalanceDto {
  @IsNumber()
  public total: number;

  @IsNumber()
  public userId: number;
}
