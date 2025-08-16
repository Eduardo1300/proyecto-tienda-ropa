import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, IsBoolean, Min, Max, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class ReviewFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  productId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  verified?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: 'rating' | 'date' | 'helpful' = 'date';

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC' = 'DESC';
}

export class AdminReviewResponseDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  adminResponse: string;
}

export class ReviewVoteDto {
  @IsNotEmpty()
  @IsBoolean()
  helpful: boolean; // true for helpful, false for unhelpful
}

export class VoteReviewDto {
  @IsNotEmpty()
  @IsBoolean()
  helpful: boolean; // true for helpful, false for unhelpful
}

// Response DTOs
export interface ReviewResponse {
  id: number;
  rating: number;
  title: string;
  comment: string;
  helpfulVotes: number;
  unhelpfulVotes: number;
  images: string[];
  purchaseVerified: boolean;
  isVerified: boolean;
  adminResponse?: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  product: {
    id: number;
    name: string;
    imageUrl: string;
  };
}

export interface ReviewsListResponse {
  reviews: ReviewResponse[];
  total: number;
  pages: number;
  currentPage: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number; // rating: count
  };
}
