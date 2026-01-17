import { testSignedIn as test } from './fixtures'
import { expect } from '@playwright/test'

test.describe('Content interaction', () => {
  test('should be able to add a comment to a post', async ({ page }) => {
    const text = crypto.randomUUID().slice(0, 8)

    // 1. Visit homepage
    await page.goto('/post/14', { waitUntil: 'load', timeout: 60_000 })
    await page.waitForLoadState('networkidle', { timeout: 60_000 })

    // 2. Insert text into the comment input
    await page.locator('#comment-input').scrollIntoViewIfNeeded();
    await page.locator('#comment-input').click(); // ensures focus
    await page.locator('#comment-input').fill(text);
    await page.waitForSelector('#comment-input', { timeout: 10_000 })
    await page.locator('#comment-input').fill(text)

    // 3. Submit the comment
    await page.waitForSelector('#submit-comment-button', { timeout: 10_000 })
    await page.locator('#submit-comment-button').click()

    // 4. Wait for the comment to be posted and rendered
    await page.waitForLoadState('networkidle')
    const commentWithText = page.locator('[data-testid="comment-box"]', { hasText: text });
    await expect(commentWithText).toBeVisible({ timeout: 10_000 });
  })

  test('should be able to heart posts and comments', async ({ page }) => {
    // 1. Visit a post's page
    await page.goto('/post/14', { waitUntil: 'load', timeout: 60_000 })
    await page.waitForLoadState('networkidle', { timeout: 60_000 })

    // 2. Try to heart the post
    const postButton = page.locator('#heart-post-button');
    const postCount = postButton.locator('.reaction-count');
    const initialPostCount = await postCount.textContent();

    await postButton.scrollIntoViewIfNeeded();
    await postButton.click({ force: true })

    await expect
      .poll(async () => await postCount.textContent(), { timeout: 15_000 })
      .not.toBe(initialPostCount);

    // 3. Try to heart a comment
    const firstComment = page.locator('[data-testid="comment-box"]').first()
    const commentButton = firstComment.locator('[data-testid="heart-comment-button"]')
    const commentCount = firstComment.locator('[data-testid="comment-heart-count"]')
    const initialCommentCount = await commentCount.textContent()

    await commentButton.scrollIntoViewIfNeeded();
    await commentButton.click()

    await expect
      .poll(async () => await commentCount.textContent(), { timeout: 15_000 })
      .not.toBe(initialCommentCount);
  })
})
