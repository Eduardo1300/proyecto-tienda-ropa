import { IsBoolean, IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdatePreferencesDto {
  // Notificaciones
  @IsBoolean()
  @IsOptional()
  emailNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  orderNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  promotionNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  weeklyNewsletter?: boolean;

  // Privacidad
  @IsBoolean()
  @IsOptional()
  profilePublic?: boolean;

  @IsBoolean()
  @IsOptional()
  showPurchaseHistory?: boolean;

  @IsBoolean()
  @IsOptional()
  allowDataCollection?: boolean;

  // Seguridad
  @IsBoolean()
  @IsOptional()
  twoFactorEnabled?: boolean;

  @IsString()
  @IsOptional()
  twoFactorMethod?: string;
}
