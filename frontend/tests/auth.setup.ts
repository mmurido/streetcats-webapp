import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const username = 'rebeca91';
  const password = 'Password123!';

  await page.goto('http://frontend:5173/', { 
    waitUntil: 'networkidle',
    timeout: 45000 
  });

  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForFunction(() => document.readyState === 'complete');

  await page.locator('#open-user-menu').waitFor({ 
    state: 'visible', 
    timeout: 30000 
  });
  await page.locator('#open-user-menu').click({ timeout: 15000 });

  await page.locator('#open-signin-modal').click({ timeout: 10_000 });
  await page.locator('#identifier').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#signin-submit').click({ timeout: 10_000 });

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.locator('.overlay').waitFor({ state: 'detached' });
  await page.locator('#open-user-menu').waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('#open-user-menu').click();

  const welcomeText = page.locator('.welcome-text').getByText(`Hi, @${username}`, { exact: false });
  if (!(await welcomeText.isVisible({ timeout: 5000 }))) {
    throw new Error('Login failed in globalSetup');
  }

  const storageStatePath = path.resolve(__dirname, '.auth/user.json');
  fs.mkdirSync(path.dirname(storageStatePath), { recursive: true });
  await page.context().storageState({ path: storageStatePath });

  await browser.close();
}
