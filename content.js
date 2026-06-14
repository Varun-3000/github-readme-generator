console.log("README Generator Extension Loaded");

checkRepository();

async function checkRepository() {

    const pathParts = window.location.pathname
        .split("/")
        .filter(Boolean);

    if (pathParts.length < 2) {
        return;
    }

    const owner = pathParts[0];
    const repo = pathParts[1];

    console.log("Checking:", owner, repo);

    try {

        const files =
            await getRepositoryFiles(owner, repo);

        // -------------------------
        // Repository README
        // -------------------------

        const repoReadmeExists =
            files.some(file =>
                file.toLowerCase() === "readme.md"
            );

        console.log(
            "Repository README:",
            repoReadmeExists ? "Present" : "Missing"
        );

        // -------------------------
        // Current Folder Detection
        // -------------------------

        let currentFolder = "";

        if (
            pathParts.length > 4 &&
            pathParts[2] === "tree"
        ) {

            currentFolder =
                decodeURIComponent(
                    pathParts.slice(4).join("/")
                );
        }

        // -------------------------
        // Folder README Check
        // -------------------------

        if (currentFolder !== "") {

            const folderReadmeExists =
                files.some(file =>
                    file.toLowerCase() ===
                    `${currentFolder.toLowerCase()}/readme.md`
                );

            console.log(
                "Folder README:",
                folderReadmeExists ? "Present" : "Missing"
            );
        }

        // -------------------------
        // Button Logic
        // -------------------------

        const existingButton =
            document.getElementById("generate-readme-btn");

        if (currentFolder === "") {

            // Repository root

            if (!repoReadmeExists) {

                addGenerateButton();

            } else if (existingButton) {

                existingButton.remove();
            }

        } else {

            // Inside folder

            const folderReadmeExists =
                files.some(file =>
                    file.toLowerCase() ===
                    `${currentFolder.toLowerCase()}/readme.md`
                );

            if (!folderReadmeExists) {

                addGenerateButton();

            } else if (existingButton) {

                existingButton.remove();
            }
        }

    } catch (error) {

        console.error(error);
    }
}

function addGenerateButton() {

    if (document.getElementById("generate-readme-btn")) {
        return;
    }

    const button = document.createElement("button");

    button.id = "generate-readme-btn";

    button.className = "readme-btn";

    button.innerText = "Generate README";

    button.onclick = async () => {

        try {

            const pathParts = window.location.pathname
                .split("/")
                .filter(Boolean);

            const owner = pathParts[0];
            const repo = pathParts[1];

            console.log("Generate button clicked");

            const files =
                await getRepositoryFiles(owner, repo);

            console.log("Files:", files);

            const techStack = detectTechStack(files);

            console.log("Detected Technologies:");

            console.table(techStack);

            console.log("Tech Stack:", techStack);

            const readme =
                generateReadme(repo, techStack);

            console.log(readme);

            await navigator.clipboard.writeText(readme);

            alert("README copied to clipboard");

        } catch (error) {

            console.error(error);

            alert(error.message);
        }
    };

    // Add button to page directly
    const target =
    document.querySelector(".file-navigation");

    if (target) {
        target.appendChild(button);
    } else {
        document.body.appendChild(button);
    };
}
async function getDefaultBranch(owner, repo) {

    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`
    );

    const data = await response.json();

    return data.default_branch;
}

async function getRepositoryFiles(owner, repo) {

    const branch = await getDefaultBranch(owner, repo);

    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    );

    const data = await response.json();

    return data.tree.map(item => item.path);
}

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

function generateReadme(repo, techStack) {

    return `
# ${repo}

## Overview

This repository contains datasets and resources for anomaly detection research.

## Repository Contents

${techStack.map(t => `- ${t}`).join("\n")}

## Dataset Categories

- Numerical Data
- Categorical Data
- Graph Data
- Image Data
- Video Data
- Time Series Data

## Usage

Download the datasets relevant to your experiments and follow the documentation inside each folder.

## License

Refer to the LICENSE file.
`;
}

let lastUrl = location.href;

const observer = new MutationObserver(() => {

    const currentUrl = location.href;

    if (currentUrl !== lastUrl) {

        lastUrl = currentUrl;

        console.log("URL changed:", currentUrl);

        setTimeout(() => {

            checkRepository();

        }, 1000);
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});