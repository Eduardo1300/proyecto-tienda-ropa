import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../components/ui';
import { useAuth } from '../context/AuthContext';

const LoyaltyDashboard: React.FC = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [error, setError] = useState<string | null>(null);

  // Mock data para mostrar mientras resolvemos la conexión
  const mockProgram = {
    currentPoints: 1250,
    totalPointsEarned: 2400,
    currentTier: { name: 'Silver', multiplier: 1.2 },
    availablePoints: 1250
  };

  const mockTransactions = [
    {
      id: 1,
      type: 'EARNED',
      points: 100,
      description: 'Compra #1001 - $100.00',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      type: 'EARNED',
      points: 25,
      description: 'Bonus por escribir reseña',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 3,
      type: 'REDEEMED',
      points: -500,
      description: 'Canje por descuento 5%',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  const mockLeaderboard = [
    { position: 1, userName: 'Usuario Elite', currentPoints: 5000, currentTier: 'Platinum' },
    { position: 2, userName: 'Comprador Frecuente', currentPoints: 3500, currentTier: 'Gold' },
    { position: 3, userName: 'Cliente VIP', currentPoints: 2800, currentTier: 'Gold' },
    { position: 4, userName: user?.firstName || 'Tu', currentPoints: 1250, currentTier: 'Silver' },
    { position: 5, userName: 'Usuario Activo', currentPoints: 1100, currentTier: 'Silver' }
  ];

  useEffect(() => {
    // Probar conexión con el backend
    const testConnection = async () => {
      try {
        console.log('🧪 Testing loyalty API connection...');
        console.log('User:', user);
        console.log('Token:', token ? 'Present' : 'Missing');

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('http://localhost:3002/loyalty/test', {
          method: 'GET',
          headers: headers
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Loyalty API test successful:', data);
          
          // Ahora probemos el endpoint de transacciones que requiere autenticación
          console.log('🔒 Testing authenticated endpoint...');
          const transactionsResponse = await fetch('http://localhost:3002/loyalty/transactions', {
            method: 'GET',
            headers: headers
          });

          if (transactionsResponse.ok) {
            const transactionsData = await transactionsResponse.json();
            console.log('✅ Loyalty transactions test successful:', transactionsData);
            setConnectionStatus('connected');
          } else {
            console.log('❌ Loyalty transactions test failed:', transactionsResponse.status);
            const errorText = await transactionsResponse.text();
            console.log('Transaction error details:', errorText);
            setConnectionStatus('error');
            setError(`Transactions: HTTP ${transactionsResponse.status} - Necesitas un token válido`);
          }
        } else {
          console.log('❌ Loyalty API test failed:', response.status);
          const errorText = await response.text();
          console.log('Error details:', errorText);
          setConnectionStatus('error');
          setError(`HTTP ${response.status} - ${errorText}`);
        }
      } catch (err) {
        console.log('❌ Loyalty API connection error:', err);
        setConnectionStatus('error');
        setError('Cannot connect to loyalty service');
      }
    };

    testConnection();
  }, [user, token]);

  const handleRedeemPoints = async (points: number, type: string) => {
    alert(`Función de canje en desarrollo. Intentando canjear ${points} puntos por ${type}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Programa de Lealtad</h1>
        <p className="text-gray-600">
          Gana puntos con cada compra y disfruta de beneficios exclusivos
        </p>
        
        {/* Connection Status */}
        <div className="mt-4 flex justify-center">
          <Badge 
            className={
              connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
              connectionStatus === 'error' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }
          >
            {connectionStatus === 'connected' && '✅ Conectado al servicio de loyalty'}
            {connectionStatus === 'error' && `❌ Error de conexión: ${error}`}
            {connectionStatus === 'testing' && '🧪 Probando conexión...'}
          </Badge>
        </div>
      </div>

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
            {mockProgram.currentPoints.toLocaleString()}
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
            {mockProgram.currentTier.name}
          </div>
          <p className="text-sm text-gray-600">
            Multiplicador: {mockProgram.currentTier.multiplier}x
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
            {mockProgram.totalPointsEarned.toLocaleString()}
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
              onClick={() => handleRedeemPoints(500, 'Descuento 5%')}
              disabled={mockProgram.currentPoints < 500}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Canjear
            </button>
          </div>
          
          <div className="border rounded-lg p-4 text-center">
            <div className="text-lg font-semibold mb-2">Descuento 10%</div>
            <div className="text-sm text-gray-600 mb-4">1,000 puntos</div>
            <button 
              onClick={() => handleRedeemPoints(1000, 'Descuento 10%')}
              disabled={mockProgram.currentPoints < 1000}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Canjear
            </button>
          </div>
          
          <div className="border rounded-lg p-4 text-center">
            <div className="text-lg font-semibold mb-2">Envío Gratis</div>
            <div className="text-sm text-gray-600 mb-4">200 puntos</div>
            <button 
              onClick={() => handleRedeemPoints(200, 'Envío Gratis')}
              disabled={mockProgram.currentPoints < 200}
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
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {mockTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-100">
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
                    {transaction.points > 0 ? '+' : ''}{transaction.points}
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-800 text-xs">
                    {transaction.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Leaderboard */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Tabla de Líderes</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {mockLeaderboard.map((entry) => (
              <div key={entry.position} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    entry.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                    entry.position === 2 ? 'bg-gray-100 text-gray-800' :
                    entry.position === 3 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {entry.position}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{entry.userName}</div>
                    <div className="text-xs text-gray-500">{entry.currentTier}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{entry.currentPoints.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">puntos</div>
                </div>
              </div>
            ))}
          </div>
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
            <p className="text-sm text-gray-600">1 punto por €1</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1">Reseñas</h3>
            <p className="text-sm text-gray-600">25 puntos por reseña</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-7.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1">Referidos</h3>
            <p className="text-sm text-gray-600">150 puntos por referido</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1">Cumpleaños</h3>
            <p className="text-sm text-gray-600">200 puntos</p>
          </div>
        </div>
      </Card>

      {/* Debug Info */}
      {connectionStatus === 'error' && (
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Información de Depuración</h3>
          <div className="text-sm text-red-600 space-y-1">
            <p>• Backend URL: http://localhost:3002</p>
            <p>• Usuario autenticado: {user ? '✅ Sí' : '❌ No'}</p>
            <p>• Token presente: {token ? '✅ Sí' : '❌ No'}</p>
            <p>• Estado de conexión: {connectionStatus}</p>
            <p>• Error: {error}</p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-red-600">
              <strong>Solución:</strong> Asegúrate de estar autenticado y que el backend esté ejecutándose en el puerto 3002.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default LoyaltyDashboard;
