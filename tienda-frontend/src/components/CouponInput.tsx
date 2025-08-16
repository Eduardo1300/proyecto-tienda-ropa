import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import axios from 'axios';

interface CouponInputProps {
  subtotal: number;
  onCouponApplied: (coupon: any, discount: number) => void;
  onCouponRemoved: () => void;
  appliedCoupon?: any;
}

const CouponInput: React.FC<CouponInputProps> = ({
  subtotal,
  onCouponApplied,
  onCouponRemoved,
  appliedCoupon
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { addNotification } = useNotifications();

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      addNotification({
        type: 'warning',
        title: 'Código Requerido',
        message: 'Por favor ingresa un código de cupón',
        duration: 3000
      });
      return;
    }

    setIsValidating(true);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const response = await axios.post('/api/coupons/validate', {
        code: couponCode.toUpperCase(),
        subtotal: subtotal
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.valid) {
        onCouponApplied(response.data.coupon, response.data.discount);
        addNotification({
          type: 'success',
          title: 'Cupón Aplicado',
          message: response.data.message,
          duration: 4000
        });
        setCouponCode('');
      } else {
        addNotification({
          type: 'error',
          title: 'Cupón Inválido',
          message: response.data.message,
          duration: 4000
        });
      }
    } catch (error: any) {
      console.error('Error validating coupon:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al validar el cupón. Inténtalo de nuevo.',
        duration: 4000
      });
    } finally {
      setIsValidating(false);
    }
  };

  const removeCoupon = () => {
    onCouponRemoved();
    addNotification({
      type: 'info',
      title: 'Cupón Removido',
      message: 'El cupón ha sido removido de tu pedido',
      duration: 3000
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateCoupon();
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        🎟️ Código de Descuento
      </h3>

      {appliedCoupon ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  ✅ {appliedCoupon.code}
                </span>
                <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                  {appliedCoupon.name}
                </span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {appliedCoupon.description}
              </p>
            </div>
            <button
              onClick={removeCoupon}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Remover cupón"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Ingresa tu código de cupón"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isValidating}
          />
          <button
            onClick={validateCoupon}
            disabled={isValidating || !couponCode.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isValidating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Validando...
              </div>
            ) : (
              'Aplicar'
            )}
          </button>
        </div>
      )}

      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        <p>💡 <strong>Consejos:</strong></p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Los códigos no distinguen entre mayúsculas y minúsculas</li>
          <li>Algunos cupones requieren un monto mínimo de compra</li>
          <li>Solo se puede aplicar un cupón por pedido</li>
        </ul>
      </div>
    </div>
  );
};

export default CouponInput;
