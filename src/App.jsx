import { useState } from "react";
import { Zap } from "lucide-react";
import useDataStore from "./hooks/useDataStore";
import useAuth from "./hooks/useAuth";
import useCloudSync from "./hooks/useCloudSync";
import HeaderSync from "./components/HeaderSync";
import InstallBanner from "./components/InstallBanner";
import IosInstallBanner from "./components/IosInstallBanner";
import { uid } from "./data/constants";
import BrainDump from "./views/BrainDump";
import TodayTop3 from "./views/TodayTop3";
import EnergyMenu from "./views/EnergyMenu";
import WeeklyPlanner from "./views/WeeklyPlanner";
import DeadlineBreakdown from "./views/DeadlineBreakdown";
import HowToUse from "./views/HowToUse";
import About from "./views/About";

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
  const [data, setData, loading] = useDataStore();
  const { session, authLoading, signInWithEmail, signOut, syncEnabled } = useAuth();
  const { status: syncStatus } = useCloudSync(session, data, setData, loading);
  const [tab, setTab] = useState("about");

  const addTask = (partial) =>
    setData((d) => ({
      ...d,
      tasks: [
        ...d.tasks,
        { id: uid(), status: "not-started", nextMove: "", notes: "", chosenToday: false, canWait: false, ...partial },
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
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="gsd-root">
      <header className="app-header">
        <div className="brand">
          <Zap size={18} strokeWidth={2.5} />
          <span>LET'S GET SHIT DONE!</span>
        </div>
        <div className="header-right">
          <div className="tagline">pick three, not thirty</div>
          <HeaderSync
            session={session}
            authLoading={authLoading}
            signInWithEmail={signInWithEmail}
            signOut={signOut}
            syncEnabled={syncEnabled}
            syncStatus={syncStatus}
          />
        </div>
      </header>

      <InstallBanner />
      <IosInstallBanner />

      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
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
        {tab === "help" && <HowToUse />}
        {tab === "about" && <About data={data} setData={setData} />}
      </main>
    </div>
  );
}
