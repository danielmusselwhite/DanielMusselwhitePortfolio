export type Contribution = {
  id: string;
  repository: string;
  project: string;
  category: string;
  title: string;
  summary: string;
  changes: string[];
  technologies: string[];
  pullRequest: number;
  url: string;
  status: "open" | "merged" | "closed";
  checkedOn: string;
};

// Status is curated, not fetched at runtime. Verify on GitHub before updating.
export const contributions: Contribution[] = [
  {
    id: "svn-blamer-713",
    repository: "opista/svn-blamer",
    project: "SVN Blamer",
    category: "VS Code extension",
    title: "Recovering blame history for binary-marked files",
    summary:
      "After encountering a readable text file that SVN treated as binary, I traced a stuck loading indicator to an empty blame result and submitted a fix with a force-blame recovery path.",
    changes: [
      "Added a Force show blame command, an opt-in setting, and a retry prompt when manual blame skips a binary-marked file.",
      "Handled SVN stderr even on successful exit and cleared the loading indicator when blame returns no entries or throws.",
      "Added regression tests and documentation, then manually verified the command and retry prompt against the affected working copy.",
    ],
    technologies: ["TypeScript", "VS Code API", "SVN", "Regression tests"],
    pullRequest: 713,
    url: "https://github.com/opista/svn-blamer/pull/713",
    status: "open",
    checkedOn: "2026-09-25",
  },
];
