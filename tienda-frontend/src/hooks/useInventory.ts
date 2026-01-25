import { useState, useEffect } from 'react';
import { inventoryAPI, type InventoryAlert, type StockMovement, type InventoryValue, type UpdateStockData, type MovementFilters } from '../services/inventoryApi';

export const useInventory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeWithErrorHandling = async <T>(
    apiCall: () => Promise<{ data: T }>,
    onSuccess?: (data: T) => void,
    successMessage?: string
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      if (onSuccess) {
        onSuccess(response.data);
      }
      if (successMessage) {
      }
      return response.data;
    } catch (err) {
      setError('Error al conectar con el servidor de inventario');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    executeWithErrorHandling,
  };
};

export const useInventoryAlerts = () => {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const { isLoading, error, executeWithErrorHandling } = useInventory();

  const fetchAlerts = async () => {
    await executeWithErrorHandling(
      () => inventoryAPI.getActiveAlerts(),
      setAlerts
    );
  };

  const acknowledgeAlert = async (alertId: number, notes?: string) => {
    const updatedAlert = await executeWithErrorHandling(
      () => inventoryAPI.acknowledgeAlert(alertId, { notes }),
      undefined,
      'Alerta reconocida exitosamente'
    );
    
    if (updatedAlert) {
      await fetchAlerts(); // Refresh alerts list
    }
    
    return updatedAlert;
  };

  const resolveAlert = async (alertId: number, notes?: string) => {
    const updatedAlert = await executeWithErrorHandling(
      () => inventoryAPI.resolveAlert(alertId, { notes }),
      undefined,
      'Alerta resuelta exitosamente'
    );
    
    if (updatedAlert) {
      await fetchAlerts(); // Refresh alerts list
    }
    
    return updatedAlert;
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return {
    alerts,
    isLoading,
    error,
    refetch: fetchAlerts,
    acknowledgeAlert,
    resolveAlert,
  };
};

export const useStockManagement = () => {
  const { executeWithErrorHandling } = useInventory();

  const updateStock = async (updateData: UpdateStockData) => {
    return await executeWithErrorHandling(
      () => inventoryAPI.updateStock(updateData),
      undefined,
      'Stock actualizado exitosamente'
    );
  };

  const reserveStock = async (productId: number, quantity: number) => {
    return await executeWithErrorHandling(
      () => inventoryAPI.reserveStock({ productId, quantity }),
      undefined,
      'Stock reservado exitosamente'
    );
  };

  const releaseStock = async (productId: number, quantity: number) => {
    return await executeWithErrorHandling(
      () => inventoryAPI.releaseStock({ productId, quantity }),
      undefined,
      'Stock liberado exitosamente'
    );
  };

  return {
    updateStock,
    reserveStock,
    releaseStock,
  };
};

export const useInventoryReports = () => {
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [expiringProducts, setExpiringProducts] = useState<any[]>([]);
  const [expiredProducts, setExpiredProducts] = useState<any[]>([]);
  const [inventoryValue, setInventoryValue] = useState<InventoryValue | null>(null);
  const { isLoading, error, executeWithErrorHandling } = useInventory();

  const fetchLowStockProducts = async () => {
    await executeWithErrorHandling(
      () => inventoryAPI.getLowStockProducts(),
      setLowStockProducts
    );
  };

  const fetchExpiringProducts = async (days?: number) => {
    await executeWithErrorHandling(
      () => inventoryAPI.getExpiringProducts(days),
      setExpiringProducts
    );
  };

  const fetchExpiredProducts = async () => {
    await executeWithErrorHandling(
      () => inventoryAPI.getExpiredProducts(),
      setExpiredProducts
    );
  };

  const fetchInventoryValue = async () => {
    await executeWithErrorHandling(
      () => inventoryAPI.getInventoryValue(),
      setInventoryValue
    );
  };

  const fetchAllReports = async () => {
    await Promise.all([
      fetchLowStockProducts(),
      fetchExpiringProducts(),
      fetchExpiredProducts(),
      fetchInventoryValue(),
    ]);
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  return {
    lowStockProducts,
    expiringProducts,
    expiredProducts,
    inventoryValue,
    isLoading,
    error,
    refetch: fetchAllReports,
    fetchLowStockProducts,
    fetchExpiringProducts,
    fetchExpiredProducts,
    fetchInventoryValue,
  };
};

export const useStockMovements = (filters?: MovementFilters) => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const { isLoading, error, executeWithErrorHandling } = useInventory();

  const fetchMovements = async () => {
    await executeWithErrorHandling(
      () => inventoryAPI.getStockMovements(filters),
      setMovements
    );
  };

  useEffect(() => {
    fetchMovements();
  }, [filters?.productId, filters?.startDate, filters?.endDate, filters?.type]);

  return {
    movements,
    isLoading,
    error,
    refetch: fetchMovements,
  };
};

export const useInventoryActions = () => {
  const { executeWithErrorHandling } = useInventory();

  const checkInventoryAlerts = async () => {
    return await executeWithErrorHandling(
      () => inventoryAPI.checkInventoryAlerts(),
      undefined,
      'Verificación de alertas completada'
    );
  };

  const processAutoRestock = async () => {
    return await executeWithErrorHandling(
      () => inventoryAPI.processAutoRestock(),
      undefined,
      'Proceso de reabastecimiento automático completado'
    );
  };

  return {
    checkInventoryAlerts,
    processAutoRestock,
  };
};
