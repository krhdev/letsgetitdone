import { ENERGY } from "../data/constants";
import EnergyIcon from "../components/EnergyIcon";
import TaskCard from "../components/TaskCard";

export default function EnergyMenu({ tasks, updateTask, deleteTask }) {
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
