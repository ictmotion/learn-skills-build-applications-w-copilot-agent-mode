import { useCallback } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

export default function Teams() {
  const loadData = useCallback(() => getJson<unknown>('/api/teams'), []);

  return (
    <CapabilityCard
      title="Teams"
      description="Manage teams and members."
      loadData={loadData}
      itemsKey="teams"
      emptyMessage="No teams yet."
      renderItem={(team) => (
        <><strong>{String(team.name ?? 'Team')}</strong>{team.mascot ? ` (${String(team.mascot)})` : ''}</>
      )}
    />
  );
}
