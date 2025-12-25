import axios from 'axios';
import type { Ticket, Pattern, KnowledgeGap, Analytics, DashboardStats } from './types';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Dashboard
  async getStats(): Promise<DashboardStats> {
    const { data } = await client.get('/api/analytics/stats');
    return data;
  },

  // Tickets
  async getTickets(params?: {
    search?: string;
    status?: string;
    priority?: string;
    skip?: number;
    limit?: number;
  }): Promise<Ticket[]> {
    const { data } = await client.get('/api/tickets', { params });
    return data;
  },

  async getTicket(id: string): Promise<Ticket> {
    const { data } = await client.get(`/api/tickets/${id}`);
    return data;
  },

  async createTicket(ticket: Partial<Ticket>): Promise<Ticket> {
    const { data } = await client.post('/api/tickets', ticket);
    return data;
  },

  async analyzeTicket(id: string): Promise<Ticket> {
    const { data } = await client.post(`/api/tickets/${id}/analyze`);
    return data;
  },

  async getRecentTickets(limit: number = 5): Promise<Ticket[]> {
    const { data } = await client.get('/api/tickets', {
      params: { limit, sort: '-created_at' },
    });
    return data;
  },

  // Patterns
  async getPatterns(): Promise<Pattern[]> {
    const { data } = await client.get('/api/patterns');
    return data;
  },

  async getPattern(id: string): Promise<Pattern> {
    const { data } = await client.get(`/api/patterns/${id}`);
    return data;
  },

  async detectPatterns(): Promise<Pattern[]> {
    const { data } = await client.post('/api/patterns/detect');
    return data;
  },

  // Knowledge Gaps
  async getKnowledgeGaps(): Promise<KnowledgeGap[]> {
    const { data } = await client.get('/api/patterns/gaps');
    return data;
  },

  // Analytics
  async getAnalytics(): Promise<Analytics> {
    const { data } = await client.get('/api/analytics');
    return data;
  },
};
