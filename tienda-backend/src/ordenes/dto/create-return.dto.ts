import { IsEnum, IsString, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ReturnReason } from '../entities/return.entity';

export class CreateReturnItemDto {
  @IsNumber()
  orderItemId: number;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateReturnDto {
  @IsNumber()
  orderId: number;

  @IsEnum(ReturnReason)
  reason: ReturnReason;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReturnItemDto)
  items: CreateReturnItemDto[];
}
