# Playwright Data-Driven Test Suite

This project uses Playwright with JavaScript and a JSON-based data file to keep the test logic reusable and scalable.

## Features

- Login to the demo app using the provided credentials
- Data-driven test scenarios loaded from `data/test-data.json`
- Automated validation of project names, column placement, and task tags
- Manual GitHub Actions execution for secure CI runs
- Local fallback credentials for easy development and testing

## Project Structure

```text
playwrite/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── data/
│   └── test-data.json
├── tests/
│   └── data-driven.spec.js
├── package.json
├── playwright.config.js
├── README.md
├── package-lock.json
└── test-results/
```

## App and Credentials

- App URL: https://create-asana-like-pr-39y5.bolt.host/

To test locally Set the credentials for the current PowerShell session before running tests:

```powershell
$env:APP_USERNAME = "admin"
$env:APP_PASSWORD = "password123"
npm test
```

For GitHub Actions, use repository secrets:

- `APP_USERNAME`
- `APP_PASSWORD`

## GitHub Actions

The workflow reads the credentials from GitHub repository secrets and runs the test suite without storing secrets in the codebase.

1. Go to the GitHub repository
2. Open the Actions tab
3. Select the Playwright workflow
4. Click Run workflow

## Install Dependencies

```bash
npm install
```

## Run Tests Locally

```bash
npm test
```

## Run in Headed Mode

```bash
npm run test:headed
```

## Run a Single Spec

```bash
npx playwright test tests/data-driven.spec.js
```

## Data File

The scenarios live in `data/test-data.json` and include:

- project name
- column name
- task name
- required tags

Adding new cases is as simple as appending another object to the JSON array.

## Example Scenario

```json
{
  "project": "Web Application",
  "column": "To Do",
  "task": "Implement user authentication",
  "tags": ["Feature", "High Priority"]
}
```

This generates a Playwright test that:

1. logs in
2. opens the Web Application project
3. verifies the task is in the To Do column
4. confirms each tag is present
