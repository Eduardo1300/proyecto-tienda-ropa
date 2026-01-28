import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Review {
  id: number;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ProductReviewsProps {
  productId: number;
  canReview?: boolean;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, canReview = true }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Review form state
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchReviewSummary();
  }, [productId, sortBy, filterBy]);

  const fetchReviews = async (pageNum = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10',
        sort: sortBy,
        filter: filterBy
      });

      const response = await axios.get(`/api/products/${productId}/reviews?${params}`);
      
      if (append) {
        setReviews(prev => [...prev, ...response.data.reviews]);
      } else {
        setReviews(response.data.reviews);
      }
      
      setHasMore(response.data.hasMore);
      setPage(pageNum);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewSummary = async () => {
    try {
      const response = await axios.get(`/api/products/${productId}/reviews/summary`);
      setReviewSummary(response.data);
    } catch (error) {
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmittingReview(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Debes iniciar sesión para escribir una reseña');
        return;
      }

      await axios.post(`/api/products/${productId}/reviews`, newReview, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewReview({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      fetchReviews();
      fetchReviewSummary();
      alert('Reseña enviada exitosamente. Será revisada antes de publicarse.');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al enviar la reseña');
    } finally {
      setSubmittingReview(false);
    }
  };

  const markHelpful = async (reviewId: number, helpful: boolean) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para votar');
        return;
      }

      await axios.post(`/api/reviews/${reviewId}/helpful`, { helpful }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update the review in the list
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? {
              ...review,
              helpfulCount: helpful ? review.helpfulCount + 1 : review.helpfulCount,
              notHelpfulCount: !helpful ? review.notHelpfulCount + 1 : review.notHelpfulCount
            }
          : review
      ));
    } catch (error) {
    }
  };

  const loadMoreReviews = () => {
    fetchReviews(page + 1, true);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const stars = [];
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`${sizeClasses[size]} ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    
    return <div className="flex items-center">{stars}</div>;
  };

  const renderInteractiveStars = (rating: number, onRatingChange: (rating: number) => void) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => onRatingChange(i)}
          className={`text-2xl hover:text-yellow-400 transition-colors ${
            i <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      );
    }
    
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  const getRatingPercentage = (rating: number) => {
    if (!reviewSummary || reviewSummary.totalReviews === 0) return 0;
    return Math.round((reviewSummary.ratingDistribution[rating as keyof typeof reviewSummary.ratingDistribution] / reviewSummary.totalReviews) * 100);
  };

  const getFilteredReviewsCount = () => {
    if (filterBy === 'all') return reviewSummary?.totalReviews || 0;
    if (filterBy === 'verified') return reviews.filter(r => r.isVerifiedPurchase).length;
    const rating = parseInt(filterBy);
    return reviewSummary?.ratingDistribution[rating as keyof typeof reviewSummary.ratingDistribution] || 0;
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          ⭐ Reseñas y Calificaciones
        </h3>
        
        {canReview && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark flex items-center gap-2"
          >
            ✍️ Escribir Reseña
          </button>
        )}
      </div>

      {/* Review Summary */}
      {reviewSummary && (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {reviewSummary.averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(reviewSummary.averageRating), 'lg')}
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Basado en {reviewSummary.totalReviews} reseñas
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-8">{rating} ★</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getRatingPercentage(rating)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-12">
                    {getRatingPercentage(rating)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Escribir una Reseña</h4>
          
          <form onSubmit={submitReview} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Calificación *
              </label>
              {renderInteractiveStars(newReview.rating, (rating) => 
                setNewReview(prev => ({ ...prev, rating }))
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Título de la reseña *
              </label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                placeholder="Resumen de tu experiencia"
                required
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Comentario *
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                placeholder="Comparte tu experiencia con este producto..."
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submittingReview}
                className="btn-modern btn-modern-primary"
              >
                {submittingReview ? 'Enviando...' : 'Enviar Reseña'}
              </button>
              
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="btn-modern bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center gap-4">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Filtrar:</span>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            >
              <option value="all">Todas las reseñas</option>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="2">2 estrellas</option>
              <option value="1">1 estrella</option>
              <option value="verified">Compra verificada</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguas</option>
              <option value="rating-high">Mejor calificadas</option>
              <option value="rating-low">Peor calificadas</option>
              <option value="helpful">Más útiles</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300">
          {getFilteredReviewsCount()} reseñas
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">📝</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {filterBy === 'all' ? 'No hay reseñas aún' : 'No hay reseñas que coincidan con el filtro'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {filterBy === 'all' 
              ? '¡Sé el primero en escribir una reseña para este producto!'
              : 'Prueba con otros filtros para ver más reseñas.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {review.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{review.user.name}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      {renderStars(review.rating, 'sm')}
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      {review.isVerifiedPurchase && (
                        <>
                          <span>•</span>
                          <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                            ✓ Compra verificada
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{review.title}</h4>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{review.comment}</p>
              </div>

              {/* Review Actions */}
              <div className="flex items-center gap-4 text-sm">
                <button
                  onClick={() => markHelpful(review.id, true)}
                  className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 flex items-center gap-1"
                >
                  👍 Útil ({review.helpfulCount})
                </button>
                
                <button
                  onClick={() => markHelpful(review.id, false)}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1"
                >
                  👎 No útil ({review.notHelpfulCount})
                </button>
              </div>
            </div>
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-6">
              <button
                onClick={loadMoreReviews}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cargar más reseñas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
