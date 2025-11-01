// hooks/queries/useAgents.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const QUERY_KEYS = {
  agents: ['agents'],
  agent: (id: string) => ['agent', id],
  accounts: ['accounts'],
  account: (id: string) => ['account', id],
  transactions: (type?: string, date?: string) => ['transactions', type, date].filter(Boolean),
  receipts: (filter?: string) => ['receipts', filter].filter(Boolean),
  payments: (filter?: string) => ['payments', filter].filter(Boolean),
  recipients: ['recipients'],
  recipient: (id: string) => ['recipient', id],
  employees: ['employees'],
  employee: (id: string) => ['employee', id],
  ledger: (id: string, startDate?: string, endDate?: string) => 
    ['ledger', id, startDate, endDate].filter(Boolean),
};

// ============= AGENTS =============
export const useAgents = () => {
  return useQuery({
    queryKey: QUERY_KEYS.agents,
    queryFn: async () => {
      const { data } = await axios.get('/api/agents');
      return data;
    },
  });
};

export const useAgent = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.agent(id),
    queryFn: async () => {
      const { data } = await axios.get(`/api/agents/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateAgent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (agentData: any) => {
      const { data } = await axios.post('/api/agents', agentData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agents });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
    },
  });
};

export const useUpdateAgent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axios.put(`/api/agents/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agents });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agent(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
    },
  });
};

export const useDeleteAgent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/agents/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agents });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
    },
  });
};

// ============= ACCOUNTS =============
export const useAccounts = (filters?: { type?: string; linkedEntityType?: string; linkedEntityId?: string }) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.accounts, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.linkedEntityType) params.append('linkedEntityType', filters.linkedEntityType);
      if (filters?.linkedEntityId) params.append('linkedEntityId', filters.linkedEntityId);
      
      const { data } = await axios.get(`/api/accounts?${params.toString()}`);
      return data;
    },
  });
};

export const useAccount = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.account(id),
    queryFn: async () => {
      const { data } = await axios.get(`/api/accounts/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (accountData: any) => {
      const { data } = await axios.post('/api/accounts', accountData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axios.put(`/api/accounts/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.account(variables.id) });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/accounts/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
    },
  });
};

// ============= TRANSACTIONS =============

// Get all transactions or filter by type and/or date
export const useTransactions = (type?: string, date?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.transactions(type, date),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (date) params.append('date', date);
      
      const { data } = await axios.get(`/api/transactions?${params.toString()}`);
      return data;
    },
  });
};

// Get ALL transactions including journal entries (for opening balance calculation)
export const useAllTransactions = () => {
  return useQuery({
    queryKey: ['transactions', 'all'],
    queryFn: async () => {
      const { data } = await axios.get('/api/transactions');
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Get today's transactions (all types)
export const useTodayTransactions = () => {
  const today = new Date().toISOString().split("T")[0];
  return useQuery({
    queryKey: ['transactions', 'today', today],
    queryFn: async () => {
      const { data } = await axios.get(`/api/transactions?date=${today}`);
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transactionData: any) => {
      const { data } = await axios.post('/api/transactions', transactionData);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate all transaction-related queries
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agents });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axios.put(`/api/transactions/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agents });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/transactions/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.agents });
    },
  });
};

// ============= RECEIPTS =============
export const useReceipts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.receipts(),
    queryFn: async () => {
      const { data } = await axios.get('/api/transactions/receipts');
      return data;
    },
  });
};

// ============= PAYMENTS =============
export const usePayments = () => {
  return useQuery({
    queryKey: QUERY_KEYS.payments(),
    queryFn: async () => {
      const { data } = await axios.get('/api/transactions/payments');
      return data;
    },
  });
};

// ============= RECIPIENTS =============
export const useRecipients = () => {
  return useQuery({
    queryKey: QUERY_KEYS.recipients,
    queryFn: async () => {
      const { data } = await axios.get('/api/recipients');
      return data;
    },
  });
};

export const useRecipient = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.recipient(id),
    queryFn: async () => {
      const { data } = await axios.get(`/api/recipients/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateRecipient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (recipientData: any) => {
      const { data } = await axios.post('/api/recipients', recipientData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recipients });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
    },
  });
};

export const useUpdateRecipient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axios.put(`/api/recipients/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recipients });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recipient(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
    },
  });
};

export const useDeleteRecipient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/recipients/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recipients });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
    },
  });
};

// ============= EMPLOYEES =============
export const useEmployees = () => {
  return useQuery({
    queryKey: QUERY_KEYS.employees,
    queryFn: async () => {
      const { data } = await axios.get('/api/employees');
      return data;
    },
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.employee(id),
    queryFn: async () => {
      const { data } = await axios.get(`/api/employees/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (employeeData: any) => {
      const { data } = await axios.post('/api/employees', employeeData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axios.put(`/api/employees/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employee(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/employees/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
    },
  });
};

// ============= LEDGER =============
export const useLedger = (id: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.ledger(id, startDate, endDate),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const { data } = await axios.get(`/api/accounts/${id}/ledger?${params.toString()}`);
      return data;
    },
    enabled: !!id,
  });
};