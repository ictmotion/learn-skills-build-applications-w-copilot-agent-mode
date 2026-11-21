import { useCallback } from 'react';
import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';

export default function Workouts() {
  const loadData = useCallback(
    () => getJson<unknown>(`/api/workouts/suggestions/${encodeURIComponent('mona@example.com')}`),
    [],
  );

  return (
    <CapabilityCard
      title="Workout suggestions"
      description="Recommend workouts from activity patterns."
      loadData={loadData}
      itemsKey="suggestions"
      emptyMessage="No workout suggestions yet."
      renderItem={(workout) => (
        <><strong>{String(workout.title ?? 'Workout')}</strong>{workout.reason ? `: ${String(workout.reason)}` : ''}</>
      )}
    />
  );
}
