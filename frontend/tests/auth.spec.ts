import { testSignedOut, testSignedIn } from './fixtures'
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  testSignedOut('should sign up successfully', async ({ page }) => {
    const id = crypto.randomUUID().slice(0, 8)
    const username = `testuser_${id}`
    const email = `test_${id}@example.com`

    // 1. Visit homepage
    await page.goto('/', { waitUntil: 'load', timeout: 60_000 })
    await page.waitForLoadState('networkidle', { timeout: 60_000 })

    // 2. Open the user menu
    await page.locator('#open-user-menu').waitFor({ state: 'visible', timeout: 10_000 })
    await page.locator('#open-user-menu').click({ timeout: 15_000, force: true })

    // 3. Open the sign up modal
    await page.locator('#open-signup-modal').click({ timeout: 10_000, force: true })

    // 4. Wait for the signup modal to appear
    const modal = page.locator('.modal')
    await expect(modal).toBeVisible({ timeout: 10_000 })

    // 5. Fill the form
    await page.locator('#username').fill(username)
    await page.locator('#email').fill(email)
    await page.locator('#password').fill('Password123!')
    await page.locator('#confirm-password').fill('Password123!')

    await page.locator('#birthday-month').fill('April')
    await page.keyboard.press('Enter')
    await page.locator('#day').fill('19')
    await page.locator('#year').fill('2001')

    await page.locator('#country-picker').fill('italy')
    const optionList = page.locator('.combobox-option-list')
    await expect(optionList).toBeVisible({ timeout: 10_000 })
    const firstOption = optionList.locator('.combobox-option').first()
    await firstOption.click({ timeout: 10_000 })

    // 6. Submit the form
    await page.locator('#signup-submit').click({ force: true })

    // 7. Wait for the request to be fulfilled and for the modal to disappear
    await Promise.all([
      page.waitForSelector('.modal', { state: 'detached' }),
      page.waitForSelector('.overlay', { state: 'detached' }),
      page.waitForSelector('#open-user-menu', { state: 'visible' }),
    ])

    // 8. Verify user appears signed in
    await page.waitForTimeout(1000)
    await page.locator('#open-user-menu').click()
    await expect(page.locator('.dropdown')).toBeVisible()
    await expect(
      page
        .locator('.welcome-text')
        .getByText(`Hi, @${username}`, { exact: false })
    ).toBeVisible({
      timeout: 5000,
    })
  });

  testSignedOut('should sign in successfully', async ({ page }) => {
    const username = 'rebeca91'
    const password = 'Password123!'

    // 1. Visit homepage
    await page.goto('/', { waitUntil: 'load', timeout: 60_000 })
    await page.waitForLoadState('networkidle', { timeout: 60_000 })

    // 2. Open the user menu
    await page.locator('#open-user-menu').click()

    // 3. Open the sign in modal
    await page.locator('#open-signin-modal').click()

    // 4. Wait for the sign in modal to appear
    await expect(page.locator('#identifier')).toBeVisible({ timeout: 5000 })

    // 5. Fill the form
    await page.locator('#identifier').fill(username)
    await page.locator('#password').fill(password)

    // 6. Submit the form
    await page.locator('#signin-submit').click()

    // 7. Wait for the request to be fulfilled and for the modal to disappear
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    await page.locator('.overlay').waitFor({ state: 'detached' })
    await page
      .locator('#open-user-menu')
      .waitFor({ state: 'visible', timeout: 10_000 })

    // 8. Verify user appears signed in
    await page.locator('#open-user-menu').click()
    await expect(page.locator('.dropdown')).toBeVisible()
    await expect(
      page
        .locator('.welcome-text')
        .getByText(`Hi, @${username}`, { exact: false })
    ).toBeVisible({
      timeout: 5000,
    }) 
  });

  testSignedIn('should sign out successfully', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/', { waitUntil: 'load', timeout: 60_000 })
    await page.waitForLoadState('networkidle', { timeout: 60_000 })

    // 2. Open the user menu
    await page.locator('#open-user-menu').waitFor({ state: 'visible', timeout: 10_000 })
    await page.locator('#open-user-menu').click()

    // 3. Open the sign up modal
    await page.locator('#sign-out-button').click()

    // 4. Wait for the request to be fulfilled
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // 5. Verify user appears signed out
    await expect(page.locator('[data-testid="user-avatar"]')).not.toBeVisible()
    await page.locator('#open-user-menu').click()
    await expect(page.locator('.dropdown')).toBeVisible()
    await expect(page.locator('text=Sign in')).toBeVisible()
    await expect(page.locator('text=Sign up')).toBeVisible()
  });
});