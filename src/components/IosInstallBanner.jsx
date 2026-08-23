import { Share, X } from "lucide-react";
import useIosInstallPrompt from "../hooks/useIosInstallPrompt";

export default function IosInstallBanner() {
  const { canShow, dismiss } = useIosInstallPrompt();

  if (!canShow) return null;

  return (
    <div className="install-banner">
      <span className="install-banner-text">
        Install this app: tap <Share size={13} className="install-banner-inline-icon" aria-hidden="true" /> Share,
        then "Add to Home Screen".
      </span>
      <div className="install-banner-actions">
        <button type="button" className="install-banner-dismiss" onClick={dismiss} aria-label="Dismiss">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
