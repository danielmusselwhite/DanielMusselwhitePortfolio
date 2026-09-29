import { loadProjects } from "../../Utils/loadProjects";
import CurrentlyBuilding from "./CurrentlyBuilding";
import ProjectBrowser from "./ProjectBrowser";
import { contributions } from "../Contributions/contributionsData";
const hiddenProjects = new Set(["Activity Web App", "Developer Portfolio"]);
const projects = loadProjects().filter(
    (project) => !hiddenProjects.has(project.title),
);
export default function Projects() {
    return (
        <>
            <div id="building" className="section-band">
                <CurrentlyBuilding />
            </div>
            <div id="projects" className="section-band">
                <span id="contributions" className="contributions-anchor" aria-hidden="true" />
                <section className="work-section container">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">01 / Selected work</p>
                            <h2>Projects & contributions</h2>
                        </div>
                        <p>
                            Applications I’ve built and improvements to tools I use.
                            Watch a demo, explore the engineering, or read the pull request.
                        </p>
                    </div>
                    <ProjectBrowser projects={projects} contributions={contributions} />
                </section>
            </div>
        </>
    );
}
