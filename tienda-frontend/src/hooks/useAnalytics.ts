import { useState, useEffect } from 'react';
import { analyticsAPI, type AnalyticsDashboard, type AnalyticsDateRange } from '../services/analyticsApi';

export const useAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWithErrorHandling = async <T>(
    apiCall: () => Promise<{ data: { success: boolean; data: T } }>,
    setData: (data: T) => void
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError('Error al obtener datos');
      }
    } catch (err) {
      console.error('Analytics API Error:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fetchWithErrorHandling,
  };
};

export const useAnalyticsDashboard = (dateRange?: AnalyticsDateRange) => {
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null);
  const { isLoading, error, fetchWithErrorHandling } = useAnalytics();

  const fetchDashboard = () => {
    fetchWithErrorHandling(
      () => analyticsAPI.getDashboard(dateRange),
      setDashboard
    );
  };

  useEffect(() => {
    fetchDashboard();
  }, [dateRange?.startDate, dateRange?.endDate]);

  return {
    dashboard,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
};

export const useSalesMetrics = (dateRange?: AnalyticsDateRange) => {
  const [salesData, setSalesData] = useState<any>(null);
  const { isLoading, error, fetchWithErrorHandling } = useAnalytics();

  const fetchSalesMetrics = () => {
    fetchWithErrorHandling(
      () => analyticsAPI.getSalesMetrics(dateRange),
      setSalesData
    );
  };

  useEffect(() => {
    fetchSalesMetrics();
  }, [dateRange?.startDate, dateRange?.endDate]);

  return {
    salesData,
    isLoading,
    error,
    refetch: fetchSalesMetrics,
  };
};

export const useUserActivity = (dateRange?: AnalyticsDateRange) => {
  const [userData, setUserData] = useState<any>(null);
  const { isLoading, error, fetchWithErrorHandling } = useAnalytics();

  const fetchUserActivity = () => {
    fetchWithErrorHandling(
      () => analyticsAPI.getUserActivity(dateRange),
      setUserData
    );
  };

  useEffect(() => {
    fetchUserActivity();
  }, [dateRange?.startDate, dateRange?.endDate]);

  return {
    userData,
    isLoading,
    error,
    refetch: fetchUserActivity,
  };
};

export const useAnalyticsTracking = () => {
  const trackEvent = async (eventData: any) => {
    try {
      await analyticsAPI.trackEvent(eventData);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  const trackPageView = async (page: string, userId?: number) => {
    try {
      await analyticsAPI.trackPageView({
        page,
        userId,
        sessionId: getSessionId(),
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const trackProductView = async (productId: number, userId?: number) => {
    try {
      await analyticsAPI.trackProductView({
        productId,
        userId,
        sessionId: getSessionId(),
      });
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };

  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  };

  return {
    trackEvent,
    trackPageView,
    trackProductView,
  };
};
