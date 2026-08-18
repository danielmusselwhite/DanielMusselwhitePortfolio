interface NavbarProps {
    theme: "dark" | "light";
    onToggleTheme: () => void;
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
    return (
        <header className="navbar">
            <a href="#home" className="navbar__brand">
                DM
            </a>

            <nav className="navbar__links">
                <a href="#about">About</a>
                <a href="#skills">Skills</a>
                <a href="#projects">Projects</a>
                <a href="#experience">Experience</a>
                <a href="#education">Education</a>
                <a href="#contact">Contact</a>
            </nav>

            <button
                type="button"
                className="navbar__theme-toggle"
                onClick={onToggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
                <span aria-hidden="true">{theme === "dark" ? "☼" : "☾"}</span>
            </button>
        </header>
    );
}