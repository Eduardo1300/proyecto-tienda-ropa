import React, { useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import type { ReviewStat } from '../../types/admin.types';

interface ReviewsStatsProps {
  data: ReviewStat[];
  onLoadData: (data: ReviewStat[]) => void;
}

export const ReviewsStats: React.FC<ReviewsStatsProps> = ({ data, onLoadData }) => {
  const loadReviewsData = async () => {
    try {
      const reviewsData = await adminApi.getReviewsStats();
      onLoadData(reviewsData);
    } catch (error) {
      // Fallback to mock data
      const mockData: ReviewStat[] = [
        {
          id: 1,
          productName: 'Camiseta Premium',
          customerName: 'María González',
          rating: 2,
          comment: 'No me gustó la calidad del material...',
          createdAt: new Date(),
          needsResponse: true
        }
      ];
      onLoadData(mockData);
    }
  };

  useEffect(() => {
    loadReviewsData();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-6">⭐ Reviews Recientes</h2>
      <div className="space-y-4">
        {data.map(review => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{review.productName}</h3>
                <p className="text-sm text-gray-600">por {review.customerName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex">{renderStars(review.rating)}</div>
                {review.needsResponse && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                    Requiere respuesta
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
              <span>{review.createdAt.toLocaleDateString()}</span>
              <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200">
                Responder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
