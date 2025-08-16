export interface Review {
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
  createdAt: string;
  updatedAt: string;
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
  reviews: Review[];
  total: number;
  pages: number;
  currentPage: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

export interface CreateReviewDto {
  rating: number;
  title: string;
  comment: string;
  productId: number;
  images?: string[];
}

export interface UpdateReviewDto {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export interface ReviewFilterDto {
  productId?: number;
  userId?: number;
  rating?: number;
  verified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'date' | 'helpful';
  order?: 'ASC' | 'DESC';
}

export interface VoteReviewDto {
  helpful: boolean;
}

export interface AdminReviewResponseDto {
  adminResponse: string;
}
