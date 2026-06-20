//content.js
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

            const metadata = await getRepositoryMetadata(owner, repo);

            const files = await getRepositoryFiles(owner, repo);

            const analysis = await analyzeRepository(metadata, files);

            console.log("Repository Analysis");
            console.table(analysis.repository);

            console.log("Repository Type:",analysis.repositoryType);

            console.log("Technologies:");
            console.table(analysis.technologies);

            const readme =  generateReadme(analysis);
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