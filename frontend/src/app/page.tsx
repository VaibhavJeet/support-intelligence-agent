'use client';

import { useQuery } from '@tanstack/react-query';
import {
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { MetricCard } from '@/components/MetricCard';
import { RecentTickets } from '@/components/RecentTickets';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.getStats(),
  });

  const navigationCards = [
    {
      title: 'Tickets',
      description: 'View and analyze support tickets',
      icon: MessageSquare,
      href: '/tickets',
      color: 'bg-blue-500',
    },
    {
      title: 'Patterns',
      description: 'Discover recurring issues and trends',
      icon: TrendingUp,
      href: '/patterns',
      color: 'bg-purple-500',
    },
    {
      title: 'Knowledge Gaps',
      description: 'Identify missing documentation',
      icon: AlertTriangle,
      href: '/gaps',
      color: 'bg-orange-500',
    },
    {
      title: 'Analytics',
      description: 'Support performance metrics',
      icon: BookOpen,
      href: '/analytics',
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          AI-powered insights into your support operations
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Tickets"
          value={stats?.total_tickets ?? 0}
          change={stats?.ticket_change ?? 0}
          loading={isLoading}
        />
        <MetricCard
          title="Patterns Detected"
          value={stats?.patterns_count ?? 0}
          change={stats?.pattern_change ?? 0}
          loading={isLoading}
        />
        <MetricCard
          title="Knowledge Gaps"
          value={stats?.gaps_count ?? 0}
          change={stats?.gaps_change ?? 0}
          trend="down"
          loading={isLoading}
        />
        <MetricCard
          title="Avg Resolution Time"
          value={`${stats?.avg_resolution_hours ?? 0}h`}
          change={stats?.resolution_change ?? 0}
          trend="down"
          loading={isLoading}
        />
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {navigationCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="card group hover:shadow-md transition-shadow"
          >
            <div
              className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
            >
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
              {card.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{card.description}</p>
            <div className="mt-4 flex items-center text-primary-600 text-sm font-medium">
              View
              <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Tickets */}
      <RecentTickets />
    </div>
  );
}
