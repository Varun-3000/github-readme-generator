const DATASET_FORMAT_RULES = {

    ".csv": "CSV",

    ".arff": "ARFF",

    ".parquet": "Parquet",

    ".json": "JSON",

    ".jsonl": "JSONL",

    ".xlsx": "Excel",

    ".xls": "Excel",

    ".h5": "HDF5",

    ".npy": "NumPy",

    ".txt": "Text",

    ".zip": "ZIP",

    ".tar.gz": "TAR",

    ".tar.xz": "TAR",

    ".gz": "GZip"

};

function detectDatasetFormats(files) {

    const formats = {};

    for (const file of files) {

        const lower = file.toLowerCase();

        for (const [ext, name] of Object.entries(DATASET_FORMAT_RULES)) {

            if (lower.endsWith(ext)) {

                formats[name] = (formats[name] || 0) + 1;

            }

        }

    }

    return formats;

}
const DATASET_CATEGORY_RULES = {

    image: "Image",

    video: "Video",

    graph: "Graph",

    tabular: "Tabular",

    categorical: "Categorical",

    "time series": "Time Series",

    audio: "Audio",

    text: "Text",

    sensor: "Sensor"

};
function detectDatasetCategories(files) {

    const categories = [];

    const joined =
        files.join(" ").toLowerCase();

    for (const [keyword, value] of Object.entries(DATASET_CATEGORY_RULES)) {

        if (joined.includes(keyword)) {

            categories.push(value);

        }

    }

    return [...new Set(categories)];

}

function detectTopLevelFolders(files) {

    return [...new Set(

        files

            .filter(file => file.includes("/"))

            .map(file => file.split("/")[0])

    )];

}
function detectDatasetStatistics(files) {

    return {

        totalFiles: files.length,

        totalFolders:
            detectTopLevelFolders(files).length,

        readmes:
            files.filter(file =>
                file.toLowerCase().endsWith("readme.md")
            ).length

    };

}

function analyzeDataset(files) {

    return {

        formats:
            detectDatasetFormats(files),

        categories:
            detectDatasetCategories(files),

        statistics:
            detectDatasetStatistics(files),

        folders:
            detectTopLevelFolders(files)

    };

}