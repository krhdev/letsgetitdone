import { Battery, BatteryLow, BatteryMedium } from "lucide-react";

export const ENERGY = {
  low: { label: "Low", color: "#4C7EA8", icon: BatteryLow },
  medium: { label: "Medium", color: "#F5C050", icon: BatteryMedium },
  high: { label: "High", color: "#D14B3D", icon: Battery },
};

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const uid = () => Math.random().toString(36).slice(2, 10);

export const emptyWeek = () =>
  Object.fromEntries(
    DAYS.map((d) => [d, { energy: "medium", outcome: "", task2: "", task3: "", canWait: "", win: "", done: false }])
  );

// Mirrors the Brain Dump sheet's "Next Move" formula from the workbook:
// done -> DONE, urgent+important -> DO FIRST, important only -> SCHEDULE,
// urgent only -> QUICK WIN/DELEGATE, neither -> PARK. "Can wait" is a manual
// override the person sets themselves, so it takes priority over the
// auto-worked-out categories (short of the task actually being done).
export const getNextMove = (task) => {
  if (task.status === "done") return "DONE";
  if (task.canWait) return "CAN WAIT";
  if (task.urgent && task.important) return "DO FIRST";
  if (task.important) return "SCHEDULE";
  if (task.urgent) return "QUICK WIN / DELEGATE";
  return "PARK";
};
