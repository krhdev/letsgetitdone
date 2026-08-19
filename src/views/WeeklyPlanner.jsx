import { Check } from "lucide-react";
import { ENERGY, DAYS } from "../data/constants";

export default function WeeklyPlanner({ week, updateDay }) {
  const doneCount = DAYS.filter((d) => week[d].done).length;
  return (
    <div className="view">
      <p className="view-note">Headline level only. Your day pages hold the detail.</p>
      <div className="week-progress">
        Main outcomes done: <strong>{doneCount} / 7</strong>
      </div>
      <div className="week-grid">
        {DAYS.map((day) => {
          const d = week[day];
          const E = ENERGY[d.energy] || ENERGY.medium;
          return (
            <div key={day} className="day-card" style={{ "--spine": E.color }}>
              <div className="day-head">
                <span className="day-name">{day}</span>
                <button
                  className={`check ${d.done ? "checked" : ""}`}
                  style={{ borderColor: E.color, background: d.done ? E.color : "transparent" }}
                  onClick={() => updateDay(day, { done: !d.done })}
                >
                  {d.done && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                </button>
              </div>
              <div className="energy-select">
                {Object.keys(ENERGY).map((lvl) => (
                  <button
                    key={lvl}
                    className={`energy-dot ${d.energy === lvl ? "active" : ""}`}
                    style={{ "--dot": ENERGY[lvl].color }}
                    onClick={() => updateDay(day, { energy: lvl })}
                    title={ENERGY[lvl].label}
                  />
                ))}
              </div>
              <input
                className="day-input main"
                placeholder="ONE main outcome"
                value={d.outcome}
                onChange={(e) => updateDay(day, { outcome: e.target.value })}
              />
              <input
                className="day-input"
                placeholder="Task 2"
                value={d.task2}
                onChange={(e) => updateDay(day, { task2: e.target.value })}
              />
              <input
                className="day-input"
                placeholder="Task 3"
                value={d.task3}
                onChange={(e) => updateDay(day, { task3: e.target.value })}
              />
              <input
                className="day-input muted"
                placeholder="Can wait"
                value={d.canWait}
                onChange={(e) => updateDay(day, { canWait: e.target.value })}
              />
              <input
                className="day-input muted"
                placeholder="Win / notes"
                value={d.win}
                onChange={(e) => updateDay(day, { win: e.target.value })}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
