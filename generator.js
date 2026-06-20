function generateReadme(analysis) {

    return `
# ${analysis.repository.name}

## Overview

${analysis.repository.description || "No description available."}

## Repository Type

${analysis.repositoryType}

## Technologies

${analysis.technologies
    .map(t => `- ${t}`)
    .join("\n")}

## License

${analysis.repository.license || "Not specified"}
`;
}