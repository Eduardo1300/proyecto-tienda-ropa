import React from 'react';
import { useLoyaltyProgram, useLoyaltyTransactions, useLoyaltyLeaderboard } from '../hooks/useLoyalty';
import { Card, Badge } from '../components/ui';

const LoyaltyDashboard: React.FC = () => {
  const { program, isLoading: programLoading, error: programError, redeemPoints } = useLoyaltyProgram();
  const { transactions, isLoading: transactionsLoading } = useLoyaltyTransactions({ limit: 10 });
  const { leaderboard, isLoading: leaderboardLoading } = useLoyaltyLeaderboard({ limit: 10 });

  const handleRedeemPoints = async (points: number, type: 'DISCOUNT' | 'PRODUCT' | 'SHIPPING') => {
    try {
      await redeemPoints(points, type);
      alert('¡Puntos canjeados exitosamente!');
    } catch (error) {
      alert('Error al canjear puntos');
    }
  };

  if (programError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 text-lg font-semibold">Error al cargar programa de lealtad</h2>
          <p className="text-red-600">{programError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Programa de Lealtad</h1>
        <p className="text-gray-600">
          Gana puntos con cada compra y disfruta de beneficios exclusivos
        </p>
      </div>

      {programLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse p-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* User Loyalty Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Mis Puntos</h2>
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {program?.currentPoints?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-gray-600">
                Puntos disponibles
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Nivel Actual</h2>
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {program?.currentTier?.name || 'Bronze'}
              </div>
              <p className="text-sm text-gray-600">
                Multiplicador: {program?.currentTier?.multiplier || 1}x
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Puntos Totales</h2>
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {program?.totalPointsEarned?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-gray-600">
                Ganados hasta ahora
              </p>
            </Card>
          </div>

          {/* Redemption Options */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Canjear Puntos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-lg font-semibold mb-2">Descuento 5%</div>
                <div className="text-sm text-gray-600 mb-4">500 puntos</div>
                <button 
                  onClick={() => handleRedeemPoints(500, 'DISCOUNT')}
                  disabled={!program || program.currentPoints < 500}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Canjear
                </button>
              </div>
              
              <div className="border rounded-lg p-4 text-center">
                <div className="text-lg font-semibold mb-2">Descuento 10%</div>
                <div className="text-sm text-gray-600 mb-4">1,000 puntos</div>
                <button 
                  onClick={() => handleRedeemPoints(1000, 'DISCOUNT')}
                  disabled={!program || program.currentPoints < 1000}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Canjear
                </button>
              </div>
              
              <div className="border rounded-lg p-4 text-center">
                <div className="text-lg font-semibold mb-2">Envío Gratis</div>
                <div className="text-sm text-gray-600 mb-4">200 puntos</div>
                <button 
                  onClick={() => handleRedeemPoints(200, 'SHIPPING')}
                  disabled={!program || program.currentPoints < 200}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Canjear
                </button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction History */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Historial de Transacciones</h2>
              {transactionsLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {transactions?.transactions && transactions.transactions.length > 0 ? (
                    transactions.transactions.map((transaction, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <div className="text-sm font-medium">{transaction.description}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            transaction.type === 'EARNED' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }>
                            {transaction.type === 'EARNED' ? '+' : '-'}{transaction.points}
                          </Badge>
                          <Badge className="bg-gray-100 text-gray-800 text-xs">
                            {transaction.type}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No hay transacciones disponibles
                    </p>
                  )}
                </div>
              )}
            </Card>

            {/* Leaderboard */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Tabla de Líderes</h2>
              {leaderboardLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {leaderboard && leaderboard.length > 0 ? (
                    leaderboard.map((user, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{user.userName || `Usuario ${index + 1}`}</div>
                            <div className="text-xs text-gray-500">{user.currentTier || 'Bronze'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{(user.currentPoints || 0).toLocaleString()}</div>
                          <div className="text-xs text-gray-500">puntos</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No hay datos de leaderboard disponibles
                    </p>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* How to Earn Points */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">¿Cómo Ganar Puntos?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0L12 18m-2.5 0h7" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Compras</h3>
                <p className="text-sm text-gray-600">{program?.program?.pointsPerDollar || 1} punto por €1</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Reseñas</h3>
                <p className="text-sm text-gray-600">{program?.program?.reviewBonusPoints || 50} puntos por reseña</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-7.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Referidos</h3>
                <p className="text-sm text-gray-600">{program?.program?.referralBonusPoints || 100} puntos por referido</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Cumpleaños</h3>
                <p className="text-sm text-gray-600">{program?.program?.birthdayBonusPoints || 200} puntos</p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default LoyaltyDashboard;
