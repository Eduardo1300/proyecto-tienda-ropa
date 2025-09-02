import React, { useState } from 'react';
import { updateProductImages, checkProductImages, cleanupProductData } from '../utils/productImageUpdater';
import { Button } from '../components/ui';

const ProductImageManager: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [checkResults, setCheckResults] = useState<{
    needUpdate: any[];
    total: number;
  } | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleCheckImages = async () => {
    setIsChecking(true);
    setMessages([]);
    try {
      addMessage('🔍 Verificando imágenes de productos...');
      const results = await checkProductImages();
      setCheckResults(results);
      addMessage(`✅ Verificación completada: ${results.needUpdate.length}/${results.total} productos necesitan actualización`);
    } catch (error) {
      addMessage(`❌ Error verificando imágenes: ${error}`);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUpdateImages = async () => {
    setIsUpdating(true);
    setMessages([]);
    try {
      addMessage('🔄 Actualizando imágenes de productos...');
      await updateProductImages();
      addMessage('✅ Actualización de imágenes completada');
      // Limpiar resultados de verificación
      setCheckResults(null);
    } catch (error) {
      addMessage(`❌ Error actualizando imágenes: ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCleanupData = async () => {
    setIsCleaning(true);
    setMessages([]);
    try {
      addMessage('🧹 Limpiando y normalizando datos de productos...');
      await cleanupProductData();
      addMessage('✅ Limpieza de datos completada');
      // Limpiar resultados de verificación
      setCheckResults(null);
    } catch (error) {
      addMessage(`❌ Error en limpieza de datos: ${error}`);
    } finally {
      setIsCleaning(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setCheckResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            📸 Gestor de Imágenes de Productos
          </h1>
          
          <div className="text-gray-600 mb-8">
            <p className="mb-4">
              Esta herramienta te permite gestionar automáticamente las imágenes de los productos,
              asegurando que cada producto tenga una imagen apropiada según su nombre y categoría.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">🔧 Funcionalidades:</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• <strong>Verificar:</strong> Revisa qué productos necesitan actualización de imagen</li>
                <li>• <strong>Actualizar Imágenes:</strong> Asigna automáticamente imágenes apropiadas</li>
                <li>• <strong>Limpiar Datos:</strong> Normaliza nombres y descripciones de productos</li>
              </ul>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Button
              onClick={handleCheckImages}
              loading={isChecking}
              disabled={isUpdating || isCleaning}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">🔍</span>
              Verificar Imágenes
            </Button>

            <Button
              onClick={handleUpdateImages}
              loading={isUpdating}
              disabled={isChecking || isCleaning}
              variant="primary"
              className="h-20 flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">🖼️</span>
              Actualizar Imágenes
            </Button>

            <Button
              onClick={handleCleanupData}
              loading={isCleaning}
              disabled={isChecking || isUpdating}
              variant="secondary"
              className="h-20 flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">🧹</span>
              Limpiar Datos
            </Button>
          </div>

          {/* Resultados de verificación */}
          {checkResults && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📊 Resultados de Verificación
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{checkResults.total}</div>
                  <div className="text-sm text-gray-600">Total de productos</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{checkResults.needUpdate.length}</div>
                  <div className="text-sm text-gray-600">Necesitan actualización</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {checkResults.total - checkResults.needUpdate.length}
                  </div>
                  <div className="text-sm text-gray-600">Están correctos</div>
                </div>
              </div>

              {checkResults.needUpdate.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Productos que necesitan actualización:
                  </h4>
                  <div className="max-h-64 overflow-y-auto">
                    {checkResults.needUpdate.map((product) => (
                      <div key={product.id} className="bg-white rounded-lg p-3 mb-2 border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{product.name}</span>
                            <span className="text-gray-500 ml-2">({product.category})</span>
                          </div>
                          <div className="text-sm text-gray-500">ID: {product.id}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Log de mensajes */}
          {messages.length > 0 && (
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">📋 Log de Actividad</h3>
                <Button
                  onClick={clearMessages}
                  variant="outline"
                  size="sm"
                  className="text-gray-400 border-gray-600 hover:bg-gray-800"
                >
                  Limpiar
                </Button>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {messages.map((message, index) => (
                  <div key={index} className="whitespace-pre-wrap">
                    {message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Información Importante</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Los cambios se aplicarán directamente en la base de datos</li>
              <li>• Se recomienda hacer una verificación antes de actualizar</li>
              <li>• Las imágenes se obtienen de Unsplash y son de alta calidad</li>
              <li>• La limpieza de datos también mejora nombres y descripciones vacías</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageManager;
