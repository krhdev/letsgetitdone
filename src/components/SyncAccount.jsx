import { useState } from "react";
import { Mail, LogOut } from "lucide-react";

const STATUS_LABEL = {
  idle: "",
  pulling: "Fetching your saved data…",
  pushing: "Syncing…",
  synced: "Synced",
  error: "Couldn't sync just now — your local data is still safe.",
};

export default function SyncAccount({ session, authLoading, signInWithEmail, signOut, syncEnabled, syncStatus }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (!syncEnabled || authLoading) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmail(email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong sending that link.");
    }
  };

  if (session) {
    return (
      <div className="backup-card">
        <div className="backup-title">Sync across devices</div>
        <p className="backup-text">Signed in as {session.user.email}.</p>
        <div className="backup-actions">
          <button className="backup-load-btn" onClick={signOut}>
            <LogOut size={11} /> Sign out
          </button>
        </div>
        {STATUS_LABEL[syncStatus] && <div className="backup-status">{STATUS_LABEL[syncStatus]}</div>}
      </div>
    );
  }

  return (
    <div className="backup-card">
      <div className="backup-title">Sync across devices</div>
      {sent ? (
        <p className="backup-text">
          Check your email for a sign-in link. Once you click it you'll come back here signed in, with your data
          synced.
        </p>
      ) : (
        <>
          <p className="backup-text">
            Everything still works fine on this device alone, but if you want your Brain Dump, Weekly Planner and
            goals to follow you to another device, pop your email in and we'll send you a sign-in link. No password.
          </p>
          <form className="backup-actions" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              className="text-input"
              style={{ width: "auto", flex: "1 1 220px" }}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="add-btn small">
              <Mail size={14} /> Send me a link
            </button>
          </form>
          {error && <div className="backup-status">{error}</div>}
        </>
      )}
    </div>
  );
}
