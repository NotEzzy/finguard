import { create } from 'zustand';

export type RiskLevel = 'safe' | 'suspicious' | 'fraudulent';

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  merchant: string;
  category: string;
  riskLevel: RiskLevel;
  flagged: boolean;
}

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  selectedTransaction: Transaction | null;
  riskFilter: RiskLevel | 'all';
  setTransactions: (transactions: Transaction[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  setRiskFilter: (filter: RiskLevel | 'all') => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoading: false,
  error: null,
  selectedTransaction: null,
  riskFilter: 'all',
  setTransactions: (transactions) => set({ transactions }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),
  setRiskFilter: (filter) => set({ riskFilter: filter }),
})); 