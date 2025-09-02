import React, { useState, useEffect } from 'react';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { reviewsAPI } from '../services/api';
import type { Review, ReviewsListResponse, ReviewFilterDto, CreateReviewDto, UpdateReviewDto } from '../types/review.types';

interface ReviewsListProps {
  productId: number;
  productName?: string;
  currentUserId?: number;
  onReviewAdded?: () => void;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  productId,
  productName,
  currentUserId,
  onReviewAdded
}) => {
  const [reviewsData, setReviewsData] = useState<ReviewsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [filters, setFilters] = useState<ReviewFilterDto>({
    productId,
    page: 1,
    limit: 10,
    sortBy: 'date',
    order: 'DESC'
  });

  useEffect(() => {
    loadReviews();
  }, [productId, filters]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading reviews for product:', productId, 'with filters:', filters);
      
      const response = await reviewsAPI.getByProduct(productId, {
        page: filters.page || 1,
        limit: filters.limit || 10,
        sortBy: filters.sortBy || 'date',
        order: filters.order || 'DESC',
        rating: filters.rating
      });
      
      console.log('✅ Reviews loaded:', response.data);
      setReviewsData(response.data);
    } catch (error) {
      console.error('❌ Error loading reviews:', error);
      
      // En caso de error, usar datos mock vacíos para evitar crashes
      const mockData: ReviewsListResponse = {
        reviews: [],
        total: 0,
        pages: 0,
        currentPage: 1,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
      setReviewsData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (data: CreateReviewDto) => {
    try {
      console.log('🔄 Creating review:', data);
      
      const response = await reviewsAPI.create({
        ...data,
        productId: productId // Asegurar que el productId esté incluido
      });
      
      console.log('✅ Review created:', response.data);
      setShowForm(false);
      loadReviews();
      onReviewAdded?.();
    } catch (error) {
      console.error('❌ Error creating review:', error);
      throw error;
    }
  };

  const handleUpdateReview = async (data: UpdateReviewDto) => {
    if (!editingReview) return;
    
    try {
      console.log('🔄 Updating review:', editingReview.id, data);
      
      const response = await reviewsAPI.update(editingReview.id, data);
      
      console.log('✅ Review updated:', response.data);
      setEditingReview(null);
      loadReviews();
    } catch (error) {
      console.error('❌ Error updating review:', error);
      throw error;
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta review?')) {
      return;
    }

    try {
      console.log('🔄 Deleting review:', reviewId);
      
      await reviewsAPI.delete(reviewId);
      
      console.log('✅ Review deleted');
      loadReviews();
    } catch (error) {
      console.error('❌ Error deleting review:', error);
    }
  };

  const handleVoteReview = async (reviewId: number, helpful: boolean) => {
    try {
      console.log('🔄 Voting review:', reviewId, helpful);
      
      await reviewsAPI.vote(reviewId, helpful);
      
      console.log('✅ Review voted');
      loadReviews();
    } catch (error) {
      console.error('❌ Error voting review:', error);
    }
  };

  const renderRatingDistribution = () => {
    if (!reviewsData || reviewsData.total === 0) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rating promedio */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {reviewsData.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  className={`text-xl ${
                    index < Math.round(reviewsData.averageRating)
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-600">
              {reviewsData.total} {reviewsData.total === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Distribución de ratings */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviewsData.ratingDistribution[rating] || 0;
              const percentage = reviewsData.total > 0 ? (count / reviewsData.total) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm w-12">{rating} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSortControls = () => (
    <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
      <h3 className="text-xl font-semibold text-gray-800">
        Reviews {reviewsData && `(${reviewsData.total})`}
      </h3>
      
      <div className="flex items-center space-x-4">
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ 
            ...prev, 
            sortBy: e.target.value as 'rating' | 'date' | 'helpful',
            page: 1 
          }))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="date">Más recientes</option>
          <option value="rating">Mayor calificación</option>
          <option value="helpful">Más útiles</option>
        </select>

        <select
          value={filters.rating || ''}
          onChange={(e) => setFilters(prev => ({ 
            ...prev, 
            rating: e.target.value ? Number(e.target.value) : undefined,
            page: 1 
          }))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las calificaciones</option>
          <option value="5">5 estrellas</option>
          <option value="4">4 estrellas</option>
          <option value="3">3 estrellas</option>
          <option value="2">2 estrellas</option>
          <option value="1">1 estrella</option>
        </select>

        {currentUserId && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Escribir Review
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando reviews...</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <ReviewForm
          onSubmit={(data) => {
            if ('productId' in data) {
              return handleCreateReview(data as CreateReviewDto);
            } else {
              throw new Error('ProductId is required for creating review');
            }
          }}
          onCancel={() => setShowForm(false)}
          productName={productName}
          initialData={{ productId } as CreateReviewDto & { productId: number }}
        />
      </div>
    );
  }

  if (editingReview) {
    return (
      <div className="space-y-6">
        <ReviewForm
          onSubmit={handleUpdateReview}
          onCancel={() => setEditingReview(null)}
          initialData={{
            rating: editingReview.rating,
            title: editingReview.title,
            comment: editingReview.comment,
            images: editingReview.images
          }}
          isEdit
          productName={productName}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderRatingDistribution()}
      {renderSortControls()}

      {reviewsData && reviewsData.reviews.length > 0 ? (
        <div className="space-y-4">
          {reviewsData.reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onVote={handleVoteReview}
              onEdit={(id) => {
                const review = reviewsData.reviews.find(r => r.id === id);
                if (review) setEditingReview(review);
              }}
              onDelete={handleDeleteReview}
              currentUserId={currentUserId}
            />
          ))}

          {/* Paginación */}
          {reviewsData.pages > 1 && (
            <div className="flex justify-center space-x-2 pt-6">
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <span className="px-4 py-2 text-gray-600">
                Página {filters.page} de {reviewsData.pages}
              </span>
              
              <button
                disabled={filters.page === reviewsData.pages}
                onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Aún no hay reviews
          </h3>
          <p className="text-gray-600 mb-6">
            Sé el primero en escribir una review sobre este producto
          </p>
          {currentUserId && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Escribir la primera review
            </button>
          )}
        </div>
      )}
    </div>
  );
};
