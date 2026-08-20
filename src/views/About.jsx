import DataBackup from "../components/DataBackup";

export default function About({ data, setData }) {
  return (
    <div className="view info-page">
      <h2 className="info-heading">This isn't another bloody planner</h2>
      <p className="info-lead">A quick note from Amy before you start.</p>

      <p className="info-para">
        I didn't create this because I needed another planner. I've bought enough bloody planners.
      </p>
      <p className="info-para">
        Knowing what needs doing has never really been the problem. Starting it, working out what comes first, and
        getting my brain to cooperate is the problem.
      </p>
      <p className="info-para">
        So this app is built to take some of the deciding OUT of your head. It helps you get the noise down, choose
        what actually matters, match the work to the energy you've got today, and make the next step small enough to
        start.
      </p>

      <div className="rule-card">
        <div className="rule-card-title">The rules</div>
        <ul className="rule-list">
          <li>Don't plan thirty, pick three.</li>
          <li>Match the task to the brain you've got today.</li>
          <li>Make it smaller.</li>
          <li>Get something done.</li>
          <li>Stop beating yourself up.</li>
        </ul>
      </div>

      <p className="info-para info-italic">
        A bad brain day is not a failed day. Progress still counts when it looks different from the plan.
      </p>

      <p className="info-para">
        And if the bit you struggle with isn't knowing WHAT to do but actually sitting down and doing the bloody
        thing, that's exactly why I created Let's Get Shit Done Together.
      </p>

      <div className="cta-card">
        <div className="cta-title">Let's Get Shit Done Together</div>
        <p className="cta-text">
          Live online body doubling. Monday Kick-Off 9–11am and Thursday Reset 7–9pm. Your brain isn't the problem.
          Doing it alone is.
        </p>
        <a
          className="cta-link"
          href="https://www.atofficeadminsolutions.co.uk/lets-get-shit-done-together"
          target="_blank"
          rel="noreferrer"
        >
          atofficeadminsolutions.co.uk/lets-get-shit-done-together
        </a>
      </div>

      <p className="info-signature">Amy Mandelj — A&amp;T Office Admin Solutions</p>

      <DataBackup data={data} setData={setData} />
    </div>
  );
}
