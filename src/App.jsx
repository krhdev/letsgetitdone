import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Battery, BatteryLow, BatteryMedium, Flag, Check, X, ChevronRight, Calendar, Zap } from "lucide-react";

const ENERGY = {
  low: { label: "Low", color: "#4C7EA8", icon: BatteryLow },
  medium: { label: "Medium", color: "#E0932C", icon: BatteryMedium },
  high: { label: "High", color: "#D14B3D", icon: Battery },
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const uid = () => Math.random().toString(36).slice(2, 10);

const emptyWeek = () =>
  Object.fromEntries(
    DAYS.map((d) => [d, { energy: "medium", outcome: "", task2: "", task3: "", canWait: "", win: "", done: false }])
  );

function useDataStore() {
  const [data, setData] = useState({ tasks: [], week: emptyWeek(), goals: [], todayEnergy: "medium", todayWin: "" });
  const [loading, setLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("gsd-data");
        if (r && r.value) {
          const parsed = JSON.parse(r.value);
          setData((d) => ({ ...d, ...parsed, week: { ...emptyWeek(), ...(parsed.week || {}) } }));
        }
      } catch (e) {
        // no existing data yet
      } finally {
        loaded.current = true;
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(async () => {
      try {
        await window.storage.set("gsd-data", JSON.stringify(data));
      } catch (e) {
        console.error("save failed", e);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [data]);

  return [data, setData, loading];
}

function Pill({ children, color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="pill"
      style={{
        borderColor: color,
        background: active ? color : "transparent",
        color: active ? "#F7F4EC" : color,
      }}
    >
      {children}
    </button>
  );
}

function EnergyIcon({ level, size = 14 }) {
  const E = ENERGY[level] || ENERGY.medium;
  const Icon = E.icon;
  return <Icon size={size} color={E.color} strokeWidth={2.4} />;
}

function TaskCard({ task, onUpdate, onDelete, onToggleToday, showTodayToggle }) {
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
          {done && <Check size={12} color="#F7F4EC" strokeWidth={3} />}
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

function BrainDump({ tasks, addTask, updateTask, deleteTask, toggleToday }) {
  const [text, setText] = useState("");
  const [energy, setEnergy] = useState("medium");
  const [urgent, setUrgent] = useState(false);
  const [mins, setMins] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTask({ text: text.trim(), energy, urgent, estMins: mins ? Number(mins) : null });
    setText("");
    setUrgent(false);
    setMins("");
  };

  const active = tasks.filter((t) => t.status !== "done");
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
          <button
            type="button"
            className={`flag-toggle ${urgent ? "on" : ""}`}
            onClick={() => setUrgent(!urgent)}
          >
            <Flag size={12} /> Urgent
          </button>
          <input
            className="mins-input"
            placeholder="mins"
            value={mins}
            onChange={(e) => setMins(e.target.value.replace(/\D/g, ""))}
          />
          <button type="submit" className="add-btn">
            <Plus size={16} /> Add
          </button>
        </div>
      </form>

      <div className="task-list">
        {active.length === 0 && <div className="empty">Nothing dumped yet. Start typing above.</div>}
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

function EnergyMenu({ tasks, updateTask, deleteTask }) {
  const active = tasks.filter((t) => t.status !== "done");
  return (
    <div className="view">
      <p className="view-note">Stop planning for imaginary high-energy you. Work from the energy you've actually got.</p>
      <div className="energy-columns">
        {Object.keys(ENERGY).map((lvl) => {
          const E = ENERGY[lvl];
          const list = active.filter((t) => t.energy === lvl);
          return (
            <div key={lvl} className="energy-col" style={{ "--col": E.color }}>
              <div className="energy-col-head">
                <EnergyIcon level={lvl} size={16} />
                <span>{E.label} energy</span>
                <span className="count">{list.length}</span>
              </div>
              <div className="task-list">
                {list.length === 0 && <div className="empty small">Nothing here</div>}
                {list.map((t) => (
                  <TaskCard key={t.id} task={t} onUpdate={updateTask} onDelete={deleteTask} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TodayTop3({ tasks, updateTask, deleteTask, todayEnergy, setTodayEnergy, todayWin, setTodayWin }) {
  const top3 = tasks.filter((t) => t.chosenToday && t.status !== "done");
  const canWait = tasks.filter((t) => !t.chosenToday && t.status !== "done");
  const doneToday = tasks.filter((t) => t.chosenToday && t.status === "done");

  return (
    <div className="view">
      <p className="view-note">Not your whole life. Just the three things that make today count.</p>

      <div className="today-header">
        <div className="today-energy">
          <span className="label">Energy today</span>
          <div className="energy-select lg">
            {Object.keys(ENERGY).map((lvl) => (
              <button
                key={lvl}
                className={`energy-dot lg ${todayEnergy === lvl ? "active" : ""}`}
                style={{ "--dot": ENERGY[lvl].color }}
                onClick={() => setTodayEnergy(lvl)}
                title={ENERGY[lvl].label}
              />
            ))}
          </div>
        </div>
      </div>

      <h3 className="section-title">Today's Top 3 ({top3.length}/3)</h3>
      <div className="task-list">
        {top3.length === 0 && (
          <div className="empty">Nothing picked yet. Tag tasks "In Top 3" from Brain Dump or below.</div>
        )}
        {top3.map((t) => (
          <TaskCard key={t.id} task={t} onUpdate={updateTask} onDelete={deleteTask} onToggleToday={(id) => updateTask(id, { chosenToday: false })} showTodayToggle />
        ))}
      </div>

      {doneToday.length > 0 && (
        <>
          <h3 className="section-title">Done today</h3>
          <div className="task-list">
            {doneToday.map((t) => (
              <TaskCard key={t.id} task={t} onUpdate={updateTask} onDelete={deleteTask} />
            ))}
          </div>
        </>
      )}

      <h3 className="section-title">Can wait</h3>
      <div className="task-list">
        {canWait.length === 0 && <div className="empty small">Everything's either picked or done</div>}
        {canWait.slice(0, 8).map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onToggleToday={(id) => {
              if (top3.length >= 3) return;
              updateTask(id, { chosenToday: true });
            }}
            showTodayToggle
          />
        ))}
      </div>

      <h3 className="section-title">Today's win</h3>
      <textarea
        className="win-input"
        placeholder="One thing that went right, even if today went sideways."
        value={todayWin}
        onChange={(e) => setTodayWin(e.target.value)}
      />
    </div>
  );
}

function WeeklyPlanner({ week, updateDay }) {
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
                  {d.done && <Check size={11} color="#F7F4EC" strokeWidth={3} />}
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

function DeadlineBreakdown({ goals, addGoal, updateGoal, deleteGoal, addStep, updateStep, deleteStep }) {
  const [newGoal, setNewGoal] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    addGoal({ title: newGoal.trim(), deadline: newDeadline, why: "", steps: [] });
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
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="progress-label">
              {doneSteps} / {g.steps.length} steps done ({pct}%)
            </div>
            <div className="task-list">
              {g.steps.map((s) => (
                <TaskCard
                  key={s.id}
                  task={s}
                  onUpdate={(id, patch) => updateStep(g.id, id, patch)}
                  onDelete={(id) => deleteStep(g.id, id)}
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

function StepAdder({ onAdd }) {
  const [text, setText] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText("");
  };
  return (
    <form className="step-adder" onSubmit={submit}>
      <input
        className="text-input small"
        placeholder="Next tiny step..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="add-btn small">
        <Plus size={14} />
      </button>
    </form>
  );
}

const TABS = [
  { id: "dump", label: "Brain Dump" },
  { id: "today", label: "Today's Top 3" },
  { id: "energy", label: "Energy Menu" },
  { id: "week", label: "Weekly Planner" },
  { id: "deadline", label: "Deadline Breakdown" },
];

export default function GetShitDoneApp() {
  const [data, setData, loading] = useDataStore();
  const [tab, setTab] = useState("dump");

  const addTask = (partial) =>
    setData((d) => ({
      ...d,
      tasks: [
        ...d.tasks,
        { id: uid(), status: "not-started", nextMove: "", notes: "", chosenToday: false, ...partial },
      ],
    }));

  const updateTask = (id, patch) =>
    setData((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));

  const deleteTask = (id) => setData((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) }));

  const toggleToday = (id) =>
    setData((d) => {
      const chosenCount = d.tasks.filter((t) => t.chosenToday).length;
      return {
        ...d,
        tasks: d.tasks.map((t) => {
          if (t.id !== id) return t;
          if (!t.chosenToday && chosenCount >= 3) return t;
          return { ...t, chosenToday: !t.chosenToday };
        }),
      };
    });

  const updateDay = (day, patch) =>
    setData((d) => ({ ...d, week: { ...d.week, [day]: { ...d.week[day], ...patch } } }));

  const addGoal = (goal) => setData((d) => ({ ...d, goals: [...d.goals, { id: uid(), ...goal }] }));
  const updateGoal = (id, patch) =>
    setData((d) => ({ ...d, goals: d.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) }));
  const deleteGoal = (id) => setData((d) => ({ ...d, goals: d.goals.filter((g) => g.id !== id) }));
  const addStep = (goalId, text) =>
    setData((d) => ({
      ...d,
      goals: d.goals.map((g) =>
        g.id === goalId
          ? { ...g, steps: [...g.steps, { id: uid(), text, energy: "medium", status: "not-started" }] }
          : g
      ),
    }));
  const updateStep = (goalId, stepId, patch) =>
    setData((d) => ({
      ...d,
      goals: d.goals.map((g) =>
        g.id === goalId ? { ...g, steps: g.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)) } : g
      ),
    }));
  const deleteStep = (goalId, stepId) =>
    setData((d) => ({
      ...d,
      goals: d.goals.map((g) => (g.id === goalId ? { ...g, steps: g.steps.filter((s) => s.id !== stepId) } : g)),
    }));

  if (loading) {
    return (
      <div className="gsd-root">
        <Styles />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="gsd-root">
      <Styles />
      <header className="app-header">
        <div className="brand">
          <Zap size={18} strokeWidth={2.5} />
          <span>GET SHIT DONE</span>
        </div>
        <div className="tagline">pick three, not thirty</div>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
            {tab === t.id && <ChevronRight size={0} />}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {tab === "dump" && (
          <BrainDump tasks={data.tasks} addTask={addTask} updateTask={updateTask} deleteTask={deleteTask} toggleToday={toggleToday} />
        )}
        {tab === "today" && (
          <TodayTop3
            tasks={data.tasks}
            updateTask={updateTask}
            deleteTask={deleteTask}
            todayEnergy={data.todayEnergy}
            setTodayEnergy={(v) => setData((d) => ({ ...d, todayEnergy: v }))}
            todayWin={data.todayWin}
            setTodayWin={(v) => setData((d) => ({ ...d, todayWin: v }))}
          />
        )}
        {tab === "energy" && <EnergyMenu tasks={data.tasks} updateTask={updateTask} deleteTask={deleteTask} />}
        {tab === "week" && <WeeklyPlanner week={data.week} updateDay={updateDay} />}
        {tab === "deadline" && (
          <DeadlineBreakdown
            goals={data.goals}
            addGoal={addGoal}
            updateGoal={updateGoal}
            deleteGoal={deleteGoal}
            addStep={addStep}
            updateStep={updateStep}
            deleteStep={deleteStep}
          />
        )}
      </main>
    </div>
  );
}

function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');

      .gsd-root {
        --ink: #211F1B;
        --paper: #EDEAE0;
        --paper-2: #E1DCC9;
        --card: #F7F4EC;
        --line: #C9C2AA;
        --accent: #2F6F5E;
        --muted: #8A8370;
        font-family: 'Inter', sans-serif;
        color: var(--ink);
        background: var(--paper);
        border-radius: 16px;
        padding: 0;
        max-width: 100%;
        min-height: 480px;
        overflow: hidden;
        border: 1px solid var(--line);
      }
      .gsd-root * { box-sizing: border-box; }
      .loading { padding: 40px; text-align: center; font-family: 'JetBrains Mono', monospace; color: var(--muted); }

      .app-header {
        background: var(--ink);
        color: var(--paper);
        padding: 18px 22px 14px;
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 6px;
      }
      .brand {
        font-family: 'Fraunces', serif;
        font-weight: 700;
        font-size: 20px;
        letter-spacing: 0.02em;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .tagline {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #C9C2AA;
      }

      .tabs {
        display: flex;
        gap: 2px;
        background: var(--paper-2);
        padding: 6px 8px 0;
        overflow-x: auto;
      }
      .tab {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 10px 14px;
        background: transparent;
        border: none;
        border-radius: 8px 8px 0 0;
        color: var(--muted);
        cursor: pointer;
        white-space: nowrap;
        transition: background 0.15s, color 0.15s;
      }
      .tab:hover { color: var(--ink); }
      .tab.active { background: var(--paper); color: var(--ink); font-weight: 700; }

      .app-main { padding: 20px 22px 28px; max-height: 640px; overflow-y: auto; }
      .view-note {
        font-family: 'Fraunces', serif;
        font-style: italic;
        font-size: 14px;
        color: var(--muted);
        margin: 0 0 16px;
        max-width: 56ch;
      }
      .section-title {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--muted);
        margin: 22px 0 8px;
      }

      .add-form { margin-bottom: 18px; }
      .text-input {
        width: 100%;
        font-family: 'Fraunces', serif;
        font-size: 16px;
        padding: 12px 14px;
        border: 1.5px solid var(--line);
        border-radius: 10px;
        background: var(--card);
        color: var(--ink);
        outline: none;
      }
      .text-input:focus { border-color: var(--accent); }
      .text-input.small { font-size: 13px; font-family: 'Inter'; padding: 8px 10px; }
      .add-form-row { display: flex; align-items: center; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
      .mins-input {
        width: 60px;
        padding: 7px 8px;
        border: 1.5px solid var(--line);
        border-radius: 8px;
        background: var(--card);
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        color: var(--ink);
        outline: none;
      }
      .date-input {
        padding: 7px 8px;
        border: 1.5px solid var(--line);
        border-radius: 8px;
        background: var(--card);
        font-family: 'Inter';
        font-size: 12px;
        color: var(--ink);
      }
      .flag-toggle {
        display: flex; align-items: center; gap: 5px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        padding: 7px 10px;
        border: 1.5px solid var(--line);
        border-radius: 8px;
        background: var(--card);
        color: var(--muted);
        cursor: pointer;
      }
      .flag-toggle.on { border-color: #D14B3D; color: #D14B3D; background: #D14B3D18; }
      .add-btn {
        display: flex; align-items: center; gap: 6px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        font-weight: 500;
        padding: 8px 14px;
        border: none;
        border-radius: 8px;
        background: var(--accent);
        color: #F7F4EC;
        cursor: pointer;
        margin-left: auto;
      }
      .add-btn:hover { opacity: 0.9; }
      .add-btn.small { padding: 7px 10px; margin-left: 0; }

      .step-adder { display: flex; gap: 8px; margin-top: 8px; }

      .energy-select { display: flex; gap: 6px; align-items: center; }
      .energy-dot {
        width: 18px; height: 18px;
        border-radius: 50%;
        border: 2px solid var(--dot);
        background: transparent;
        cursor: pointer;
        padding: 0;
      }
      .energy-dot.active { background: var(--dot); }
      .energy-dot.lg { width: 26px; height: 26px; }

      .task-list { display: flex; flex-direction: column; gap: 8px; }
      .empty {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        color: var(--muted);
        padding: 14px;
        border: 1.5px dashed var(--line);
        border-radius: 10px;
        text-align: center;
      }
      .empty.small { padding: 10px; font-size: 11px; }

      .task-card {
        background: var(--card);
        border: 1px solid var(--line);
        border-left: 4px solid var(--spine);
        border-radius: 10px;
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .task-main { display: flex; align-items: flex-start; gap: 10px; }
      .check {
        width: 20px; height: 20px; min-width: 20px;
        border-radius: 50%;
        border: 2px solid;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        margin-top: 1px;
      }
      .task-text-wrap { flex: 1; min-width: 0; }
      .task-text { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 500; line-height: 1.3; word-break: break-word; }
      .task-text.strike { text-decoration: line-through; color: var(--muted); }
      .task-next { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent); margin-top: 2px; }
      .task-meta { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
      .mins {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: var(--muted);
        background: var(--paper-2);
        padding: 2px 6px;
        border-radius: 6px;
      }
      .task-controls { display: flex; align-items: center; gap: 10px; padding-left: 30px; flex-wrap: wrap; }
      .today-toggle {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        padding: 4px 9px;
        border-radius: 6px;
        border: 1.5px solid var(--line);
        background: transparent;
        color: var(--muted);
        cursor: pointer;
      }
      .today-toggle.on { border-color: var(--accent); color: var(--accent); background: #2F6F5E14; }
      .icon-btn {
        margin-left: auto;
        background: none;
        border: none;
        color: var(--muted);
        cursor: pointer;
        padding: 4px;
        display: flex;
      }
      .icon-btn:hover { color: #D14B3D; }

      .done-section { margin-top: 18px; }
      .done-section summary {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: var(--muted);
        cursor: pointer;
        margin-bottom: 8px;
      }

      .energy-columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
      @media (max-width: 720px) { .energy-columns { grid-template-columns: 1fr; } }
      .energy-col { background: var(--paper-2); border-radius: 12px; padding: 12px; border-top: 3px solid var(--col); }
      .energy-col-head {
        display: flex; align-items: center; gap: 6px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 10px;
      }
      .count { margin-left: auto; background: var(--card); padding: 1px 7px; border-radius: 10px; font-size: 10px; }

      .today-header { margin-bottom: 6px; }
      .today-energy { display: flex; align-items: center; gap: 12px; }
      .label { font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; color: var(--muted); }
      .win-input {
        width: 100%;
        min-height: 60px;
        font-family: 'Fraunces', serif;
        font-style: italic;
        font-size: 14px;
        padding: 10px 12px;
        border: 1.5px dashed var(--line);
        border-radius: 10px;
        background: var(--card);
        color: var(--ink);
        outline: none;
        resize: vertical;
      }

      .week-progress {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        color: var(--muted);
        margin-bottom: 14px;
      }
      .week-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
      .day-card {
        background: var(--card);
        border: 1px solid var(--line);
        border-top: 4px solid var(--spine);
        border-radius: 10px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      .day-head { display: flex; align-items: center; justify-content: space-between; }
      .day-name { font-family: 'Fraunces', serif; font-weight: 600; font-size: 14px; }
      .day-input {
        font-family: 'Inter';
        font-size: 12.5px;
        padding: 6px 8px;
        border: 1px solid var(--line);
        border-radius: 6px;
        background: var(--paper);
        color: var(--ink);
        outline: none;
      }
      .day-input.main { font-weight: 600; border-color: var(--accent); }
      .day-input.muted { font-size: 11.5px; color: var(--muted); }

      .goal-card {
        background: var(--card);
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 14px 16px;
        margin-bottom: 16px;
      }
      .goal-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
      .goal-title { font-family: 'Fraunces', serif; font-weight: 600; font-size: 17px; }
      .goal-deadline {
        display: flex; align-items: center; gap: 5px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: var(--muted);
        margin-top: 3px;
      }
      .progress-bar { height: 6px; background: var(--paper-2); border-radius: 4px; overflow: hidden; margin-bottom: 4px; }
      .progress-fill { height: 100%; background: var(--accent); transition: width 0.2s; }
      .progress-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: var(--muted);
        margin-bottom: 10px;
      }
    `}</style>
  );
}