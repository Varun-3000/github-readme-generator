const FRAMEWORK_RULES = {

    Python: {
        file: "requirements.txt",
        frameworks: {
            streamlit: "Streamlit",
            flask: "Flask",
            fastapi: "FastAPI",
            django: "Django",
            langchain: "LangChain",
            tensorflow: "TensorFlow",
            torch: "PyTorch",
            scikit: "Scikit-learn",
            sklearn: "Scikit-learn",
            pandas: "Pandas",
            numpy: "NumPy"
        }
    },

    Node: {
        file: "package.json",
        frameworks: {
            react: "React",
            next: "Next.js",
            express: "Express",
            nest: "NestJS",
            vue: "Vue",
            angular: "Angular",
            svelte: "Svelte"
        }
    },

    Java: {
        file: "pom.xml",
        frameworks: {
            "spring-boot": "Spring Boot",
            quarkus: "Quarkus",
            micronaut: "Micronaut"
        }
    }

};

function detectTechStack(files) {

    const technologies = [];

    const allFiles = files.join(" ").toLowerCase();

    if (allFiles.includes(".csv")) {
        technologies.push("CSV Datasets");
    }

    if (allFiles.includes(".arff")) {
        technologies.push("ARFF Datasets");
    }

    if (allFiles.includes(".tar.xz")) {
        technologies.push("Compressed Datasets");
    }

    if (allFiles.includes("image data")) {
        technologies.push("Image Data");
    }

    if (allFiles.includes("video data")) {
        technologies.push("Video Data");
    }

    if (allFiles.includes("time series")) {
        technologies.push("Time Series Data");
    }

    if (allFiles.includes("graph data")) {
        technologies.push("Graph Data");
    }

    if (files.includes("requirements.txt")) {
        technologies.push("Python");
    }

    if (files.includes("package.json")) {
        technologies.push("Node.js");
    }

    if (files.includes("pom.xml")) {
        technologies.push("Java Maven");
    }

    return technologies;
}

function detectRepositoryType(files) {

    const joined = files.join(" ").toLowerCase();

    if (
        joined.includes(".csv") ||
        joined.includes(".arff")
    ) {
        return "Dataset Repository";
    }

    if (files.includes("requirements.txt")) {
        return "Python Application";
    }

    if (files.includes("package.json")) {
        return "Node.js Application";
    }

    if (files.includes("pom.xml")) {
        return "Java Maven Project";
    }

    return "Generic Repository";
}

async function analyzeRepository(metadata, files) {

    return {

        repository: {
            name: metadata.name,
            owner: metadata.owner.login,
            description: metadata.description,
            language: metadata.language,
            stars: metadata.stargazers_count,
            forks: metadata.forks_count,
            homepage: metadata.homepage,
            license: metadata.license?.name,
            topics: metadata.topics || []
        },

        repositoryType: detectRepositoryType(files),

        technologies: detectTechStack(files),

        framework: await detectFrameworks(metadata.owner.login,metadata.name,
        files),

        buildTool: null,

        packageManager: null,

        folders: [],

        dependencies: [],

        importantFiles: []
    };
}

async function detectFrameworks(owner, repo, files) {

    const detected = [];

    for (const category of Object.values(FRAMEWORK_RULES)) {

        const targetFile =
            files.find(file =>
                file.toLowerCase().endsWith(category.file)
            );

        if (!targetFile)
            continue;

        const content =
            await getFileContent(owner, repo, targetFile);

        if (!content)
            continue;

        const text = content.toLowerCase();

        for (const [keyword, framework] of Object.entries(category.frameworks)) {

            if (text.includes(keyword)) {

                detected.push(framework);

            }
        }
    }

    return [...new Set(detected)];
}