import api from './api';

// Types para direcciones
export interface UserAddress {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: 'home' | 'office' | 'other';
  isDefault: boolean;
  label?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: 'home' | 'office' | 'other';
  isDefault?: boolean;
  label?: string;
}

// Types para preferencias
export interface UserPreferences {
  id: number;
  emailNotifications: boolean;
  orderNotifications: boolean;
  promotionNotifications: boolean;
  weeklyNewsletter: boolean;
  profilePublic: boolean;
  showPurchaseHistory: boolean;
  allowDataCollection: boolean;
  twoFactorEnabled: boolean;
  twoFactorMethod: string;
  lastLoginAt?: Date;
  lastPasswordChangeAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatePreferencesData {
  emailNotifications?: boolean;
  orderNotifications?: boolean;
  promotionNotifications?: boolean;
  weeklyNewsletter?: boolean;
  profilePublic?: boolean;
  showPurchaseHistory?: boolean;
  allowDataCollection?: boolean;
  twoFactorEnabled?: boolean;
  twoFactorMethod?: string;
}

// API Service
export const userAddressAPI = {
  // Direcciones
  getAddresses: () =>
    api.get<{ success: boolean; data: UserAddress[] }>('/users/addresses'),

  getAddress: (id: number) =>
    api.get<{ success: boolean; data: UserAddress }>(`/users/addresses/${id}`),

  createAddress: (data: CreateAddressData) =>
    api.post<{ success: boolean; data: UserAddress; message: string }>(
      '/users/addresses',
      data
    ),

  updateAddress: (id: number, data: Partial<CreateAddressData>) =>
    api.put<{ success: boolean; data: UserAddress; message: string }>(
      `/users/addresses/${id}`,
      data
    ),

  deleteAddress: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/users/addresses/${id}`),

  setDefaultAddress: (id: number) =>
    api.post<{ success: boolean; data: UserAddress; message: string }>(
      `/users/addresses/${id}/set-default`
    ),

  // Preferencias
  getPreferences: () =>
    api.get<{ success: boolean; data: UserPreferences }>(
      '/users/preferences'
    ),

  updatePreferences: (data: UpdatePreferencesData) =>
    api.put<{ success: boolean; data: UserPreferences; message: string }>(
      '/users/preferences',
      data
    ),

  // Perfil
  updateProfile: (data: any) =>
    api.put<{ success: boolean; data: any; message: string }>(
      '/users/profile',
      data
    ),
};
