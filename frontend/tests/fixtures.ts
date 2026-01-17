import { test as base } from '@playwright/test'

const test = base.extend({
  async page({ page }, use) {
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.textContent = `* { transition: none !important; animation: none !important; }`;
    document.head.appendChild(style);
  });
    await use(page);
  },
});

export const testSignedIn = test.extend({
  storageState: 'tests/.auth/user.json',
})

export const testSignedOut = test.extend({
  storageState: { cookies: [], origins: [] },
})
