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
            Full-stack engineer.
            <br />
            <em>From interface to infrastructure.</em>
          </h1>
          <p className="intro-description">
            I build applications with .NET, Azure and React. My work spans
            financial software, aviation and insurance—from leading an aviation
            application’s development to modernising a legacy platform.
            Now exploring AI incident analysis with IncidentIQ.
          </p>
          <div className="intro-actions">
            <a className="button button-primary" href="#building">
              Explore my work <span aria-hidden="true">↓</span>
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
            Ask about IncidentIQ, my experience, or a technical decision.
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
