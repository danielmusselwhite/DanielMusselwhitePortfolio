type Props = {
  theme: "dark" | "light";
  menuOpen: boolean;
  onToggleTheme: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
};
const links = [
  ["building", "Building"],
  ["projects", "Projects"],
  ["about", "Approach"],
  ["experience", "Experience"],
  ["education", "Education"],
  ["contact", "Contact"],
] as const;
const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Navbar({
  theme,
  menuOpen,
  onToggleTheme,
  onToggleMenu,
  onCloseMenu,
}: Props) {
  return (
    <header className="site-header">
      <a href="#home" className="wordmark" aria-label="Daniel Musselwhite home">
        dm<span>.</span>
      </a>
      <nav
        id="navigation"
        className={menuOpen ? "nav-links is-open" : "nav-links"}
        aria-label="Primary navigation"
      >
        {links.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={onCloseMenu}>
            {label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "☼" : "☾"}
        </button>
        <a
          className="header-github"
          href="https://github.com/danielmusselwhite"
          target="_blank"
          rel="noreferrer"
        >
          GitHub <Arrow />
        </a>
        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-controls="navigation"
          aria-expanded={menuOpen}
          onClick={onToggleMenu}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>
    </header>
  );
}
