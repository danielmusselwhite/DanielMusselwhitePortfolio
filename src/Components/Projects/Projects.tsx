import { loadProjects } from "../../Utils/loadProjects";
import CurrentlyBuilding from "./CurrentlyBuilding";
import ProjectFeature from "./ProjectFeature";
import WorkbenchProject from "./WorkbenchProject";
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
                <section className="work-section container">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">01 / Selected projects</p>
                            <h2>Systems, shipped in code.</h2>
                        </div>
                        <p>
                            Personal projects with real implementation to inspect: service
                            boundaries, asynchronous workflows, authentication, and the
                            interfaces that bring them together.
                        </p>
                    </div>
                    {projects
                        .filter((p) => ["CommerceFabric", "DotNote"].includes(p.title))
                        .map((project, index) => (
                            <ProjectFeature
                                key={project.slug}
                                project={project}
                                index={index + 1}
                            />
                        ))}
                    <div className="more-work-heading">
                        <h3>Other projects</h3>
                        <span>SMALLER BUILDS</span>
                    </div>
                    <div className="more-work">
                        {projects
                            .filter((p) => !["CommerceFabric", "DotNote"].includes(p.title))
                            .map((project) => (
                                <WorkbenchProject key={project.slug} project={project} />
                            ))}
                    </div>
                </section>
            </div>
        </>
    );
}
