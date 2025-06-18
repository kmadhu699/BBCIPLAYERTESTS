import { test, expect, Locator, Page } from '@playwright/test';

// helper: go to a URL, then accept cookies if the banner is there
async function gotoAndAccept(page: Page, url: string) {
  await page.goto(url);
  const acceptBtn = page.locator('#bbccookies-accept-button');
  if (await acceptBtn.isVisible()) {
    await acceptBtn.click();
  }
}

test.describe('BBC iPlayer Homepage', () => {
  test('The homepage has a title of “BBC iPlayer – Home”', async ({ page }) => {
    await gotoAndAccept(page, 'https://www.bbc.co.uk/iplayer');
    await expect(page).toHaveTitle('BBC iPlayer - Home');
  });

  test('The page has one iPlayer navigation menu', async ({ page }) => {
    await gotoAndAccept(page, 'https://www.bbc.co.uk/iplayer');
    const navMenu = page.locator('ul[data-bbc-container="primary-nav"]');
    await expect(navMenu).toHaveCount(1);
    await expect(navMenu).toBeVisible();
  });

  test('The page has at least 4 sections that each contain 1 carousel', async ({ page }) => {
    await gotoAndAccept(page, 'https://www.bbc.co.uk/iplayer');
    const carousels = page.locator('div.carrousel.carrousel--with-arrows');
    // give it a moment in case of lazy-load
    await page.waitForTimeout(10_000);
    const count = await carousels.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('The page shows at least 4 programme items in each carousel', async ({ page }) => {
    await gotoAndAccept(page, 'https://www.bbc.co.uk/iplayer');
    const carousels = page.locator('div.carrousel.carrousel--with-arrows');
    await expect(carousels.first()).toBeVisible();
    const carouselCount = await carousels.count();

    for (let i = 0; i < carouselCount; i++) {
      const programmeItems = await carousels
        .nth(i)
        .locator('ul.carrousel__track > li')
        .count();
      expect(programmeItems).toBeGreaterThanOrEqual(4);
    }
  });
  test('More items in the carousel are shown when clicking a carousel arrow', async ({ page }) => {
    await gotoAndAccept(page, 'https://www.bbc.co.uk/iplayer');
  
    const carousel  = page.locator('div.carrousel.carrousel--with-arrows').first();
    const firstItem = carousel.locator('ul.carrousel__track > li').first();
    const btn       = carousel.locator('button[data-bbc-content-label="forward"]');
  
    // 1️⃣ read the x-position before
    const beforeX = await firstItem.evaluate(el => el.getBoundingClientRect().x);
  
    // 2️⃣ click forward if possible
    if (await btn.isEnabled()) await btn.click();
  
    // 3️⃣ read it again
    const afterX = await firstItem.evaluate(el => el.getBoundingClientRect().x);
  
    // 4️⃣ it must have moved left (smaller x)
    expect(afterX).toBeLessThan(beforeX);
  });   
  test('should navigate to correct playback page for Not Going Out episode', async ({ page }) => {
    // 1. Go to BBC iPlayer (and accept cookies if needed)
    await gotoAndAccept(page, 'https://www.bbc.co.uk/iplayer');

    // 2. Find the episode tile and extract its name
    const episodeTile = page
      .locator('div.content-item-root__meta.typo--skylark.typo--bold')
      .first();
    const episodeName = await episodeTile.innerText();

    // 3. Click the episode to navigate to its playback page
    await Promise.all([
      page.waitForNavigation(/* { url: /iplayer\/episode/ } */),
      episodeTile.click(),
    ]);

    // 4. On the playback page, assert the <h1> matches
    const heroTitle = page.locator(
      'h1.hero-header__title.typo--bold.typo--buzzard'
    );
    await expect(heroTitle).toHaveText(episodeName);
  });
});
