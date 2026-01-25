import { useEffect } from 'react';
import { useAnalyticsTracking } from './useAnalytics';
import { useAuth } from '../context/AuthContext';

export const usePageTracking = (pageName: string) => {
  const { trackPageView } = useAnalyticsTracking();
  const { user } = useAuth();

  useEffect(() => {
    trackPageView(pageName, user?.id);
  }, [pageName, user?.id, trackPageView]);
};

export const useProductTracking = (productId?: number) => {
  const { trackProductView } = useAnalyticsTracking();
  const { user } = useAuth();

  useEffect(() => {
    if (productId) {
      trackProductView(productId, user?.id);
    }
  }, [productId, user?.id, trackProductView]);
};
