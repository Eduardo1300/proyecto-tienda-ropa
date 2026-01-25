import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import axios from 'axios';

interface LoyaltyProgram {
  id: number;
  totalPoints: number;
  availablePoints: number;
  lifetimeSpent: number;
  currentTier: string;
  tierProgress: number;
}

interface LoyaltyTransaction {
  id: number;
  type: string;
  reason: string;
  points: number;
  description: string;
  createdAt: string;
}

const LoyaltyProgram: React.FC = () => {
  const [program, setProgram] = useState<LoyaltyProgram | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemAmount, setRedeemAmount] = useState(100);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (user) {
      loadLoyaltyData();
    }
  }, [user]);

  const loadLoyaltyData = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      
      // Cargar programa de lealtad
      const programResponse = await axios.get('/api/loyalty/program', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgram(programResponse.data);

      // Cargar historial de transacciones
      const transactionsResponse = await axios.get('/api/loyalty/transactions?limit=10', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(transactionsResponse.data.transactions);

    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al cargar información del programa de lealtad',
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  const redeemPoints = async () => {
    if (!program || redeemAmount > program.availablePoints) {
      addNotification({
        type: 'warning',
        title: 'Puntos Insuficientes',
        message: 'No tienes suficientes puntos para este canje',
        duration: 3000
      });
      return;
    }

    setIsRedeeming(true);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const response = await axios.post('/api/loyalty/redeem', {
        points: redeemAmount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        addNotification({
          type: 'success',
          title: 'Puntos Canjeados',
          message: `Has canjeado ${redeemAmount} puntos por $${response.data.discount} de descuento`,
          duration: 5000
        });
        
        // Recargar datos
        loadLoyaltyData();
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al canjear puntos. Inténtalo de nuevo.',
        duration: 4000
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'silver': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      case 'gold': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'platinum': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      default: return '🏆';
    }
  };

  const getTransactionIcon = (type: string, reason: string) => {
    if (type === 'earned') {
      switch (reason) {
        case 'purchase': return '🛒';
        case 'birthday_bonus': return '🎂';
        case 'referral_bonus': return '👥';
        case 'review_bonus': return '⭐';
        case 'signup_bonus': return '🎉';
        default: return '➕';
      }
    } else if (type === 'redeemed') {
      return '💰';
    }
    return '📊';
  };

  if (!user) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Programa de Lealtad
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Inicia sesión para ver tu programa de lealtad
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando programa de lealtad...</span>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Error al cargar programa
        </h3>
        <button
          onClick={loadLoyaltyData}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🏆 Programa de Lealtad
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Gana puntos con cada compra y disfruta de beneficios exclusivos
        </p>
      </div>

      {/* Tier Status */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-3xl mr-3">{getTierIcon(program.currentTier)}</span>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getTierColor(program.currentTier)}`}>
                {program.currentTier.toUpperCase()}
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Nivel actual
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {program.availablePoints.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              puntos disponibles
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progreso al siguiente nivel</span>
            <span>{program.tierProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${program.tierProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Total de puntos</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {program.totalPoints.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Gastado total</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              ${program.lifetimeSpent.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Redeem Points */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          💰 Canjear Puntos
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          100 puntos = $1 de descuento
        </p>
        
        <div className="flex gap-2 mb-3">
          {[100, 250, 500, 1000].map((amount) => (
            <button
              key={amount}
              onClick={() => setRedeemAmount(amount)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                redeemAmount === amount
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
              disabled={amount > program.availablePoints}
            >
              {amount} pts
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={redeemAmount}
            onChange={(e) => setRedeemAmount(Math.max(0, parseInt(e.target.value) || 0))}
            min="100"
            max={program.availablePoints}
            step="50"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button
            onClick={redeemPoints}
            disabled={isRedeeming || redeemAmount > program.availablePoints || redeemAmount < 100}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isRedeeming ? 'Canjeando...' : `Canjear por $${(redeemAmount / 100).toFixed(2)}`}
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📊 Historial de Puntos
        </h3>
        
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">
                    {getTransactionIcon(transaction.type, transaction.reason)}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-semibold ${
                    transaction.points > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.points > 0 ? '+' : ''}{transaction.points}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">puntos</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No hay transacciones aún</p>
            <p className="text-sm">¡Haz tu primera compra para ganar puntos!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyProgram;
