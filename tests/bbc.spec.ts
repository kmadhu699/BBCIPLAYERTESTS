
import { test, expect } from '@playwright/test';
import { IPlayerHomePage } from '../src/pageobjects/BBCPage';

test.describe('BBC iPlayer Homepage', () => {
  let home: IPlayerHomePage;

  test.beforeEach(async ({ page }) => {
    home = new IPlayerHomePage(page);
    await home.gotoAndAccept();
  });

  test('The homepage has a title of “BBC iPlayer - Home”', async () => {
    await expect(home.page).toHaveTitle('BBC iPlayer - Home');
  });

  test('The page has one iPlayer navigation menu', async () => {
    await expect(home.navMenu).toHaveCount(1);
    await expect(home.navMenu).toBeVisible();
  });

  test('The page has at least 4 sections that each contain 1 carousel', async () => {
    await home.waitForLazyLoad();
    const count = await home.carouselCount();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('The page shows at least 4 programme items in each carousel', async () => {
    const count = await home.carouselCount();
    for (let i = 0; i < count; i++) {
      const items = await home.getItemCountInCarousel(i);
      expect(items).toBeGreaterThanOrEqual(4);
    }
  });

  test('More items in the carousel are shown when clicking a carousel arrow', async () => {
    const beforeX = await home.getItemXPosition(0, 0);
    await home.moveCarouselForward();
    const afterX = await home.getItemXPosition(0, 0);
    expect(afterX).toBeLessThan(beforeX);
  });

  test('should navigate to correct playback page for Not Going Out episode', async () => {
    const episodeName = await home.getEpisodeName();
    await home.clickEpisode();
    await expect(home.heroTitle).toHaveText(episodeName);
  });
});
