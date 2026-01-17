import { testSignedIn as test } from './fixtures'
import { expect } from '@playwright/test'

test.describe('Post creation functionality', () => {
  test('create a post successfully', async ({ page }) => {
    const post = {
      title: 'This is a title',
      description: '*This* is a **description**',
      location: 'napoli',
    }

    // 1. Visit homepage
    await page.goto('/', { waitUntil: 'load', timeout: 60_000 })

    // 2. Press the share button
    await page.locator('#create-post-button').click()

    // 3. Fill the form
    // Title
    await page.locator('#title').fill(post.title)

    // Image
    await page.locator('input[type="file"]').setInputFiles('tests/fixtures/test-image.jpg')
    await expect(page.locator('.preview-container')).toBeVisible()
    await expect(page.locator('.preview-item')).toHaveCount(1)
    await expect(page.locator('.preview-image')).toBeVisible()

    // Location
    await page.locator('#location-picker').fill(post.location)

    const suggestionList = page.locator('#search-suggestions')
    await expect(suggestionList).toBeVisible({ timeout: 10_000 })

    const firstSuggestion = page.getByTestId('search-suggestion-item').first()
    await expect(firstSuggestion).toBeVisible({ timeout: 10_000 })
    await firstSuggestion.click({ timeout: 10_000, force: true })

    for (let i = 0; i < 3; i++) {
      await page.locator('#zoom-in-button').click()
      await page.waitForTimeout(200)
    }

    const mapContainer = page.locator('.map-container')
    const boundingBox = await mapContainer.boundingBox()
    if (boundingBox) {
      const centerX = boundingBox.x + boundingBox.width / 2
      const centerY = boundingBox.y + boundingBox.height / 2
      await page.mouse.click(centerX, centerY)
    }
    await expect(page.locator('.address-preview')).toBeVisible()
    await expect(page.locator('.address-text')).not.toBeEmpty()

    // Description
    await page.locator('#markdown-editor').fill(post.description)

    // 4. Submit the post
    await page.locator('#submit-post-button').click()

    // 5. Wait for the creation to complete and post-view page to load
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[data-testid="post-title"]', { timeout: 10_000 })
    await expect(page.getByTestId('post-title')).toHaveText(post.title);
    await expect(page).toHaveURL(/\/post\/\d+/);
  })
})
