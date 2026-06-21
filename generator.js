function generateReadme(analysis) {

    switch (analysis.repositoryType) {

        case "Dataset Repository":
            return generateDatasetReadme(analysis);

        case "Python Application":
            return generatePythonReadme(analysis);

        case "Node.js Application":
            return generateNodeReadme(analysis);

        case "Java Application":
            return generateJavaReadme(analysis);

        default:
            return generateGenericReadme(analysis);
    }
}