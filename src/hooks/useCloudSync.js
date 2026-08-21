import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { emptyWeek } from "../data/constants";

const TABLE = "gsd_data";

// Layers optional cross-device sync on top of the local-first data store.
// Nothing here is required for the app to work: signed out (or sync not
// configured at all), this hook does nothing and localStorage is still
// the whole story.
export default function useCloudSync(session, data, setData, dataLoading) {
  const [status, setStatus] = useState("idle"); // idle | pulling | pushing | synced | error
  const pulledForUser = useRef(null);

  // On sign-in: pull the person's saved row down (first device / most
  // recent save wins), or, if this is their very first sign-in, push
  // what's already sitting in this browser up as their starting point.
  useEffect(() => {
    if (!supabase || !session || dataLoading) return;
    if (pulledForUser.current === session.user.id) return;

    let cancelled = false;
    setStatus("pulling");

    (async () => {
      const { data: row, error } = await supabase
        .from(TABLE)
        .select("data")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setStatus("error");
        return;
      }

      if (row?.data) {
        setData((d) => ({ ...d, ...row.data, week: { ...emptyWeek(), ...(row.data.week || {}) } }));
      } else {
        await supabase.from(TABLE).upsert({ user_id: session.user.id, data, updated_at: new Date().toISOString() });
      }

      pulledForUser.current = session.user.id;
      setStatus("synced");
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, dataLoading]);

  // Forget the pull marker on sign-out so a later sign-in (maybe as a
  // different person) pulls fresh instead of assuming it's already synced.
  useEffect(() => {
    if (!session) pulledForUser.current = null;
  }, [session]);

  // After the initial pull/push has happened for this session, keep
  // pushing local changes up (debounced), same pattern as the localStorage save.
  useEffect(() => {
    if (!supabase || !session || dataLoading) return;
    if (pulledForUser.current !== session.user.id) return;

    const t = setTimeout(async () => {
      setStatus("pushing");
      const { error } = await supabase
        .from(TABLE)
        .upsert({ user_id: session.user.id, data, updated_at: new Date().toISOString() });
      setStatus(error ? "error" : "synced");
    }, 600);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, session, dataLoading]);

  return { status, syncEnabled: !!supabase };
}
