import { useState } from "react";
import { Flag, Star, Check, Trash2, StickyNote, Clock } from "lucide-react";
import { ENERGY, getNextMove } from "../data/constants";

export default function TaskCard({ task, onUpdate, onDelete, onToggleToday, showTodayToggle, showPriority = true }) {
  const [notesOpen, setNotesOpen] = useState(Boolean(task.notes));
  const E = ENERGY[task.energy] || ENERGY.medium;
  const done = task.status === "done";
  const nextMove = getNextMove(task);

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
          {showPriority && !done && <div className="task-next">→ {nextMove}</div>}
        </div>
        <div className="task-meta">
          {showPriority && task.important && (
            <Star size={12} color="#F5C050" fill="#F5C050" strokeWidth={2} title="Important" />
          )}
          {showPriority && task.urgent && <Flag size={12} color="#D14B3D" strokeWidth={2.5} title="Urgent" />}
          {showPriority && task.canWait && <Clock size={12} color="#4C7EA8" strokeWidth={2} title="Can wait" />}
          {task.estMins ? <span className="mins">{task.estMins}m</span> : null}
        </div>
      </div>

      <div className="task-controls">
        <div className="energy-select-group">
          <span className="mini-label">Energy</span>
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
        </div>
        {showPriority && (
          <>
            <button
              className={`flag-toggle small ${task.urgent ? "on" : ""}`}
              onClick={() => onUpdate(task.id, { urgent: !task.urgent })}
            >
              <Flag size={11} /> Urgent
            </button>
            <button
              className={`important-toggle ${task.important ? "on" : ""}`}
              onClick={() => onUpdate(task.id, { important: !task.important })}
            >
              <Star size={11} /> Important
            </button>
            <button
              className={`canwait-toggle ${task.canWait ? "on" : ""}`}
              onClick={() => onUpdate(task.id, { canWait: !task.canWait })}
            >
              <Clock size={11} /> Can Wait
            </button>
          </>
        )}
        <button className={`notes-toggle ${notesOpen ? "on" : ""}`} onClick={() => setNotesOpen((v) => !v)}>
          <StickyNote size={11} /> Notes
        </button>
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

      {notesOpen && (
        <textarea
          className="notes-input"
          placeholder="Notes..."
          value={task.notes || ""}
          onChange={(e) => onUpdate(task.id, { notes: e.target.value })}
        />
      )}
    </div>
  );
}
