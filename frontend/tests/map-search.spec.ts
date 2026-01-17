import { testSignedOut as test } from './fixtures'
import { expect } from '@playwright/test'

test.describe('Post search functionality', () => {
  test('should be able to search for posts by location name', async ({ page }) => {
    const searchQuery = 'napoli'

    // 1. Visit homepage
    await page.goto('/', { waitUntil: 'load', timeout: 60_000 })
    await page.waitForLoadState('networkidle', { timeout: 60_000 })

    // 2. Write query in the search bar
    await page.locator('#search-bar').fill(searchQuery)

    // 3. Wait for dropdown to appear
    const suggestionList = page.locator('#search-suggestions')
    await expect(suggestionList).toBeVisible({ timeout: 10_000 })

    // 4. Click the suggestion
    const firstSuggestion = page.getByTestId('search-suggestion-item').first()
    await expect(firstSuggestion).toBeVisible({ timeout: 10_000 })
    await firstSuggestion.click({ timeout: 10_000, force: true })

    // 5. Wait for the search to complete and results to load
    await page.waitForLoadState('networkidle')
    await expect
      .poll(
        async () =>
          await page.evaluate(() => {
            const pane = document.querySelector('.leaflet-marker-pane')
            return pane ? pane.querySelectorAll('[data-testid="map-marker"]').length : 0
          }),
        { timeout: 20_000 }
      )
      .toBeGreaterThan(0)
  })

  test('should be able to search for posts by using the search-here button', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/', { waitUntil: 'load', timeout: 60_000 })
    await page.waitForLoadState('networkidle', { timeout: 60_000 })

    // 2. Click the search-here button
    await page.locator('#search-here-button').click()

    // 3. Wait for the search to complete and results to load
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[data-testid="map-marker"]', { timeout: 10_000 })
    const markerCount = await page.getByTestId('map-marker').count()
    expect(markerCount).toBeGreaterThan(0)  
  })

  test('should be redirected to the post\'s page', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/', { waitUntil: 'load', timeout: 60_000 })
    await page.waitForLoadState('networkidle', { timeout: 60_000 })

    // 2. Click the search-here button
    await page.locator('#search-here-button').click()

    // 3. Wait for the search to complete and results to load
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[data-testid="map-marker"]', { timeout: 10_000 })
    let markerCount = await page.getByTestId('map-marker').count()
    expect(markerCount).toBeGreaterThan(0)
    
    // 4. Press on a map marker
    await page.getByTestId('map-marker').first().click()

    // 5. Wait for and click on the popup
    await page.waitForSelector('[data-testid="map-popup"]', { timeout: 10_000 })
    await page.getByTestId('map-popup').click()

    // 6. Check if redirected
    await page.waitForURL(/\/post\/\d+/, { timeout: 10_000 })
    let currentURL = page.url()
    expect(currentURL).toMatch(/\/post\/\d+/)

    // 7. Go back to homepage
    await page.goto('/', { waitUntil: 'load', timeout: 60_000 })
    await page.waitForLoadState('networkidle', { timeout: 60_000 })

    // 8. Click the search-here button
    await page.locator('#search-here-button').click()

    // 9. Wait for the search to complete and results to load
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[data-testid="map-marker"]', { timeout: 10_000 })
    markerCount = await page.getByTestId('map-marker').count()
    expect(markerCount).toBeGreaterThan(0)

    // 10. Open the results list
    await page.locator('#toggle-results-panel').click()

    // 11. Wait for results panel to be visible and loaded
    await page.waitForSelector('.panel', { timeout: 10_000 })
    await page.waitForSelector('.results-list', { timeout: 10_000 }),
    await page.waitForSelector('[data-testid="search-item"]', { timeout: 10_000 })

    const firstSearchItem = page.getByTestId('search-item').first().locator('h3')
    await expect(firstSearchItem).toBeVisible({ timeout: 10_000 })
    await firstSearchItem.click()

    // 12. Check if redirected
    await page.waitForURL(/\/post\/\d+/, { timeout: 10_000 })
    currentURL = page.url()
    expect(currentURL).toMatch(/\/post\/\d+/)
  })
})
