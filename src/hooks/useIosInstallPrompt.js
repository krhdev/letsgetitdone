import { useState } from "react";

const DISMISS_KEY = "gsd-ios-install-dismissed";

function detectIsIos() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isIosUa = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13+ reports as "MacIntel" but is touch-capable, unlike a real Mac.
  const isIpadOs13Plus = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return isIosUa || isIpadOs13Plus;
}

function detectIsStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true
  );
}

// iOS never fires `beforeinstallprompt` (the event useInstallPrompt relies on),
// so Safari/Chrome/Firefox on iPhone and iPad need their own manual instructions
// instead: tap Share, then "Add to Home Screen".
export default function useIosInstallPrompt() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  const isIos = detectIsIos();
  const isStandalone = detectIsStandalone();

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  };

  const canShow = isIos && !isStandalone && !dismissed;

  return { canShow, dismiss };
}
