import type { Project } from "../../Types/Project";
import type { Contribution } from "../Contributions/contributionsData";

export type WorkItem = Project & { contribution?: Contribution };

export function contributionToWorkItem(contribution: Contribution): WorkItem {
  return {
    slug: contribution.id,
    title: contribution.project,
    shortDescription: contribution.title,
    overview: contribution.summary,
    technologies: contribution.technologies,
    highlights: contribution.changes,
    github: contribution.url,
    images: [],
    contribution,
  };
}

export function videoEmbedUrl(project: Project): string | undefined {
  const demo = typeof project.demo === "string" ? project.demo : project.demo?.url;
  if (!demo) return;
  try {
    const url = new URL(demo);
    const id = url.hostname === "youtu.be" ? url.pathname.slice(1) :
      ["youtube.com", "www.youtube.com"].includes(url.hostname) ? url.searchParams.get("v") : null;
    if (id && /^[\w-]{11}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;
  } catch { /* Non-video demo links remain available as ordinary links. */ }
}

export function filterWork(items: WorkItem[], query: string, tags: string[], kind: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return items.filter(item => {
    if (kind === "projects" && item.contribution) return false;
    if (kind === "contributions" && !item.contribution) return false;
    const searchable = [item.title, item.shortDescription, item.overview, item.problem,
      item.solution, item.outcome, item.contribution?.repository, ...item.technologies,
      ...(item.highlights ?? [])].join(" ").toLowerCase();
    return tags.every(tag => item.technologies.includes(tag)) && terms.every(term => searchable.includes(term));
  });
}
