import { useState } from "react";
import { Plus, Flag, Star } from "lucide-react";
import { ENERGY, getNextMove } from "../data/constants";
import TaskCard from "../components/TaskCard";

export default function BrainDump({ tasks, addTask, updateTask, deleteTask, toggleToday }) {
  const [text, setText] = useState("");
  const [energy, setEnergy] = useState("medium");
  const [urgent, setUrgent] = useState(false);
  const [important, setImportant] = useState(false);
  const [mins, setMins] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTask({ text: text.trim(), energy, urgent, important, estMins: mins ? Number(mins) : null });
    setText("");
    setUrgent(false);
    setImportant(false);
    setMins("");
  };

  const notDone = tasks.filter((t) => t.status !== "done");
  const active = notDone.filter((t) => getNextMove(t) !== "PARK");
  const parked = notDone.filter((t) => getNextMove(t) === "PARK");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <div className="view">
      <p className="view-note">Get it out of your head first. Tag it after — don't organise while dumping.</p>
      <form className="add-form" onSubmit={submit}>
        <input
          className="text-input"
          placeholder="What's in your head?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="add-form-row">
          <div className="field-group">
            <span className="mini-label">Energy needed</span>
            <div className="energy-select">
              {Object.keys(ENERGY).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  className={`energy-dot ${energy === lvl ? "active" : ""}`}
                  style={{ "--dot": ENERGY[lvl].color }}
                  onClick={() => setEnergy(lvl)}
                  title={ENERGY[lvl].label}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            className={`flag-toggle ${urgent ? "on" : ""}`}
            onClick={() => setUrgent(!urgent)}
          >
            <Flag size={12} /> Urgent
          </button>
          <button
            type="button"
            className={`important-toggle ${important ? "on" : ""}`}
            onClick={() => setImportant(!important)}
          >
            <Star size={12} /> Important
          </button>
          <div className="field-group">
            <span className="mini-label">Est. minutes</span>
            <input
              className="mins-input"
              placeholder="e.g. 15"
              title="How many minutes you reckon this will take"
              value={mins}
              onChange={(e) => setMins(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <button type="submit" className="add-btn">
            <Plus size={16} /> Add
          </button>
        </div>
      </form>

      <div className="task-list">
        {active.length === 0 && parked.length === 0 && (
          <div className="empty">Nothing dumped yet. Start typing above.</div>
        )}
        {active.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onToggleToday={toggleToday}
            showTodayToggle
          />
        ))}
      </div>

      {parked.length > 0 && (
        <details className="done-section">
          <summary>{parked.length} parked (not urgent, not important right now)</summary>
          <div className="task-list">
            {parked.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onUpdate={updateTask}
                onDelete={deleteTask}
                onToggleToday={toggleToday}
                showTodayToggle
              />
            ))}
          </div>
        </details>
      )}

      {done.length > 0 && (
        <details className="done-section">
          <summary>{done.length} done</summary>
          <div className="task-list">
            {done.map((t) => (
              <TaskCard key={t.id} task={t} onUpdate={updateTask} onDelete={deleteTask} onToggleToday={toggleToday} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
