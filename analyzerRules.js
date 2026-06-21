//analyzerRules.js
const REPOSITORY_TYPE_RULES = [

    {
        type: "Dataset Repository",

        conditions: {
            extensions: [
                ".csv",
                ".arff",
                ".parquet",
                ".jsonl",
                ".h5"
            ],

            topics: [
                "dataset",
                "anomaly-detection",
                "computer-vision"
            ],

            description: [
                "dataset"
            ]
        }
    },

    {
        type: "Machine Learning Project",

        conditions: {
            files: [
                "requirements.txt"
            ],

            topics: [
                "machine-learning",
                "deep-learning",
                "artificial-intelligence"
            ]
        }
    },

    {
        type: "Python Application",

        conditions: {

            language: "Python"
        }
    },

    {
        type: "Node.js Application",

        conditions: {

            files: [
                "package.json"
            ]
        }
    },

    {
        type: "Java Application",

        conditions: {

            files: [
                "pom.xml",
                "build.gradle"
            ]
        }
    }

];

const TECHNOLOGY_RULES = [

    {
        name: "Python",

        language: "Python"
    },

    {
        name: "Java",

        language: "Java"
    },

    {
        name: "JavaScript",

        language: "JavaScript"
    },

    {
        name: "TypeScript",

        language: "TypeScript"
    },

    {
        name: "Docker",

        files: [
            "Dockerfile"
        ]
    },

    {
        name: "Kubernetes",

        files: [
            "deployment.yml",
            "deployment.yaml",
            "service.yml",
            "service.yaml"
        ]
    },

    {
        name: "GitHub Actions",

        contains: [
            ".github/workflows"
        ]
    },

    {
        name: "CSV",

        extensions: [
            ".csv"
        ]
    },

    {
        name: "ARFF",

        extensions: [
            ".arff"
        ]
    },

    {
        name: "Parquet",

        extensions: [
            ".parquet"
        ]
    },

    {
        name: "Notebook",

        extensions: [
            ".ipynb"
        ]
    }

];

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

