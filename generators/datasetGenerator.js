function generateDatasetReadme(analysis) {

    return `
# ${analysis.repository.name}

## Overview

${analysis.repository.description}

## Repository Information

| Property | Value |
|----------|-------|
| Owner | ${analysis.repository.owner} |
| Stars | ⭐ ${analysis.repository.stars} |
| Forks | 🍴 ${analysis.repository.forks} |
| License | ${analysis.repository.license} |

## Dataset Categories

${analysis.datasetCategories
    .map(d => `- ${d}`)
    .join("\n")}

## Dataset Formats

${Object.entries(analysis.datasetFormats)
    .map(([format, count]) => `- ${format}: ${count}`)
    .join("\n")}

## Statistics

| Metric | Count |
|---------|------:|
| Files | ${analysis.statistics.totalFiles} |
| Folders | ${analysis.statistics.totalFolders} |
| CSV | ${analysis.statistics.extensions[".csv"] || 0} |
| ARFF | ${analysis.statistics.extensions[".arff"] || 0} |

## Documentation

${analysis.documentation
    .map(d => `- ${d}`)
    .join("\n")}

## License

${analysis.repository.license}
`;
}