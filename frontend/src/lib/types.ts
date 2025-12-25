export interface Ticket {
  id: string;
  external_id?: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  tags?: string[];
  customer_id?: string;
  customer_email?: string;
  customer_name?: string;
  assignee_id?: string;
  assignee_name?: string;
  created_at: string;
  updated_at?: string;
  resolved_at?: string;
  analysis?: TicketAnalysis;
}

export interface TicketAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  sentiment_score: number;
  urgency_score: number;
  category: string;
  sub_category?: string;
  key_entities: string[];
  suggested_response?: string;
  similar_tickets?: string[];
  resolution_suggestion?: string;
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  pattern_type: 'recurring_issue' | 'trend' | 'anomaly';
  status: 'active' | 'resolved' | 'monitoring';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ticket_count: number;
  ticket_ids: string[];
  root_cause?: string;
  suggested_actions?: string[];
  tags?: string[];
  first_detected: string;
  last_detected: string;
  created_at: string;
}

export interface KnowledgeGap {
  id: string;
  topic: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  ticket_count: number;
  ticket_ids: string[];
  suggested_faqs?: string[];
  suggested_articles?: string[];
  created_at: string;
}

export interface DashboardStats {
  total_tickets: number;
  ticket_change: number;
  patterns_count: number;
  pattern_change: number;
  gaps_count: number;
  gaps_change: number;
  avg_resolution_hours: number;
  resolution_change: number;
}

export interface Analytics {
  tickets_over_time: { date: string; count: number }[];
  tickets_by_category: { category: string; count: number }[];
  resolution_times: { priority: string; avg_hours: number }[];
  sentiment_distribution: { sentiment: string; count: number }[];
  first_response_time: number;
  resolution_rate: number;
  csat_score: number;
  escalation_rate: number;
}
