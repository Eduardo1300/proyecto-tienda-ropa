import { useState, useEffect } from 'react';
import { loyaltyAPI, type UserLoyaltyProgram, type LoyaltyTransaction, type LeaderboardEntry } from '../services/loyaltyApi';

export const useLoyalty = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeWithErrorHandling = async <T>(
    apiCall: () => Promise<{ data: { success: boolean; data: T; message?: string } }>,
    onSuccess?: (data: T) => void,
    successMessage?: string
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      if (response.data.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        if (successMessage || response.data.message) {
          // You could show a toast notification here
          console.log(successMessage || response.data.message);
        }
        return response.data.data;
      } else {
        setError('Error en la operación de lealtad');
        return null;
      }
    } catch (err) {
      console.error('Loyalty API Error:', err);
      setError('Error al conectar con el servidor');
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

export const useLoyaltyProgram = () => {
  const [program, setProgram] = useState<UserLoyaltyProgram | null>(null);
  const { isLoading, error, executeWithErrorHandling } = useLoyalty();

  const fetchProgram = async () => {
    await executeWithErrorHandling(
      () => loyaltyAPI.getUserProgram(),
      setProgram
    );
  };

  useEffect(() => {
    fetchProgram();
  }, []);

  const redeemPoints = async (points: number, rewardType: 'DISCOUNT' | 'PRODUCT' | 'SHIPPING', metadata?: any) => {
    const transaction = await executeWithErrorHandling(
      () => loyaltyAPI.redeemPoints({ points, rewardType, metadata }),
      undefined,
      'Puntos canjeados exitosamente'
    );
    
    if (transaction) {
      // Refresh program data after successful redemption
      await fetchProgram();
    }
    
    return transaction;
  };

  return {
    program,
    isLoading,
    error,
    refetch: fetchProgram,
    redeemPoints,
  };
};

export const useLoyaltyTransactions = (filters?: { type?: string; startDate?: string; endDate?: string; page?: number; limit?: number }) => {
  const [transactions, setTransactions] = useState<{
    transactions: LoyaltyTransaction[];
    total: number;
    page: number;
    totalPages: number;
  } | null>(null);
  const { isLoading, error, executeWithErrorHandling } = useLoyalty();

  const fetchTransactions = async () => {
    await executeWithErrorHandling(
      () => loyaltyAPI.getTransactions(filters),
      (data) => {
        setTransactions({
          transactions: data.transactions,
          total: data.total,
          page: (filters?.page ?? 1),
          totalPages: Math.ceil((data.total ?? 0) / (filters?.limit ?? 10)),
        });
      }
    );
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters?.type, filters?.startDate, filters?.endDate, filters?.page, filters?.limit]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions,
  };
};

export const useLoyaltyLeaderboard = (filters?: { limit?: number; tier?: string }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(null);
  const { isLoading, error, executeWithErrorHandling } = useLoyalty();

  const fetchLeaderboard = async () => {
    await executeWithErrorHandling(
      () => loyaltyAPI.getLeaderboard(filters),
      setLeaderboard
    );
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [filters?.limit, filters?.tier]);

  return {
    leaderboard,
    isLoading,
    error,
    refetch: fetchLeaderboard,
  };
};

export const useLoyaltyActions = () => {
  const { executeWithErrorHandling } = useLoyalty();

  const giveReviewBonus = async (bonusData: { points?: number; orderId?: number; reviewId?: number; metadata?: any }) => {
    return await executeWithErrorHandling(
      () => loyaltyAPI.giveReviewBonus(bonusData),
      undefined,
      'Bonus por reseña otorgado'
    );
  };

  const giveBirthdayBonus = async () => {
    return await executeWithErrorHandling(
      () => loyaltyAPI.giveBirthdayBonus(),
      undefined,
      'Bonus de cumpleaños otorgado'
    );
  };

  const giveReferralBonus = async (bonusData: { referredUserId?: number; metadata?: any }) => {
    return await executeWithErrorHandling(
      () => loyaltyAPI.giveReferralBonus(bonusData),
      undefined,
      'Bonus por referido otorgado'
    );
  };

  return {
    giveReviewBonus,
    giveBirthdayBonus,
    giveReferralBonus,
  };
};
