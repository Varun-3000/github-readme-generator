function generateGenericReadme(analysis) {

    return `
# ${analysis.repository.name}

## Overview

${analysis.repository.description}

## Technologies

${analysis.technologies
    .map(t => `- ${t}`)
    .join("\n")}

## License

${analysis.repository.license}
`;
}