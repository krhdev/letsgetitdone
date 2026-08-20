import { ENERGY } from "../data/constants";

export default function EnergyIcon({ level, size = 14 }) {
  const E = ENERGY[level] || ENERGY.medium;
  const Icon = E.icon;
  return <Icon size={size} color={E.color} strokeWidth={2.4} />;
}
