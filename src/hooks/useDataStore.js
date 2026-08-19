import { useState, useEffect, useRef } from "react";
import { emptyWeek } from "../data/constants";

// Everything is saved to this one key in the browser's localStorage.
// This is local-first by design: no backend, no accounts, works offline.
const STORAGE_KEY = "gsd-data";

export default function useDataStore() {
  const [data, setData] = useState({ tasks: [], week: emptyWeek(), goals: [], todayEnergy: "medium", todayWin: "" });
  const [loading, setLoading] = useState(true);
  const loaded = useRef(false);

  // Load once on first mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData((d) => ({ ...d, ...parsed, week: { ...emptyWeek(), ...(parsed.week || {}) } }));
      }
    } catch (e) {
      // No saved data yet, or it was corrupted - just start fresh.
    } finally {
      loaded.current = true;
      setLoading(false);
    }
  }, []);

  // Save (debounced) whenever data changes, after the initial load has happened.
  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error("save failed", e);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [data]);

  return [data, setData, loading];
}
