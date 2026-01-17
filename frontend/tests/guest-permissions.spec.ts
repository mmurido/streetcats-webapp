import { testSignedOut as test } from './fixtures'
import { expect } from '@playwright/test'

test.describe('Guest permissions', () => {
  test('should not be able to create posts, add comments, heart content', async ({ page }) => {
    async function expectSignInModal() {
      await expect(page.locator('.modal')).toBeVisible()
      await expect(page.locator('#sign-in-form')).toBeVisible()
      await expect(page.locator('h2:has-text("Sign in")')).toBeVisible()
    }

    async function closeModal() {
      await page.locator('#close-modal-button').click()
      await expect(page.locator('.modal')).not.toBeVisible({ timeout: 60_000 })
    }

    // 1. Visit homepage
    await page.goto('/', { waitUntil: 'load', timeout: 60_000 })
    await page.waitForLoadState('networkidle', { timeout: 60_000 })

    // 2. Try to create a post
    await page.locator('#create-post-button').click({ timeout: 10_000, force: true })
    await expectSignInModal()
    await closeModal()

    // 4. Visit a post's page
    await page.goto('/post/14', { waitUntil: 'load', timeout: 60_000 })
    await page.waitForLoadState('networkidle', { timeout: 60_000 })

    // 5. Try to type in the comment input
    await page.locator("#comment-input").click({ force: true })
    await expectSignInModal()
    await closeModal()

    // 8. Try to heart the post
    await page.locator('#heart-post-button').click()
    await expectSignInModal()
    await closeModal()

    // 11. Try to heart a comment
    await page.locator('[data-testid="heart-comment-button"]').first().click()
    await expectSignInModal()
    await closeModal()
  })
})
