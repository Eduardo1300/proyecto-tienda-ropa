import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    imageUrl?: string;
  };
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  items: OrderItem[];
  canBeReturned: boolean;
}

interface ReturnItem {
  orderItemId: number;
  quantity: number;
  condition?: string;
  notes?: string;
}

const ReturnRequest: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [description, setDescription] = useState('');
  const [selectedItems, setSelectedItems] = useState<Map<number, ReturnItem>>(new Map());

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data);
      
      if (!response.data.canBeReturned) {
        setError('Este pedido no puede ser devuelto');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching order');
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelection = (orderItem: OrderItem, selected: boolean) => {
    const newSelectedItems = new Map(selectedItems);
    
    if (selected) {
      newSelectedItems.set(orderItem.id, {
        orderItemId: orderItem.id,
        quantity: orderItem.quantity,
        condition: '',
        notes: ''
      });
    } else {
      newSelectedItems.delete(orderItem.id);
    }
    
    setSelectedItems(newSelectedItems);
  };

  const updateReturnItem = (orderItemId: number, field: keyof ReturnItem, value: string | number) => {
    const newSelectedItems = new Map(selectedItems);
    const item = newSelectedItems.get(orderItemId);
    
    if (item) {
      newSelectedItems.set(orderItemId, {
        ...item,
        [field]: value
      });
      setSelectedItems(newSelectedItems);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedItems.size === 0) {
      setError('Debes seleccionar al menos un producto para devolver');
      return;
    }
    
    if (!returnReason || !description.trim()) {
      setError('Debes completar todos los campos obligatorios');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const returnData = {
        orderId: parseInt(orderId!),
        reason: returnReason,
        description: description.trim(),
        items: Array.from(selectedItems.values())
      };

      await axios.post(`${API_BASE_URL}/orders/${orderId}/returns`, returnData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Redirect to orders page with success message
      navigate('/orders', { 
        state: { 
          message: 'Solicitud de devolución enviada exitosamente. Te contactaremos pronto.' 
        }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating return request');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateRefundAmount = () => {
    let total = 0;
    selectedItems.forEach((returnItem, orderItemId) => {
      const orderItem = order?.items.find(item => item.id === orderItemId);
      if (orderItem) {
        total += orderItem.price * returnItem.quantity;
      }
    });
    return total;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌</div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Volver a Mis Pedidos
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Solicitar Devolución</h1>
          <p className="mt-2 text-gray-600">Pedido #{order.orderNumber}</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Return Reason */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Motivo de la Devolución</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Por qué quieres devolver este pedido? *
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona un motivo</option>
                  <option value="defective">Producto defectuoso</option>
                  <option value="wrong_size">Talla incorrecta</option>
                  <option value="not_as_described">No es como se describe</option>
                  <option value="changed_mind">Cambié de opinión</option>
                  <option value="damaged_in_shipping">Dañado en el envío</option>
                  <option value="other">Otro motivo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción detallada *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explica en detalle el motivo de la devolución..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Items Selection */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Productos a Devolver</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={(e) => handleItemSelection(item, e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">Sin imagen</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">
                        Precio: ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      
                      {selectedItems.has(item.id) && (
                        <div className="mt-3 space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Cantidad a devolver
                            </label>
                            <input
                              type="number"
                              min="1"
                              max={item.quantity}
                              value={selectedItems.get(item.id)?.quantity || item.quantity}
                              onChange={(e) => updateReturnItem(item.id, 'quantity', parseInt(e.target.value))}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Condición del producto
                            </label>
                            <select
                              value={selectedItems.get(item.id)?.condition || ''}
                              onChange={(e) => updateReturnItem(item.id, 'condition', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="">Seleccionar condición</option>
                              <option value="new">Nuevo/Sin usar</option>
                              <option value="used">Usado</option>
                              <option value="damaged">Dañado</option>
                              <option value="defective">Defectuoso</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Notas adicionales
                            </label>
                            <textarea
                              value={selectedItems.get(item.id)?.notes || ''}
                              onChange={(e) => updateReturnItem(item.id, 'notes', e.target.value)}
                              rows={2}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Información adicional sobre este producto..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {selectedItems.size > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Resumen de Devolución</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Productos seleccionados:</span>
                  <span className="text-sm font-medium">{selectedItems.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monto estimado de reembolso:</span>
                  <span className="text-lg font-bold text-green-600">
                    ${calculateRefundAmount().toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                * El monto final del reembolso puede variar según la condición de los productos recibidos.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || selectedItems.size === 0}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Enviando...' : 'Solicitar Devolución'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnRequest;
