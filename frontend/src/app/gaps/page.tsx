'use client';

import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, BookOpen, Lightbulb, Plus } from 'lucide-react';
import { api } from '@/lib/api';

export default function GapsPage() {
  const { data: gaps, isLoading } = useQuery({
    queryKey: ['knowledge-gaps'],
    queryFn: () => api.getKnowledgeGaps(),
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'badge-danger';
      case 'medium':
        return 'badge-warning';
      default:
        return 'badge-primary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Gaps</h1>
          <p className="mt-1 text-gray-600">
            Missing documentation and FAQ suggestions
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Generate FAQ
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Gaps</p>
              <p className="text-2xl font-bold text-gray-900">
                {gaps?.length ?? 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {gaps?.filter((g) => g.priority === 'high').length ?? 0}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Lightbulb className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">FAQs Suggested</p>
              <p className="text-2xl font-bold text-gray-900">
                {gaps?.reduce((acc, g) => acc + (g.suggested_faqs?.length ?? 0), 0) ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gap List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : gaps && gaps.length > 0 ? (
        <div className="space-y-4">
          {gaps.map((gap) => (
            <div key={gap.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {gap.topic}
                    </h3>
                    <span className={`badge ${getPriorityColor(gap.priority)}`}>
                      {gap.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{gap.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      <strong>{gap.ticket_count}</strong> related tickets
                    </span>
                    <span>
                      Category: <strong>{gap.category}</strong>
                    </span>
                  </div>

                  {gap.suggested_faqs && gap.suggested_faqs.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                          Suggested FAQs
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {gap.suggested_faqs.map((faq, index) => (
                          <li
                            key={index}
                            className="text-sm text-blue-800 flex items-start gap-2"
                          >
                            <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            {faq}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button className="btn btn-secondary text-sm">
                  Create Article
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No knowledge gaps detected</p>
        </div>
      )}
    </div>
  );
}
