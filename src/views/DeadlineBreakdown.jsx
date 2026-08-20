import { useState } from "react";
import { Plus, Calendar, Trash2, ArrowRight } from "lucide-react";
import TaskCard from "../components/TaskCard";
import StepAdder from "../components/StepAdder";

export default function DeadlineBreakdown({ goals, addGoal, updateGoal, deleteGoal, addStep, updateStep, deleteStep }) {
  const [newGoal, setNewGoal] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    addGoal({ title: newGoal.trim(), deadline: newDeadline, why: "", firstAction: "", steps: [] });
    setNewGoal("");
    setNewDeadline("");
  };

  const daysLeft = (dateStr) => {
    if (!dateStr) return null;
    const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
    return diff;
  };

  return (
    <div className="view">
      <p className="view-note">A deadline is not a task. Break the scary vague thing into small visible steps.</p>
      <form className="add-form" onSubmit={submit}>
        <input
          className="text-input"
          placeholder="The outcome (e.g. Career pitch ready)"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        />
        <div className="add-form-row">
          <input
            type="date"
            className="date-input"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
          />
          <button type="submit" className="add-btn">
            <Plus size={16} /> Add goal
          </button>
        </div>
      </form>

      {goals.length === 0 && <div className="empty">No deadlines being tracked yet.</div>}

      {goals.map((g) => {
        const dl = daysLeft(g.deadline);
        const doneSteps = g.steps.filter((s) => s.status === "done").length;
        const pct = g.steps.length ? Math.round((doneSteps / g.steps.length) * 100) : 0;
        const nextStep = g.steps.find((s) => s.status !== "done");
        return (
          <div key={g.id} className="goal-card">
            <div className="goal-head">
              <div>
                <div className="goal-title">{g.title}</div>
                {g.deadline && (
                  <div className="goal-deadline">
                    <Calendar size={12} /> {g.deadline} {dl !== null && `· ${dl >= 0 ? dl + " days left" : "overdue"}`}
                  </div>
                )}
              </div>
              <button className="icon-btn" onClick={() => deleteGoal(g.id)}>
                <Trash2 size={14} />
              </button>
            </div>

            <div className="goal-field">
              <label className="goal-field-label">Why it matters</label>
              <textarea
                className="goal-field-input"
                placeholder="Why this outcome actually matters..."
                value={g.why || ""}
                onChange={(e) => updateGoal(g.id, { why: e.target.value })}
              />
            </div>
            <div className="goal-field">
              <label className="goal-field-label">First tiny action</label>
              <input
                className="goal-field-input single-line"
                placeholder="The smallest possible first move..."
                value={g.firstAction || ""}
                onChange={(e) => updateGoal(g.id, { firstAction: e.target.value })}
              />
            </div>

            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="progress-label">
              {doneSteps} / {g.steps.length} steps done ({pct}%)
            </div>

            {nextStep && (
              <div className="goal-next-action">
                <ArrowRight size={13} /> Next action: <strong>{nextStep.text}</strong>
              </div>
            )}

            <div className="task-list">
              {g.steps.map((s) => (
                <TaskCard
                  key={s.id}
                  task={s}
                  onUpdate={(id, patch) => updateStep(g.id, id, patch)}
                  onDelete={(id) => deleteStep(g.id, id)}
                  showPriority={false}
                />
              ))}
            </div>
            <StepAdder onAdd={(text) => addStep(g.id, text)} />
          </div>
        );
      })}
    </div>
  );
}
