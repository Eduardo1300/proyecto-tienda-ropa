import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';

class CreateOrderItemDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsOptional()
  @IsInt()
  userId?: number; // opcional: se preferirá el id del token

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items?: CreateOrderItemDto[];
}
