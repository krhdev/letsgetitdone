const GO_HERE = [
  { problem: "I have 900 things in my head", dest: "Brain Dump" },
  { problem: "I don't know what to do first", dest: "Brain Dump, then check Next Move" },
  { problem: "I need to survive today", dest: "Today's Top 3" },
  { problem: "I need to see the week", dest: "Weekly Planner" },
  { problem: "I have no energy", dest: "Energy Menu" },
  { problem: "I've got a scary deadline looming", dest: "Deadline Breakdown" },
];

const RULES = [
  "Brain dump before prioritising.",
  "Pick THREE, not thirty.",
  "Match work to the energy you actually have.",
  "Break vague jobs into visible next actions.",
  "Park things without guilt.",
  "A bad brain day is not a failed day.",
];

export default function HowToUse() {
  return (
    <div className="view info-page">
      <h2 className="info-heading">How to use this</h2>
      <p className="info-lead">
        Built to reduce decisions, not create more of them. Start with the page that matches the problem you've got
        right now.
      </p>

      <div className="rule-card">
        <div className="rule-card-title">One rule</div>
        <p className="info-para" style={{ margin: 0 }}>
          You do not need to use every page.
        </p>
      </div>

      <h3 className="section-title">If your brain is saying...</h3>
      <div className="go-here-list">
        {GO_HERE.map((row) => (
          <div key={row.problem} className="go-here-row">
            <span className="go-here-problem">"{row.problem}"</span>
            <span className="go-here-arrow">→</span>
            <span className="go-here-dest">{row.dest}</span>
          </div>
        ))}
      </div>

      <h3 className="section-title">The ADHD-friendly rules</h3>
      <ol className="rule-list numbered">
        {RULES.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ol>

      <p className="info-para info-bold">You show up, you get your shit done.</p>
    </div>
  );
}
