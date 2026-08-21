import { useState, useEffect, useRef } from "react";
import { emptyWeek } from "../data/constants";

const defaultData = { tasks: [], week: emptyWeek(), goals: [], todayEnergy: "medium", todayWin: "" };

// Local-first data store: everything lives in localStorage. Optional cloud
// sync is layered on top separately by useCloudSync, kept apart on purpose.
export default function useDataStore() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    const local = localStorage.getItem("gsd-data");
    if (local) {
      const parsed = JSON.parse(local);
      setData({ ...defaultData, ...parsed, week: { ...emptyWeek(), ...(parsed.week || {}) } });
    }
    loaded.current = true;
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    localStorage.setItem("gsd-data", JSON.stringify(data));
  }, [data]);

  return [data, setData, loading];
}
