export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  sessions: {
    all: ['sessions'] as const,
    list: (filters?: Record<string, unknown>) => ['sessions', 'list', filters] as const,
    detail: (id: string) => ['sessions', 'detail', id] as const,
  },
  plans: {
    all: ['plans'] as const,
    list: () => ['plans', 'list'] as const,
    detail: (id: string) => ['plans', 'detail', id] as const,
  },
  calendar: {
    range: (from: string, to: string, planId?: string) => ['calendar', { from, to, planId }] as const,
  },
  goals: {
    all: ['goals'] as const,
    weeklyProgress: ['goals', 'progress', 'weekly'] as const,
  },
  activityTypes: {
    all: ['activity-types'] as const,
  },
} as const;
