import { useEffect, useState } from "react";

interface NavbarProps {
    theme: "dark" | "light";
    onToggleTheme: () => void;
}

export default function Navbar({
    theme,
    onToggleTheme,
}: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] =
        useState(false);

    function closeMenu() {
        setIsMenuOpen(false);
    }

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                closeMenu();
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, []);

    return (
        <header
            className={[
                "navbar",
                isMenuOpen
                    ? "navbar--open"
                    : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <a
                href="#home"
                className="navbar__brand"
                onClick={closeMenu}
            >
                DM
            </a>

            <nav
                id="mobile-navigation"
                className="navbar__links"
                aria-label="Primary navigation"
            >
                <a
                    href="#about"
                    onClick={closeMenu}
                >
                    About
                </a>

                <a
                    href="#skills"
                    onClick={closeMenu}
                >
                    Skills
                </a>

                <a
                    href="#projects"
                    onClick={closeMenu}
                >
                    Projects
                </a>

                <a
                    href="#experience"
                    onClick={closeMenu}
                >
                    Experience
                </a>

                <a
                    href="#education"
                    onClick={closeMenu}
                >
                    Education
                </a>

                <a
                    href="#contact"
                    onClick={closeMenu}
                >
                    Contact
                </a>
            </nav>

            <div className="navbar__actions">
                <button
                    type="button"
                    className="navbar__theme-toggle"
                    onClick={onToggleTheme}
                    aria-label={`Switch to ${theme === "dark"
                            ? "light"
                            : "dark"
                        } mode`}
                    title={`Switch to ${theme === "dark"
                            ? "light"
                            : "dark"
                        } mode`}
                >
                    <span aria-hidden="true">
                        {theme === "dark"
                            ? "☼"
                            : "☾"}
                    </span>
                </button>

                <button
                    type="button"
                    className="navbar__menu-toggle"
                    onClick={() =>
                        setIsMenuOpen(
                            (current) => !current,
                        )
                    }
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation"
                    aria-label={
                        isMenuOpen
                            ? "Close navigation"
                            : "Open navigation"
                    }
                    title={
                        isMenuOpen
                            ? "Close navigation"
                            : "Open navigation"
                    }
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>
        </header>
    );
}