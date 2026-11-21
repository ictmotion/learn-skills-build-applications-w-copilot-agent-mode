import { CapabilityCard } from './CapabilityCard.js';

export default function Teams() {
  return (
    <CapabilityCard
      title="Teams"
      description="Manage teams and members."
      endpoint="/api/teams"
      itemsKey="teams"
      emptyMessage="No teams yet."
      renderItem={(team) => (
        <><strong>{String(team.name ?? 'Team')}</strong>{team.mascot ? ` (${String(team.mascot)})` : ''}</>
      )}
    />
  );
}
