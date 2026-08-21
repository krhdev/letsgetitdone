import { useEffect, useRef, useState } from "react";
import { Mail, LogOut } from "lucide-react";

const STATUS_LABEL = {
  idle: "",
  pulling: "Fetching your saved data…",
  pushing: "Syncing…",
  synced: "Synced",
  error: "Couldn't sync just now — your local data is still safe.",
};

export default function HeaderSync({ session, authLoading, signInWithEmail, signOut, syncEnabled, syncStatus }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

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

  const buttonLabel = session ? session.user.email : "Log in / Sync";

  return (
    <div className="header-sync" ref={wrapRef}>
      <button type="button" className="header-sync-btn" onClick={() => setOpen((o) => !o)}>
        {buttonLabel}
      </button>

      {open && (
        <div className="header-sync-popover">
          {session ? (
            <>
              <div className="header-sync-title">Sync across devices</div>
              <p className="header-sync-text">Signed in as {session.user.email}.</p>
              <button
                className="backup-load-btn"
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
              >
                <LogOut size={11} /> Sign out
              </button>
              {STATUS_LABEL[syncStatus] && <div className="header-sync-status">{STATUS_LABEL[syncStatus]}</div>}
            </>
          ) : sent ? (
            <>
              <div className="header-sync-title">Check your email</div>
              <p className="header-sync-text">
                We've sent a sign-in link. Click it and you'll come back here signed in, with your data synced.
              </p>
            </>
          ) : (
            <>
              <div className="header-sync-title">Sync across devices</div>
              <p className="header-sync-text">
                Works fine on this device alone, but if you want your data to follow you to another device, pop your
                email in below. No password.
              </p>
              <form className="header-sync-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  required
                  className="text-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="add-btn small">
                  <Mail size={14} /> Send me a link
                </button>
              </form>
              {error && <div className="header-sync-status">{error}</div>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
