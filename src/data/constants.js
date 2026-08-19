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
