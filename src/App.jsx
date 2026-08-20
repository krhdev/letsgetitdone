import { useState } from "react";
import { Zap } from "lucide-react";
import { useDataStore } from "./hooks/useDataStore";
import { uid } from "./data/constants";
import BrainDump from "./views/BrainDump";
import TodayTop3 from "./views/TodayTop3";
import EnergyMenu from "./views/EnergyMenu";
import WeeklyPlanner from "./views/WeeklyPlanner";
import DeadlineBreakdown from "./views/DeadlineBreakdown";
import HowToUse from "./views/HowToUse";
import About from "./views/About";
import { useAuth } from "./context/AuthContext";
import Login from "./components/Login";

const TABS = [
  { id: "about", label: "About" },
  { id: "help", label: "How To Use" },
  { id: "dump", label: "Brain Dump" },
  { id: "today", label: "Today's Top 3" },
  { id: "energy", label: "Energy Menu" },
  { id: "week", label: "Weekly Planner" },
  { id: "deadline", label: "Deadline Breakdown" },
];

export default function GetShitDoneApp() {
  // --- ALL hooks live here, at the top, in the same order every render ---
  const [data, setData, loading] = useDataStore();
  const { user, loading: authLoading, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [tab, setTab] = useState("about");

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

  // --- Conditional returns come AFTER every hook above ---
  if (loading || authLoading) {
    return (
      <div className="gsd-root">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!user && showLogin) {
    return (
      <div className="gsd-root">
        <Login />
        <button className="guest-back" onClick={() => setShowLogin(false)}>
          ← Continue as guest instead
        </button>
      </div>
    );
  }

  return (
    <div className="gsd-root">
      <header className="app-header">
        <div className="brand">
          <Zap size={18} strokeWidth={2.5} />
          <span>GET SHIT DONE</span>
        </div>
        <div className="header-right">
          <span className="tagline">pick three, not thirty</span>
          {user ? (
            <button className="auth-btn" onClick={logout}>Log out</button>
          ) : (
            <button className="auth-btn" onClick={() => setShowLogin(true)}>Log in / Sync</button>
          )}
        </div>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {tab === "about" && <About />}
        {tab === "help" && <HowToUse />}
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