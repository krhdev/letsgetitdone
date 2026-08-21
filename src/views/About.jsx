import DataBackup from "../components/DataBackup";
import atLogo from "../assets/at-logo.png";

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

      <div className="rule-card">
        <div className="rule-card-title">How this happened</div>
        <p className="origin-text">
          Every good double act needs an origin story. Ours starts with a spreadsheet held together by formulas,
          hope and mild panic. I showed it to Kat expecting sympathy. Instead she squinted at it for about four
          seconds and said, "I can turn that into a PWA." (A progressive web app, for anyone else wondering. No app
          store faff, just open it and go.) Turns out she could. One spreadsheet, one alarmingly capable developer,
          and that's how the collab began.
        </p>
      </div>

      <div className="made-by">
        <div className="section-title">Made by</div>
        <div className="signature-row">
          <img src={atLogo} alt="A&amp;T Office Admin Solutions" className="signature-logo" />
          <p className="info-signature">Amy Mandelj — A&amp;T Office Admin Solutions</p>
        </div>
        <div className="signature-row">
          <svg
            className="signature-logo signature-icon"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <p className="info-signature">
            Kat (
            <a href="https://github.com/krhdev" target="_blank" rel="noreferrer">
              krhdev
            </a>
            ) — development
          </p>
        </div>
      </div>

      <DataBackup data={data} setData={setData} />
    </div>
  );
}
