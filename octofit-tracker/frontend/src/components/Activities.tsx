import { useCallback } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

export default function Activities() {
  const loadData = useCallback(() => getJson<unknown>('/api/activities'), []);

  return (
    <CapabilityCard
      title="Activities"
      description="Track student activity minutes and points."
      loadData={loadData}
      itemsKey="activities"
      emptyMessage="No activities yet."
      renderItem={(activity) => (
        <><strong>{String(activity.type ?? 'Activity')}</strong>: {String(activity.minutes ?? 0)} minutes, {String(activity.points ?? 0)} points</>
      )}
    />
  );
}
