import { contributions } from "./contributionsData";
import "./Contributions.css";

const statusLabels = { open: "PR open", merged: "Merged", closed: "Closed · not merged" };

export default function Contributions() {
  return (
    <div id="contributions" className="section-band">
      <section className="contributions-section container" aria-labelledby="contributions-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / Open source</p>
            <h2 id="contributions-title">Contributions</h2>
          </div>
          <p>Fixes and improvements to tools I use, with the code, tests, and discussion available on GitHub.</p>
        </div>
        <div className="contributions-list">
          {contributions.map((contribution) => (
            <article className="contribution-card" key={contribution.id} aria-labelledby={`${contribution.id}-title`}>
              <div className="contribution-card__header">
                <p className="contribution-card__repo">{contribution.repository} <span>/ {contribution.category}</span></p>
                <span className={`contribution-status contribution-status--${contribution.status}`}>{statusLabels[contribution.status]}</span>
              </div>
              <div className="contribution-card__body">
                <div>
                  <p className="eyebrow">{contribution.project} · PR #{contribution.pullRequest}</p>
                  <h3 id={`${contribution.id}-title`}>{contribution.title}</h3>
                  <p className="contribution-card__summary">{contribution.summary}</p>
                  <ul className="contribution-card__tags" aria-label="Technologies and practices">
                    {contribution.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                  </ul>
                </div>
                <div className="contribution-card__changes">
                  <h4>What I changed</h4>
                  <ul>{contribution.changes.map((change) => <li key={change}>{change}</li>)}</ul>
                </div>
              </div>
              <div className="contribution-card__footer">
                <div className="work-links">
                  <a href={contribution.url} target="_blank" rel="noreferrer">View pull request <span aria-hidden="true">↗</span></a>
                </div>
                <p>Status checked <time dateTime={contribution.checkedOn}>{new Date(`${contribution.checkedOn}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</time> · Latest on GitHub</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
