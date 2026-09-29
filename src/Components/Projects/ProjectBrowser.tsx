import { useEffect, useState } from "react";
import type { Project } from "../../Types/Project";
import type { Contribution } from "../Contributions/contributionsData";
import WorkDetail from "./WorkDetail";
import { contributionToWorkItem, filterWork } from "./workItems";
import "./ProjectBrowser.css";

export default function ProjectBrowser({ projects, contributions = [] }: {
  projects: Project[];
  contributions?: Contribution[];
}) {
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [kind, setKind] = useState("all");
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug);
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#contributions") {
        setKind("contributions");
        setTags([]);
        setQuery("");
      }
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const items = [...projects, ...contributions.map(contributionToWorkItem)];
  const allTags = [...new Set(items.flatMap(item => item.technologies))].sort();
  const results = filterWork(items, query, tags, kind);
  const selected = results.find(item => item.slug === selectedSlug) ?? results[0];
  const reset = () => { setQuery(""); setTags([]); setKind("all"); };
  return (
    <div className="project-browser">
      <div className="work-toolbar">
        <div className="work-toolbar-row">
          <div className="work-kind" role="group" aria-label="Type of work">
            {[["all", "All work", items.length], ["projects", "Projects", projects.length],
              ["contributions", "Contributions", contributions.length]].map(([value, label, count]) => (
              <button key={value} type="button" aria-pressed={kind === value} onClick={() => setKind(String(value))}>
                {label} <span>{count}</span>
              </button>
            ))}
          </div>
          <label className="work-search">
            <span className="sr-only">Search work</span>
            <input type="search" placeholder="Search projects, skills, decisions…" value={query} onChange={event => setQuery(event.target.value)} />
          </label>
        </div>
        <div className="work-filter-row">
          <span className="work-filter-label">Filter by skill</span>
          <div className="work-filter-chips" role="group" aria-label="Filter by skill; matches all selected skills">
            {allTags.map(tag => <button type="button" key={tag} aria-pressed={tags.includes(tag)}
              onClick={() => setTags(current => current.includes(tag) ? current.filter(value => value !== tag) : [...current, tag])}>{tag}</button>)}
          </div>
          <button className="work-reset" type="button" onClick={reset} disabled={!query && tags.length === 0 && kind === "all"}>Clear filters</button>
        </div>
        <p className="work-filter-hint">Matches all selected skills · Scroll for more</p>
      </div>
      <div className="work-panes">
        <aside className="work-sidebar" aria-label="Choose a project or contribution">
          <p className="work-result-count" role="status">{results.length} {results.length === 1 ? "result" : "results"} <span>Select to explore</span></p>
          <ul className="work-picker">
            {results.map(item => (
              <li key={item.slug}>
                <button type="button" aria-pressed={selected?.slug === item.slug} aria-controls="selected-project" onClick={() => setSelectedSlug(item.slug)}>
                  <span className={`work-badge ${item.prominence === "flagship" ? "work-badge--flagship" : item.contribution ? "work-badge--contribution" : ""}`}>
                    {item.prominence === "flagship" ? "Flagship project" : item.contribution ? "Open-source contribution" : "Completed project"}
                  </span>
                  <strong>{item.title}</strong>
                  <span className="work-picker-description">{item.shortDescription}</span>
                  <span className="work-picker-tags">{item.technologies.slice(0, 5).map(tag => <span key={tag}>{tag}</span>)}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        {selected ? <WorkDetail key={selected.slug} item={selected} /> : (
          <div id="selected-project" className="work-empty">
            <p className="eyebrow">No matches</p><h3>Try a broader search.</h3>
            <p>Remove a skill or clear your filters to see the full collection.</p>
            <button className="button button-primary" type="button" onClick={reset}>Show all work</button>
          </div>
        )}
      </div>
    </div>
  );
}
