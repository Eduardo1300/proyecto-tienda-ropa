import React, { useState } from 'react';
import type { CreateReviewDto, UpdateReviewDto } from '../types/review.types';

interface ReviewFormProps {
  onSubmit: (data: CreateReviewDto | UpdateReviewDto) => Promise<void>;
  onCancel: () => void;
  initialData?: (UpdateReviewDto & { productId?: number }) | (CreateReviewDto & { productId: number });
  isEdit?: boolean;
  productName?: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
  productName
}) => {
  const [formData, setFormData] = useState({
    rating: initialData?.rating || 5,
    title: initialData?.title || '',
    comment: initialData?.comment || '',
    images: initialData?.images || [],
    productId: initialData?.productId || 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length > 100) {
      newErrors.title = 'El título no puede tener más de 100 caracteres';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'El comentario es requerido';
    } else if (formData.comment.length > 1000) {
      newErrors.comment = 'El comentario no puede tener más de 1000 caracteres';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'La calificación debe estar entre 1 y 5 estrellas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = isEdit 
        ? { rating: formData.rating, title: formData.title, comment: formData.comment, images: formData.images }
        : { ...formData };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => handleStarClick(index + 1)}
        className={`text-3xl transition-colors ${
          index < formData.rating 
            ? 'text-yellow-500 hover:text-yellow-600' 
            : 'text-gray-300 hover:text-yellow-300'
        }`}
      >
        ★
      </button>
    ));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Editar Review' : 'Escribir Review'}
        {productName && (
          <span className="block text-lg font-normal text-gray-600 mt-1">
            para {productName}
          </span>
        )}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación *
          </label>
          <div className="flex space-x-1 mb-2">
            {renderStars()}
          </div>
          <p className="text-sm text-gray-500">
            {formData.rating === 1 && 'Muy malo'}
            {formData.rating === 2 && 'Malo'}
            {formData.rating === 3 && 'Regular'}
            {formData.rating === 4 && 'Bueno'}
            {formData.rating === 5 && 'Excelente'}
          </p>
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título de tu review *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, title: e.target.value }));
              if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
            }}
            placeholder="Resumen tu experiencia en una frase"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={100}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            {errors.title && <span className="text-red-500">{errors.title}</span>}
            <span className="ml-auto">{formData.title.length}/100</span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu review *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, comment: e.target.value }));
              if (errors.comment) setErrors(prev => ({ ...prev, comment: '' }));
            }}
            placeholder="Comparte más detalles sobre tu experiencia con este producto..."
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            maxLength={1000}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            {errors.comment && <span className="text-red-500">{errors.comment}</span>}
            <span className="ml-auto">{formData.comment.length}/1000</span>
          </div>
        </div>

        {/* Image Upload Placeholder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fotos (opcional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="text-gray-500">
              <span className="text-3xl block mb-2">📷</span>
              <p>Arrastra fotos aquí o haz clic para seleccionar</p>
              <p className="text-sm mt-1">Máximo 5 fotos, 5MB por foto</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Las fotos ayudan a otros compradores a tomar mejores decisiones
          </p>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isSubmitting ? 'Enviando...' : (isEdit ? 'Actualizar Review' : 'Publicar Review')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
