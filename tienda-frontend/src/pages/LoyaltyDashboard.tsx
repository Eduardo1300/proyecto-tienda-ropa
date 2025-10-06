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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header Mejorado */}
        <Card className="mb-10 overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white" padding="lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-5xl shadow-lg">🎁</div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Programa de Lealtad</h1>
                <p className="text-purple-100 text-lg">Gana puntos y disfruta de beneficios exclusivos</p>
              </div>
            </div>
            {program && (
              <div className="flex flex-col items-end gap-2">
                <Badge className="bg-yellow-500/20 text-yellow-100 text-base px-4 py-2 rounded-full">
                  ⭐ {program.currentPoints?.toLocaleString() || 0} puntos disponibles
                </Badge>
                <Badge className="bg-green-500/20 text-green-100 text-base px-4 py-2 rounded-full">
                  Nivel: {program.currentTier?.name || 'Bronze'}
                </Badge>
              </div>
            )}
          </div>
        </Card>

        {programLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse p-8">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="p-8 bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">⭐</div>
                  <h2 className="text-lg font-semibold">Mis Puntos</h2>
                </div>
                <div className="text-4xl font-bold mb-2">{program?.currentPoints?.toLocaleString() || 0}</div>
                <p className="text-base text-purple-100">Puntos disponibles</p>
              </Card>
              <Card className="p-8 bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">🏅</div>
                  <h2 className="text-lg font-semibold">Nivel Actual</h2>
                </div>
                <div className="text-3xl font-bold mb-2">{program?.currentTier?.name || 'Bronze'}</div>
                <p className="text-base text-green-100">Multiplicador: {program?.currentTier?.multiplier || 1}x</p>
              </Card>
              <Card className="p-8 bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">🎉</div>
                  <h2 className="text-lg font-semibold">Puntos Totales</h2>
                </div>
                <div className="text-4xl font-bold mb-2">{program?.totalPointsEarned?.toLocaleString() || 0}</div>
                <p className="text-base text-yellow-100">Ganados hasta ahora</p>
              </Card>
            </div>

            {/* Redemption Options */}
            <Card className="p-8 mb-10 bg-white/80 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">🎁 Canjear Puntos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-xl p-6 text-center bg-blue-50">
                  <div className="text-xl font-semibold mb-2 text-blue-700">Descuento 5%</div>
                  <div className="text-base text-gray-600 mb-4">500 puntos</div>
                  <button 
                    onClick={() => handleRedeemPoints(500, 'DISCOUNT')}
                    disabled={!program || program.currentPoints < 500}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-bold"
                  >
                    Canjear
                  </button>
                </div>
                <div className="border rounded-xl p-6 text-center bg-blue-50">
                  <div className="text-xl font-semibold mb-2 text-blue-700">Descuento 10%</div>
                  <div className="text-base text-gray-600 mb-4">1,000 puntos</div>
                  <button 
                    onClick={() => handleRedeemPoints(1000, 'DISCOUNT')}
                    disabled={!program || program.currentPoints < 1000}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-bold"
                  >
                    Canjear
                  </button>
                </div>
                <div className="border rounded-xl p-6 text-center bg-blue-50">
                  <div className="text-xl font-semibold mb-2 text-blue-700">Envío Gratis</div>
                  <div className="text-base text-gray-600 mb-4">200 puntos</div>
                  <button 
                    onClick={() => handleRedeemPoints(200, 'SHIPPING')}
                    disabled={!program || program.currentPoints < 200}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-bold"
                  >
                    Canjear
                  </button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Transaction History */}
              <Card className="p-8 bg-white/80 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-purple-700 flex items-center gap-2">📜 Historial de Transacciones</h2>
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
                        <div key={index} className="flex justify-between items-center py-4 border-b border-gray-100">
                          <div>
                            <div className="text-base font-medium">{transaction.description}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleDateString('es-ES')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={
                              transaction.type === 'EARNED' 
                                ? 'bg-green-100 text-green-800 font-bold' 
                                : 'bg-red-100 text-red-800 font-bold'
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
              <Card className="p-8 bg-white/80 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-2">🏆 Tabla de Líderes</h2>
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
                        <div key={index} className="flex justify-between items-center py-4 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-base font-medium">{user.userName || `Usuario ${index + 1}`}</div>
                              <div className="text-xs text-gray-500">{user.currentTier || 'Bronze'}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-bold">{(user.currentPoints || 0).toLocaleString()}</div>
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
            <Card className="p-8 mt-10 bg-gradient-to-r from-purple-50 to-blue-50">
              <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-2">✨ ¿Cómo Ganar Puntos?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-3xl">🛒</div>
                  <h3 className="font-semibold mb-1 text-blue-700">Compras</h3>
                  <p className="text-base text-gray-600">{program?.program?.pointsPerDollar || 1} punto por S/1</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-3xl">⭐</div>
                  <h3 className="font-semibold mb-1 text-green-700">Reseñas</h3>
                  <p className="text-base text-gray-600">{program?.program?.reviewBonusPoints || 50} puntos por reseña</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-3xl">🤝</div>
                  <h3 className="font-semibold mb-1 text-purple-700">Referidos</h3>
                  <p className="text-base text-gray-600">{program?.program?.referralBonusPoints || 100} puntos por referido</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-3xl">🎂</div>
                  <h3 className="font-semibold mb-1 text-yellow-700">Cumpleaños</h3>
                  <p className="text-base text-gray-600">{program?.program?.birthdayBonusPoints || 200} puntos</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default LoyaltyDashboard;
