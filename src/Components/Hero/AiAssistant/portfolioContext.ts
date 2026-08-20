const projectModules = import.meta.glob(
    "../../../assets/Projects/**/project.json",
    {
        eager: true,
        import: "default",
    },
) as Record<string, unknown>;

function getProjectName(path: string) {
    const parts = path.split("/");
    const projectJsonIndex =
        parts.lastIndexOf("project.json");

    return projectJsonIndex > 0
        ? parts[projectJsonIndex - 1]
        : path;
}

export function buildPortfolioContext() {
    const projects = Object.entries(projectModules).map(
        ([path, data]) => ({
            project: getProjectName(path),
            source: path,
            data,
        }),
    );

    return JSON.stringify(
        {
            profile: {
                name: "Daniel Musselwhite",
                title: "Full-Stack Developer",
                focus: "Cloud-native systems",
                coreStack: "C# / .NET / Azure",
                approach: "Reliable by design",
            },
            projects,
        },
        null,
        2,
    );
}
