'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface BusinessAccount {
  email: string;
  companyName: string;
  companyCode: string;
  phone: string;
  registeredAt: string;
}

interface BusinessAuthContextType {
  isBusinessUser: boolean;
  businessAccount: BusinessAccount | null;
  discountRate: number;
  setBusinessAccount: (account: BusinessAccount | null) => void;
  clearBusinessAccount: () => void;
}

const BusinessAuthContext = createContext<BusinessAuthContextType | undefined>(undefined);

export function BusinessAuthProvider({ children }: { children: React.ReactNode }) {
  const [businessAccount, setBusinessAccountState] = useState<BusinessAccount | null>(null);
  const { user } = useAuth();
  const discountRate = 5; // 5% discount for business users

  useEffect(() => {
    if (user) {
      const storedData = localStorage.getItem('businessAccount');
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          if (parsed.email === user.email) {
            setBusinessAccountState(parsed);
          } else {
            localStorage.removeItem('businessAccount');
            setBusinessAccountState(null);
          }
        } catch (error) {
          console.error('Error parsing business account data:', error);
          localStorage.removeItem('businessAccount');
        }
      }
    } else {
      setBusinessAccountState(null);
    }
  }, [user]);

  const setBusinessAccount = (account: BusinessAccount | null) => {
    if (!user && account) {
      console.error('Cannot set business account without authenticated user');
      return;
    }

    if (account && user && account.email !== user.email) {
      console.error('Business account email must match authenticated user email');
      return;
    }

    setBusinessAccountState(account);
    if (account) {
      localStorage.setItem('businessAccount', JSON.stringify(account));
    } else {
      localStorage.removeItem('businessAccount');
    }
  };

  const clearBusinessAccount = () => {
    setBusinessAccountState(null);
    localStorage.removeItem('businessAccount');
  };

  const isBusinessUser = !!user && !!businessAccount;

  return (
    <BusinessAuthContext.Provider
      value={{
        isBusinessUser,
        businessAccount,
        discountRate,
        setBusinessAccount,
        clearBusinessAccount,
      }}
    >
      {children}
    </BusinessAuthContext.Provider>
  );
}

export function useBusinessAuth() {
  const context = useContext(BusinessAuthContext);
  if (context === undefined) {
    throw new Error('useBusinessAuth must be used within a BusinessAuthProvider');
  }
  return context;
}
