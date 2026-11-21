import { useCallback } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

export default function Leaderboard() {
  const loadData = useCallback(() => getJson<unknown>('/api/leaderboard'), []);

  return (
    <CapabilityCard
      title="Leaderboard"
      description="Compare team point totals."
      loadData={loadData}
      itemsKey="leaderboard"
      emptyMessage="No leaderboard rankings yet."
      renderItem={(entry) => (
        <><strong>#{String(entry.rank ?? '')} {String(entry.teamName ?? 'Team')}</strong>: {String(entry.totalPoints ?? 0)} points</>
      )}
    />
  );
}
