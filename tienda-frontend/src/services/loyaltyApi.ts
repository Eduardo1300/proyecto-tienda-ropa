import api from './api';

// Types for Loyalty
export interface LoyaltyProgram {
  id: number;
  name: string;
  description: string;
  pointsPerDollar: number;
  welcomeBonusPoints: number;
  referralBonusPoints: number;
  reviewBonusPoints: number;
  birthdayBonusPoints: number;
  minRedemptionPoints: number;
  isActive: boolean;
  tiers: LoyaltyTier[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyTier {
  id: number;
  name: string;
  minPoints: number;
  maxPoints?: number;
  multiplier: number;
  benefits: string[];
  color: string;
  description: string;
}

export interface UserLoyaltyProgram {
  id: number;
  user: any; // User entity
  program: LoyaltyProgram;
  currentPoints: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  currentTier: LoyaltyTier;
  joinedAt: Date;
  lastActivityAt: Date;
  referralCode: string;
  referredBy?: any; // User entity
}

export interface LoyaltyTransaction {
  id: number;
  user: any;
  program: LoyaltyProgram;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'BONUS' | 'REFERRAL';
  points: number;
  description: string;
  orderId?: number;
  referenceId?: string;
  metadata?: any;
  expirationDate?: Date;
  createdAt: Date;
}

export interface RedeemPointsData {
  points: number;
  rewardType: 'DISCOUNT' | 'PRODUCT' | 'SHIPPING';
  metadata?: any;
}

export interface BonusPointsData {
  points?: number;
  orderId?: number;
  reviewId?: number;
  referredUserId?: number;
  metadata?: any;
}

export interface LeaderboardEntry {
  userId: number;
  userName: string;
  userEmail: string;
  currentPoints: number;
  totalPointsEarned: number;
  currentTier: string;
  position: number;
}

// Loyalty API functions
export const loyaltyAPI = {
  // Get user's loyalty program
  getUserProgram: () => 
    api.get<{ success: boolean; data: UserLoyaltyProgram }>('/loyalty/program'),

  // Redeem points
  redeemPoints: (redeemData: RedeemPointsData) => 
    api.post<{ success: boolean; data: LoyaltyTransaction; message: string }>('/loyalty/redeem', redeemData),

  // Get user's loyalty transactions
  getTransactions: (filters?: { limit?: number; offset?: number }) => 
    api.get<{ success: boolean; data: { transactions: LoyaltyTransaction[]; total: number } }>('/loyalty/transactions', { params: filters }),

  // Test endpoint (temporal)
  testConnection: () => 
    api.get<{ success: boolean; message: string; timestamp: string }>('/loyalty/test'),

  // Get loyalty leaderboard
  getLeaderboard: (filters?: { limit?: number; tier?: string }) => 
    api.get<{ success: boolean; data: LeaderboardEntry[] }>('/loyalty/leaderboard', { params: filters }),

  // Give review bonus points
  giveReviewBonus: (bonusData: BonusPointsData) => 
    api.post<{ success: boolean; data: LoyaltyTransaction; message: string }>('/loyalty/review-bonus', bonusData),

  // Give birthday bonus points
  giveBirthdayBonus: () => 
    api.post<{ success: boolean; data: LoyaltyTransaction; message: string }>('/loyalty/birthday-bonus'),

  // Give referral bonus points
  giveReferralBonus: (bonusData: BonusPointsData) => 
    api.post<{ success: boolean; data: LoyaltyTransaction; message: string }>('/loyalty/referral-bonus', bonusData),
};

export default loyaltyAPI;
