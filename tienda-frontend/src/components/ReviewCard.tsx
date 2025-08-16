import React, { useState } from 'react';
import type { Review } from '../types/review.types';

interface ReviewCardProps {
  review: Review;
  onVote?: (reviewId: number, helpful: boolean) => void;
  onEdit?: (reviewId: number) => void;
  onDelete?: (reviewId: number) => void;
  currentUserId?: number;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onVote,
  onEdit,
  onDelete,
  currentUserId
}) => {
  const [showFullComment, setShowFullComment] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-500' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncatedComment = review.comment.length > 200 
    ? review.comment.substring(0, 200) + '...' 
    : review.comment;

  const isCurrentUserReview = currentUserId === review.user.id;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border">
      {/* Header con usuario y rating */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {review.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{review.user.name}</p>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
            {review.purchaseVerified && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                ✓ Compra verificada
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex">{renderStars(review.rating)}</div>
          {isCurrentUserReview && (
            <div className="flex space-x-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(review.id)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Editar
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(review.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Eliminar
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Título de la review */}
      <h4 className="font-semibold text-lg text-gray-800 mb-2">{review.title}</h4>

      {/* Comentario */}
      <p className="text-gray-700 mb-3">
        {showFullComment ? review.comment : truncatedComment}
        {review.comment.length > 200 && (
          <button
            onClick={() => setShowFullComment(!showFullComment)}
            className="text-blue-500 hover:text-blue-700 ml-2 text-sm"
          >
            {showFullComment ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </p>

      {/* Imágenes de la review */}
      {review.images && review.images.length > 0 && (
        <div className="flex space-x-2 mb-4">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
            />
          ))}
        </div>
      )}

      {/* Respuesta del admin */}
      {review.adminResponse && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-400">🏪</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">Respuesta de la tienda:</p>
              <p className="mt-1 text-sm text-blue-700">{review.adminResponse}</p>
            </div>
          </div>
        </div>
      )}

      {/* Botones de utilidad */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-4">
          {onVote && (
            <>
              <button
                onClick={() => onVote(review.id, true)}
                className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
              >
                <span>👍</span>
                <span className="text-sm">Útil ({review.helpfulVotes})</span>
              </button>
              <button
                onClick={() => onVote(review.id, false)}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <span>👎</span>
                <span className="text-sm">No útil ({review.unhelpfulVotes})</span>
              </button>
            </>
          )}
        </div>

        {review.isVerified && (
          <span className="text-xs text-green-600 font-medium">✓ Verificada</span>
        )}
      </div>
    </div>
  );
};
