import { useQuery } from '@tanstack/react-query';
import { useTicketsContext } from '../context/TicketsContext';
import { ticketDataStore } from '../data/mockData';
import { normalizePlatformName } from '../utils/platformUtils';

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketDataStore.getTickets(),
    staleTime: 0,
  });
}

export function useUserTickets(userId: number) {
  const { tickets } = useTicketsContext();

  return useQuery({
    queryKey: ['userTickets', userId],
    queryFn: () => ticketDataStore.getTicketsByUserId(userId),
    staleTime: 0,
    initialData: tickets.filter(t => t.userId === userId),
  });
}

export function useTicketById(id: number) {
  const { tickets } = useTicketsContext();

  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketDataStore.getTicketById(id),
    staleTime: 0,
    initialData: tickets.find(t => t.id === id),
  });
}

export function usePlatformTickets(platform: string) {
  const { tickets } = useTicketsContext();

  const normalizedPlatform = normalizePlatformName(platform);

  return useQuery({
    queryKey: ['platformTickets', platform],
    queryFn: () => ticketDataStore.getTicketsByPlatform(platform),
    staleTime: 0,
    initialData: tickets.filter(t => t.platform === normalizedPlatform),
  });
}
