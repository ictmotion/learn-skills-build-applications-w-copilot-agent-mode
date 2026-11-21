import { CapabilityCard } from './CapabilityCard.js';

export default function Leaderboard() {
  return (
    <CapabilityCard
      title="Leaderboard"
      description="Compare team point totals."
      endpoint="/api/leaderboard"
      itemsKey="leaderboard"
      emptyMessage="No leaderboard rankings yet."
      renderItem={(entry) => (
        <><strong>#{String(entry.rank ?? '')} {String(entry.teamName ?? 'Team')}</strong>: {String(entry.totalPoints ?? 0)} points</>
      )}
    />
  );
}
