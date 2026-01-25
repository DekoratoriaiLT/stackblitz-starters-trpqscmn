'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface BusinessAccount {
  email: string;
  companyName: string;
  companyCode: string;
  phone: string;
  registeredAt: string;
}

export type UserMode = 'standard' | 'business';

interface BusinessAuthContextType {
  hasBusinessAccount: boolean;
  isBusinessMode: boolean;
  businessAccount: BusinessAccount | null;
  discountRate: number;
  currentMode: UserMode;
  setBusinessAccount: (account: BusinessAccount | null) => void;
  clearBusinessAccount: () => void;
  switchToBusinessMode: () => void;
  switchToStandardMode: () => void;
}

const BusinessAuthContext = createContext<BusinessAuthContextType | undefined>(undefined);

export function BusinessAuthProvider({ children }: { children: React.ReactNode }) {
  const [businessAccount, setBusinessAccountState] = useState<BusinessAccount | null>(null);
  const [currentMode, setCurrentMode] = useState<UserMode>('standard');
  const { user } = useAuth();
  const discountRate = 5; // 5% discount for business users

  useEffect(() => {
    if (user) {
      // Load business account
      const storedData = localStorage.getItem('businessAccount');
      if (storedData) {
        try {
          const parsed: BusinessAccount = JSON.parse(storedData);
          if (parsed.email === user.email) setBusinessAccountState(parsed);
          else localStorage.removeItem('businessAccount');
        } catch {
          localStorage.removeItem('businessAccount');
        }
      }
      // Load user mode
      const storedMode = localStorage.getItem(`userMode_${user.uid}`) as UserMode;
      if (storedMode === 'business' || storedMode === 'standard') setCurrentMode(storedMode);
    } else {
      setBusinessAccountState(null);
      setCurrentMode('standard');
    }
  }, [user]);

  const setBusinessAccount = (account: BusinessAccount | null) => {
    if (!user && account) return console.error('Cannot set business account without user');
    if (account && user && account.email !== user.email)
      return console.error('Business account email must match user email');

    setBusinessAccountState(account);
    if (account) localStorage.setItem('businessAccount', JSON.stringify(account));
    else localStorage.removeItem('businessAccount');
  };

  const clearBusinessAccount = () => {
    setBusinessAccountState(null);
    setCurrentMode('standard');
    localStorage.removeItem('businessAccount');
    if (user) localStorage.removeItem(`userMode_${user.uid}`);
  };

  const switchToBusinessMode = () => {
    if (!businessAccount) return console.warn('No business account to switch to');
    setCurrentMode('business');
    if (user) localStorage.setItem(`userMode_${user.uid}`, 'business');
  };

  const switchToStandardMode = () => {
    setCurrentMode('standard');
    if (user) localStorage.setItem(`userMode_${user.uid}`, 'standard');
  };

  const hasBusinessAccount = !!user && !!businessAccount;
  const isBusinessMode = hasBusinessAccount && currentMode === 'business';

  return (
    <BusinessAuthContext.Provider
      value={{
        hasBusinessAccount,
        isBusinessMode,
        businessAccount,
        discountRate,
        currentMode,
        setBusinessAccount,
        clearBusinessAccount,
        switchToBusinessMode,
        switchToStandardMode,
      }}
    >
      {children}
    </BusinessAuthContext.Provider>
  );
}

export function useBusinessAuth() {
  const context = useContext(BusinessAuthContext);
  if (!context) throw new Error('useBusinessAuth must be used within BusinessAuthProvider');
  return context;
}
