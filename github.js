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

async function getRepositoryMetadata(owner, repo) {

    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`
    );

    return await response.json();
}

async function getFileContent(owner, repo, path) {

    const branch =
        await getDefaultBranch(owner, repo);

    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
    );

    if (!response.ok) {
        return null;
    }

    const data = await response.json();

    return atob(data.content.replace(/\n/g, ""));
}