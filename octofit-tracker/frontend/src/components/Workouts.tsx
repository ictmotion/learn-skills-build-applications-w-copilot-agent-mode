import { CapabilityCard } from './CapabilityCard.js';

export default function Workouts() {
  return (
    <CapabilityCard
      title="Workout suggestions"
      description="Recommend workouts from activity patterns."
      endpoint={`/api/workouts/suggestions/${encodeURIComponent('mona@example.com')}`}
      itemsKey="suggestions"
      emptyMessage="No workout suggestions yet."
      renderItem={(workout) => (
        <><strong>{String(workout.title ?? 'Workout')}</strong>{workout.reason ? `: ${String(workout.reason)}` : ''}</>
      )}
    />
  );
}
