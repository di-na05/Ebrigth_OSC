import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ticketDataStore, type MockTicket, type TicketStatus } from '../data/mockData';

interface TicketsContextType {
  tickets: MockTicket[];
  refreshTickets: () => void;
  updateTicketStatus: (id: number, status: TicketStatus, adminRemark?: string, rejectionReason?: string) => void;
  createTicket: (ticket: Omit<MockTicket, 'id' | 'createdAt' | 'updatedAt'>) => MockTicket | null;
  deleteTicket: (id: number) => boolean;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export function TicketsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [, setRefreshTrigger] = useState(0);
  const [tickets, setTickets] = useState<MockTicket[]>(() => ticketDataStore.getTickets());

  const refreshTickets = useCallback(() => {
    setTickets(ticketDataStore.getTickets());
    setRefreshTrigger(prev => prev + 1);
    // Invalidate all React Query ticket-related caches
    queryClient.invalidateQueries({ queryKey: ['tickets'] });
    queryClient.invalidateQueries({ queryKey: ['platformTickets'] });
    queryClient.invalidateQueries({ queryKey: ['userTickets'] });
  }, [queryClient]);

  const updateTicketStatus = useCallback((id: number, status: TicketStatus, adminRemark?: string, rejectionReason?: string) => {
    const updated = ticketDataStore.updateTicketStatus(id, status, adminRemark, rejectionReason);
    if (updated) {
      refreshTickets();
    }
  }, [refreshTickets]);

  const createTicket = useCallback((ticket: Omit<MockTicket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTicket = ticketDataStore.createTicket(ticket);
    refreshTickets();
    return newTicket;
  }, [refreshTickets]);

  const deleteTicket = useCallback((id: number) => {
    const deleted = ticketDataStore.deleteTicket(id);
    if (deleted) {
      refreshTickets();
    }
    return deleted;
  }, [refreshTickets]);

  return (
    <TicketsContext.Provider
      value={{
        tickets,
        refreshTickets,
        updateTicketStatus,
        createTicket,
        deleteTicket,
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
}

export function useTicketsContext() {
  const context = useContext(TicketsContext);
  if (context === undefined) {
    throw new Error('useTicketsContext must be used within TicketsProvider');
  }
  return context;
}
