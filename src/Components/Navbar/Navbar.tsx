export default function Navbar() {
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
                <a href="#contact">Contact</a>
            </nav>
        </header>
    );
}