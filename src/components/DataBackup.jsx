import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { emptyWeek } from "../data/constants";

export default function DataBackup({ data, setData }) {
  const fileRef = useRef(null);
  const [status, setStatus] = useState("");

  const flash = (msg) => {
    setStatus(msg);
    setTimeout(() => setStatus(""), 4000);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 10);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lets-get-shit-done-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flash("Backup downloaded.");
  };

  const handleImportClick = () => fileRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.tasks)) {
          throw new Error("not a valid backup");
        }
        setData((d) => ({
          ...d,
          ...parsed,
          week: { ...emptyWeek(), ...(parsed.week || {}) },
        }));
        flash("Backup loaded.");
      } catch (err) {
        flash("That doesn't look like a valid backup file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="backup-card">
      <div className="backup-title">Your data</div>
      <p className="backup-text">
        Everything's saved on this device only, nothing's backed up anywhere else yet. Download a backup now and
        then, especially before clearing your browser data or switching computers.
      </p>
      <div className="backup-actions">
        <button className="add-btn small" onClick={handleExport}>
          <Download size={14} /> Download backup
        </button>
        <button className="backup-load-btn" onClick={handleImportClick}>
          <Upload size={11} /> Load a backup
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      {status && <div className="backup-status">{status}</div>}
    </div>
  );
}
