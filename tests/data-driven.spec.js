/**
 * Data-driven Playwright suite for the Asana-like demo app.
 *
 * This file logs in with the provided demo credentials, selects a project,
 * and validates that each task appears in the correct board column with the
 * expected tags defined in the JSON scenario file.
 */
const { test, expect } = require('@playwright/test');
const scenarios = require('../data/test-data.json');

const APP_URL = 'https://create-asana-like-pr-39y5.bolt.host/';
const USERNAME = process.env.APP_USERNAME || 'admin';
const PASSWORD = process.env.APP_PASSWORD || 'password123';

/**
 * Logs in to the demo app using the provided credentials.
 * @param page - The Playwright page instance.
 */
async function login(page) {
  await page.goto(APP_URL);
  await expect( page.getByRole('heading', { name: 'Project Board Login' }) ).toBeVisible();
  await page.getByLabel('Username').fill(USERNAME);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect( page.getByRole('heading', { name: 'Projects' }) ).toBeVisible();
}

/**
 * Opens a project from the left navigation menu and waits for the project heading.
 * @param page - The Playwright page instance.
 * @param {string} projectName - The name of the project to open.
 */
async function openProject(page, projectName) {
  const projectButton = page.getByRole('button', { name: new RegExp(projectName, 'i') });
  await expect(projectButton).toBeVisible();
  await projectButton.click();
  await expect( page.getByRole('heading', { name: new RegExp(projectName, 'i'), level: 1, }) ).toBeVisible();
}

/**
 * Finds the board column container that matches the provided column name.
 * @param page - The Playwright page instance.
 * @param {string} columnName - The target board column, such as "To Do" or "Done".
 * @returns {import('@playwright/test').Locator} The matching column container.
 */
function findColumn(page, columnName) {
  const columnHeading = page.getByRole('heading', { name: new RegExp( `^${columnName}\\s*(?:\\(.*\\))?$`, 'i' ), });
  const column = page.locator('div').filter({ has: columnHeading }).first();
  return column;
}

/**
 * Finds the task card inside the matching column for the provided task name.
 * @param page - The Playwright page instance.
 * @param {string} columnName - The board column containing the task.
 * @param {string} taskName - The title of the task to find.
 * @returns {import('@playwright/test').Locator} The matching task card locator.
 */
function findTaskCard(page, columnName, taskName) {
  const column = findColumn(page, columnName);
  const taskHeading = page.getByRole('heading', { name: new RegExp(`^${taskName}$`, 'i'), });
  const taskCard = column.locator('div').filter({ has: taskHeading }).first();
  return taskCard;
}

/** Creates one test case for each project, task, column, and tag scenario. */
for (const scenario of scenarios) {
  test(`${scenario.project} - ${scenario.task} in ${scenario.column}`,async ({ page }) => {
      await test.step('Login to the app', async () => {
        await login(page);
      });

      await test.step('Open the project', async () => {
        await openProject(page, scenario.project);
      });

      await test.step(
        'Verify task and tags in the expected column',
        async () => {
          const taskCard = findTaskCard(
            page,
            scenario.column,
            scenario.task
          );

          await expect(taskCard).toContainText(scenario.task);

          for (const tag of scenario.tags) {
            await expect(taskCard).toContainText(tag);
          }
        }
      );
    }
  );
}