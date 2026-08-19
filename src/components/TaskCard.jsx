import { Flag, Check, Trash2 } from "lucide-react";
import { ENERGY } from "../data/constants";

export default function TaskCard({ task, onUpdate, onDelete, onToggleToday, showTodayToggle }) {
  const E = ENERGY[task.energy] || ENERGY.medium;
  const done = task.status === "done";
  return (
    <div className="task-card" style={{ "--spine": E.color, opacity: done ? 0.55 : 1 }}>
      <div className="task-main">
        <button
          className={`check ${done ? "checked" : ""}`}
          style={{ borderColor: E.color, background: done ? E.color : "transparent" }}
          onClick={() => onUpdate(task.id, { status: done ? "not-started" : "done" })}
          aria-label={done ? "Mark not started" : "Mark done"}
        >
          {done && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
        </button>
        <div className="task-text-wrap">
          <div className={`task-text ${done ? "strike" : ""}`}>{task.text}</div>
          {task.nextMove && <div className="task-next">→ {task.nextMove}</div>}
        </div>
        <div className="task-meta">
          {task.urgent && <Flag size={12} color="#D14B3D" strokeWidth={2.5} title="Urgent" />}
          {task.estMins ? <span className="mins">{task.estMins}m</span> : null}
        </div>
      </div>
      <div className="task-controls">
        <div className="energy-select">
          {Object.keys(ENERGY).map((lvl) => (
            <button
              key={lvl}
              className={`energy-dot ${task.energy === lvl ? "active" : ""}`}
              style={{ "--dot": ENERGY[lvl].color }}
              onClick={() => onUpdate(task.id, { energy: lvl })}
              title={ENERGY[lvl].label}
            />
          ))}
        </div>
        {showTodayToggle && (
          <button
            className={`today-toggle ${task.chosenToday ? "on" : ""}`}
            onClick={() => onToggleToday(task.id)}
          >
            {task.chosenToday ? "In Top 3" : "Add to Top 3"}
          </button>
        )}
        <button className="icon-btn" onClick={() => onDelete(task.id)} aria-label="Delete">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
