import { useId, useState } from "react";
import type { KeyboardEvent } from "react";
import { videoEmbedUrl } from "./workItems";
import type { WorkItem } from "./workItems";

const statusLabels = { open: "PR open", merged: "Merged", closed: "Closed · not merged" };

export default function WorkDetail({ item }: { item: WorkItem }) {
  const embedUrl = videoEmbedUrl(item);
  const contribution = item.contribution;
  const tabs = [
    ...(embedUrl ? [{ id: "demo", label: "Demo" }] : []),
    { id: "overview", label: "Overview" },
    { id: "engineering", label: contribution ? "Changes" : "Engineering" },
    { id: "stack", label: "Tech stack" },
    ...(!embedUrl && item.images.length ? [{ id: "screenshots", label: "Screenshots" }] : []),
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [imageIndex, setImageIndex] = useState(0);
  const tabId = useId();
  const demoUrl = typeof item.demo === "string" ? item.demo : item.demo?.url;
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setActiveTab(tabs[next].id);
    document.getElementById(`${tabId}-${tabs[next].id}`)?.focus();
  }
  return (
    <article id="selected-project" className="work-detail" aria-label={`${item.title} details`}>
      <header className="work-detail-header">
        <div className="work-detail-meta">
          <span className={`work-badge ${item.prominence === "flagship" ? "work-badge--flagship" : contribution ? "work-badge--contribution" : ""}`}>
            {item.prominence === "flagship" ? "Flagship project" : contribution ? "Open-source contribution" : "Completed project"}
          </span>
          {contribution && <span className="work-pr-status">{statusLabels[contribution.status]} · #{contribution.pullRequest}</span>}
        </div>
        <div className="work-detail-title">
          <h3>{item.title}</h3>
          <div className="work-detail-links">
            {item.github && <a href={item.github} target="_blank" rel="noreferrer">{contribution ? "View pull request" : "Source code"} ↗</a>}
            {demoUrl && <a href={demoUrl} target="_blank" rel="noreferrer">{embedUrl ? "YouTube" : "Open demo"} ↗</a>}
          </div>
        </div>
        <p>{item.shortDescription}</p>
      </header>
      <div className="work-tabs" role="tablist" aria-label={`${item.title} sections`}>
        {tabs.map((tab, index) => (
          <button type="button" role="tab" key={tab.id} id={`${tabId}-${tab.id}`}
            aria-selected={activeTab === tab.id} aria-controls={`${tabId}-panel`}
            tabIndex={activeTab === tab.id ? 0 : -1} onClick={() => setActiveTab(tab.id)}
            onKeyDown={event => onTabKey(event, index)}>{tab.label}</button>
        ))}
      </div>
      <div className="work-panel" role="tabpanel" id={`${tabId}-panel`} aria-labelledby={`${tabId}-${activeTab}`} tabIndex={0} key={activeTab}>
        {activeTab === "demo" && embedUrl && <div className="work-demo">
          <iframe src={embedUrl} title={`${item.title} video demo`} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          <p>Application walkthrough <a href={demoUrl} target="_blank" rel="noreferrer">Watch on YouTube ↗</a></p>
        </div>}
        {activeTab === "overview" && <div className="work-overview">
          <p className="eyebrow">{contribution ? contribution.repository : "About this project"}</p>
          <p>{item.overview ?? item.shortDescription}</p>
          {item.outcome && <section className="work-note"><h4>What it demonstrates</h4><p>{item.outcome}</p></section>}
          {contribution && <p className="work-status-note">Status recorded {contribution.checkedOn}. See the pull request for the latest review and merge status.</p>}
        </div>}
        {activeTab === "engineering" && <div className="work-engineering">
          {item.problem && <section><h4>The problem</h4><p>{item.problem}</p></section>}
          {item.solution && <section><h4>The design</h4><p>{item.solution}</p></section>}
          {!!item.highlights?.length && <section><h4>{contribution ? "What I changed" : "Implementation details"}</h4>
            <ul>{item.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul></section>}
        </div>}
        {activeTab === "stack" && <div className="work-stack">
          <h4>Technologies & practices</h4>
          <p>The full stack used in this {contribution ? "contribution" : "project"}.</p>
          <ul>{item.technologies.map(tag => <li key={tag}>{tag}</li>)}</ul>
        </div>}
        {activeTab === "screenshots" && <div className="work-static-gallery">
          <a href={item.images[imageIndex].url} target="_blank" rel="noreferrer"><img src={item.images[imageIndex].url} alt={`${item.title} screenshot ${imageIndex + 1}`} /></a>
          <div aria-label="Select screenshot">{item.images.map((image, index) => <button type="button" key={image.fileName} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)}>{index + 1}</button>)}</div>
        </div>}
      </div>
    </article>
  );
}
