//analyzer.js
function detectTechStack(metadata, files) {

    const technologies = [];

    const joined =
        files.join(" ").toLowerCase();

    for (const rule of TECHNOLOGY_RULES) {

        if (
            rule.language &&
            metadata.language === rule.language
        ) {

            technologies.push(rule.name);
            continue;
        }

        if (
            rule.files &&
            rule.files.some(file =>
                files.includes(file)
            )
        ) {

            technologies.push(rule.name);
            continue;
        }

        if (
            rule.extensions &&
            rule.extensions.some(ext =>
                joined.includes(ext)
            )
        ) {

            technologies.push(rule.name);
            continue;
        }

        if (
            rule.contains &&
            rule.contains.some(text =>
                joined.includes(text)
            )
        ) {

            technologies.push(rule.name);
        }

    }

    return [...new Set(technologies)];

}

function detectRepositoryType(metadata, files) {

    const joined =
        files.join(" ").toLowerCase();

    const topics =
        (metadata.topics || [])
            .join(" ")
            .toLowerCase();

    const description =
        (metadata.description || "")
            .toLowerCase();

    for (const rule of REPOSITORY_TYPE_RULES) {

        const c = rule.conditions;

        if (
            c.language &&
            metadata.language === c.language
        ) {

            return rule.type;
        }

        if (
            c.files &&
            c.files.some(file =>
                files.includes(file)
            )
        ) {

            return rule.type;
        }

        if (
            c.extensions &&
            c.extensions.some(ext =>
                joined.includes(ext)
            )
        ) {

            return rule.type;
        }

        if (
            c.topics &&
            c.topics.some(topic =>
                topics.includes(topic)
            )
        ) {

            return rule.type;
        }

        if (
            c.description &&
            c.description.some(word =>
                description.includes(word)
            )
        ) {

            return rule.type;
        }

    }

    return "Generic Repository";

}

async function analyzeRepository(metadata, files) {

    const repository = {

        name: metadata.name,

        owner: metadata.owner.login,

        description: metadata.description,

        language: metadata.language,

        stars: metadata.stargazers_count,

        forks: metadata.forks_count,

        homepage: metadata.homepage,

        license: metadata.license?.name,

        topics: metadata.topics || []
    };

    return {

        repository,

        repositoryType: detectRepositoryType(metadata, files),

        technologies: detectTechStack(metadata, files),

        datasetCategories: detectDatasetCategories(files),

        datasetFormats: detectDatasetFormats(files),

        statistics: detectStatistics(files),

        frameworks: await detectFrameworks(
            repository.owner,
            repository.name,
            files
        ),

        buildTool: detectBuildTool(files),

        packageManager: detectPackageManager(files),

        ci: detectCI(files),

        docker: detectDocker(files),

        kubernetes: detectKubernetes(files),

        testing: await detectTesting(
            repository.owner,
            repository.name,
            files
        ),

        databases: await detectDatabases(
            repository.owner,
            repository.name,
            files
        ),

        folders: detectFolders(files),

        importantFiles: detectImportantFiles(files),

        entryPoint: detectEntryPoint(files),

        documentation: detectDocumentation(files),

        projectStructure: detectProjectStructure(files),

        statistics: detectStatistics(files)
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

function detectBuildTool(files) {

    const joined = files.join(" ").toLowerCase();

    if (joined.includes("pom.xml"))
        return "Maven";

    if (joined.includes("build.gradle"))
        return "Gradle";

    if (joined.includes("build.gradle.kts"))
        return "Gradle Kotlin";

    if (joined.includes("makefile"))
        return "Make";

    if (joined.includes("cmakelists.txt"))
        return "CMake";

    if (joined.includes("cargo.toml"))
        return "Cargo";

    if (joined.includes("go.mod"))
        return "Go Modules";

    return null;
}

function detectPackageManager(files) {

    const joined = files.join(" ").toLowerCase();

    if (joined.includes("package-lock.json"))
        return "npm";

    if (joined.includes("yarn.lock"))
        return "Yarn";

    if (joined.includes("pnpm-lock.yaml"))
        return "pnpm";

    if (joined.includes("poetry.lock"))
        return "Poetry";

    if (joined.includes("pipfile.lock"))
        return "Pipenv";

    return null;
}

function detectCI(files) {

    const ci = [];

    const joined = files.join(" ").toLowerCase();

    if (joined.includes(".github/workflows"))
        ci.push("GitHub Actions");

    if (joined.includes(".gitlab-ci.yml"))
        ci.push("GitLab CI");

    if (joined.includes("jenkinsfile"))
        ci.push("Jenkins");

    if (joined.includes("azure-pipelines.yml"))
        ci.push("Azure DevOps");

    if (joined.includes(".circleci"))
        ci.push("CircleCI");

    return ci;
}

function detectDocker(files) {

    const docker = [];

    const joined = files.join(" ").toLowerCase();

    if (joined.includes("dockerfile"))
        docker.push("Docker");

    if (joined.includes("docker-compose"))
        docker.push("Docker Compose");

    return docker;
}

function detectKubernetes(files) {

    const joined = files.join(" ").toLowerCase();

    if (
        joined.includes("deployment.yaml") ||
        joined.includes("deployment.yml")
    )
        return true;

    if (
        joined.includes("service.yaml") ||
        joined.includes("service.yml")
    )
        return true;

    if (joined.includes("helm"))
        return true;

    return false;
}

async function detectTesting(owner, repo, files) {

    const testing = [];

    if (files.some(f => f.endsWith("package.json"))) {

        const content = await getFileContent(
            owner,
            repo,
            files.find(f => f.endsWith("package.json"))
        );

        if (!content)
            return testing;

        const text = content.toLowerCase();

        if (text.includes("jest"))
            testing.push("Jest");

        if (text.includes("vitest"))
            testing.push("Vitest");

        if (text.includes("cypress"))
            testing.push("Cypress");

        if (text.includes("playwright"))
            testing.push("Playwright");
    }

    return testing;
}

async function detectDatabases(owner, repo, files) {

    const databases = [];

    const file = files.find(f =>
        f.endsWith("requirements.txt") ||
        f.endsWith("package.json") ||
        f.endsWith("pom.xml")
    );

    if (!file)
        return databases;

    const content = await getFileContent(owner, repo, file);

    if (!content)
        return databases;

    const text = content.toLowerCase();

    const rules = {
        postgres: "PostgreSQL",
        mysql: "MySQL",
        mongodb: "MongoDB",
        sqlite: "SQLite",
        redis: "Redis",
        cassandra: "Cassandra",
        neo4j: "Neo4j"
    };

    for (const [key, value] of Object.entries(rules)) {

        if (text.includes(key))
            databases.push(value);
    }

    return [...new Set(databases)];
}

function detectFolders(files) {

    const folders = [];

    const rules = {

        src: "Source Code",

        app: "Application",

        lib: "Libraries",

        test: "Tests",

        tests: "Tests",

        docs: "Documentation",

        docker: "Docker",

        ".github": "GitHub",

        ".gitlab": "GitLab",

        examples: "Examples",

        scripts: "Scripts",

        notebooks: "Jupyter Notebooks",

        data: "Data",

        assets: "Assets"
    };

    const topFolders = new Set();

    for (const file of files) {

        if (!file.includes("/"))
            continue;

        topFolders.add(file.split("/")[0]);
    }

    for (const folder of topFolders) {

        if (rules[folder]) {

            folders.push({

                folder,

                purpose: rules[folder]

            });

        }

    }

    return folders;

}

function detectImportantFiles(files) {

    const important = [];

    const rules = [

        "Dockerfile",

        "docker-compose.yml",

        "requirements.txt",

        "package.json",

        "pom.xml",

        "build.gradle",

        ".gitignore",

        ".env.example",

        "LICENSE",

        "CHANGELOG.md",

        "CONTRIBUTING.md"

    ];

    for (const rule of rules) {

        const found = files.find(f =>

            f.toLowerCase() === rule.toLowerCase()

        );

        if (found) {

            important.push(found);

        }

    }

    return important;

}

function detectEntryPoint(files) {

    const priority = [

        "main.py",

        "app.py",

        "server.py",

        "index.js",

        "server.js",

        "main.js",

        "index.ts",

        "Main.java"

    ];

    for (const file of priority) {

        const found = files.find(f =>

            f.toLowerCase().endsWith(file.toLowerCase())

        );

        if (found)

            return found;

    }

    return null;

}

function detectDocumentation(files) {

    return files.filter(file =>

        file.toLowerCase().includes("readme") ||

        file.toLowerCase().includes("docs") ||

        file.toLowerCase().includes("wiki") ||

        file.toLowerCase().includes("contributing")

    );

}

function detectProjectStructure(files) {

    const structure = {

        sourceFolders: [],

        configFolders: [],

        documentationFolders: [],

        dataFolders: [],

        notebookFolders: [],

        assetFolders: []

    };

    const folderRules = {

        sourceFolders: [
            "src",
            "app",
            "lib",
            "core"
        ],

        configFolders: [
            "config",
            "configs",
            ".github",
            ".gitlab"
        ],

        documentationFolders: [
            "docs",
            "documentation"
        ],

        dataFolders: [
            "data",
            "dataset",
            "datasets"
        ],

        notebookFolders: [
            "notebooks",
            "notebook"
        ],

        assetFolders: [
            "assets",
            "images",
            "img",
            "static"
        ]

    };

    const topFolders = new Set();

    for (const file of files) {

        if (!file.includes("/"))
            continue;

        topFolders.add(file.split("/")[0]);

    }

    for (const folder of topFolders) {

        for (const [category, rules] of Object.entries(folderRules)) {

            if (rules.includes(folder.toLowerCase())) {

                structure[category].push(folder);

            }

        }

    }

    return structure;

}
function detectStatistics(files) {

    const statistics = {

        totalFiles: files.length,

        totalFolders: 0,

        extensions: {},

        largestCategories: {}
    };

    const folders = new Set();

    for (const file of files) {

        //---------------------------------
        // Folder Count
        //---------------------------------

        const parts = file.split("/");

        if (parts.length > 1) {

            for (let i = 0; i < parts.length - 1; i++) {

                folders.add(parts.slice(0, i + 1).join("/"));

            }

        }

        //---------------------------------
        // Extension Count
        //---------------------------------

        const extension =
            file.includes(".")
                ? file.substring(file.lastIndexOf(".")).toLowerCase()
                : "no_extension";

        statistics.extensions[extension] =
            (statistics.extensions[extension] || 0) + 1;

        //---------------------------------
        // Top-level Folder Distribution
        //---------------------------------

        const topLevel =
            parts.length > 1
                ? parts[0]
                : "root";

        statistics.largestCategories[topLevel] =
            (statistics.largestCategories[topLevel] || 0) + 1;
    }

    statistics.totalFolders = folders.size;

    //---------------------------------
    // Sort Extensions
    //---------------------------------

    statistics.extensions =
        Object.fromEntries(

            Object.entries(statistics.extensions)
                .sort((a, b) => b[1] - a[1])

        );

    //---------------------------------
    // Sort Folder Distribution
    //---------------------------------

    statistics.largestCategories =
        Object.fromEntries(

            Object.entries(statistics.largestCategories)
                .sort((a, b) => b[1] - a[1])

        );

    return statistics;
}