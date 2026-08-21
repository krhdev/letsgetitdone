import { Download, X } from "lucide-react";
import useInstallPrompt from "../hooks/useInstallPrompt";

export default function InstallBanner() {
  const { canInstall, promptInstall, dismiss } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <div className="install-banner">
      <span className="install-banner-text">Install this app for quick, one-tap access.</span>
      <div className="install-banner-actions">
        <button type="button" className="install-banner-btn" onClick={promptInstall}>
          <Download size={13} /> Install
        </button>
        <button type="button" className="install-banner-dismiss" onClick={dismiss} aria-label="Dismiss">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
