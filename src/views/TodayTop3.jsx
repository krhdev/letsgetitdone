import { ENERGY } from "../data/constants";
import TaskCard from "../components/TaskCard";

export default function TodayTop3({ tasks, updateTask, deleteTask, todayEnergy, setTodayEnergy, todayWin, setTodayWin }) {
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
