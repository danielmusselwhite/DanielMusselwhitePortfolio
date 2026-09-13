import AiAssistant from "./AiAssistant/AiAssistant";

export default function Hero() {
  return (
    <div id="home" className="section-band">
      <section className="intro container">
        <div className="intro-copy">
          <p className="eyebrow">
            <span className="status-dot" /> Daniel Musselwhite · Software
            Engineer
          </p>
          <h1>
            Full-Stack Engineer
            <br />
            <em>Cloud & Distributed systems enthusiast.</em>
          </h1>
          <p className="intro-description">
            I work mainly with .NET, Azure and React. At the moment, I'm helping
            modernise an insurance platform. Outside work, I build projects to
            get hands-on with things I want to understand better—most recently,
            distributed systems and AI-assisted incident analysis.
          </p>
          <div className="intro-actions">
            <a className="button button-primary" href="#projects">
              See my projects <span aria-hidden="true">↓</span>
            </a>
            <a className="text-link" href="#contact">
              Get in touch <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="intro-footnote">
            <span>BASED IN THE UK</span>
            <span>C# · AZURE · REACT</span>
          </div>
        </div>
        <div className="assistant-stage">
          <div className="assistant-label">
            <span className="status-dot" /> MEET BLOOP
          </div>
          <AiAssistant />
          <p className="assistant-note">
            Ask him about a project. Or try /party.
          </p>
        </div>
        <div className="credentials">
          <p>
            Experience across
            <br />
            <strong>finance, aviation & insurance</strong>
          </p>
          <span>
            SS&C<span className="credential-sub">TECHNOLOGIES</span>
          </span>
          <span>GAMIT</span>
          <span>Websure</span>
          <p>
            Studied at
            <br />
            <strong>UCL & Nottingham</strong>
          </p>
        </div>
      </section>
    </div>
  );
}
