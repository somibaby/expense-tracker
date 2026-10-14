import { useEffect, useState } from 'react';

// A ticking clock so time-based UI (the greeting, "today" highlighting, the
// current month) updates while the app stays open, instead of freezing at
// whatever moment the screen first mounted.
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
