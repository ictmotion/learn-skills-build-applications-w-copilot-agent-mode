import { useEffect, useState, type ReactNode } from 'react';

type Props = {
  title: string;
  description: string;
  loadData: () => Promise<unknown>;
  itemsKey: string;
  emptyMessage: string;
  renderItem: (item: Record<string, unknown>) => ReactNode;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function CapabilityCard({ title, description, loadData, itemsKey, emptyMessage, renderItem }: Props) {
  const [items, setItems] = useState<Record<string, unknown>[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    loadData()
      .then((response) => {
        const values = isRecord(response) ? response[itemsKey] : undefined;
        if (!Array.isArray(values)) throw new Error(`Unexpected response for ${title.toLowerCase()}`);
        const records = values.filter(isRecord);
        if (records.length !== values.length) throw new Error(`Unexpected response for ${title.toLowerCase()}`);
        if (!cancelled) setItems(records);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : 'Request failed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [loadData, itemsKey, title]);

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">{title}</h2>
        <p>{description}</p>
        {loading ? (
          <p role="status">Loading {title.toLowerCase()}...</p>
        ) : error ? (
          <p role="alert">Unable to load {title.toLowerCase()}: {error}</p>
        ) : items?.length === 0 ? (
          <p>{emptyMessage}</p>
        ) : (
          <ul>{items?.map((item, index) => (
            <li key={String(item._id ?? index)}>{renderItem(item)}</li>
          ))}</ul>
        )}
      </div>
    </section>
  );
}
