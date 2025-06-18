// pages/IPlayerHomePage.ts
import { Page, Locator } from '@playwright/test';

export class IPlayerHomePage {
  readonly page: Page;
  readonly acceptBtn: Locator;
  readonly navMenu: Locator;
  readonly carousels: Locator;
  readonly episodeTileMeta: Locator;
  readonly heroTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.acceptBtn = page.locator('#bbccookies-accept-button');
    this.navMenu = page.locator('ul[data-bbc-container="primary-nav"]');
    this.carousels = page.locator('div.carrousel.carrousel--with-arrows');
    this.episodeTileMeta = page.locator('div.content-item-root__meta.typo--skylark.typo--bold').first();
    this.heroTitle = page.locator('h1.hero-header__title.typo--bold.typo--buzzard');
  }

  async goto() {
    await this.page.goto('/iplayer');
  }

  async gotoAndAccept() {
    await this.goto();
    if (await this.acceptBtn.isVisible()) {
      await this.acceptBtn.click();
    }
  }

  async title() {
    return this.page.title();
  }

  async carouselCount() {
    return this.carousels.count();
  }

  async waitForLazyLoad() {
    // allow carousels to render
    await this.page.waitForTimeout(10_000);
  }

  async getItemCountInCarousel(index: number) {
    return this.carousels
      .nth(index)
      .locator('ul.carrousel__track > li')
      .count();
  }

  async getItemXPosition(carouselIndex: number, itemIndex: number) {
    const item = this.carousels
      .nth(carouselIndex)
      .locator('ul.carrousel__track > li')
      .nth(itemIndex);
    return item.evaluate(el => el.getBoundingClientRect().x);
  }

  async moveCarouselForward(carouselIndex = 0) {
    const btn = this.carousels
      .nth(carouselIndex)
      .locator('button[data-bbc-content-label="forward"]');
    if (await btn.isEnabled()) {
      await btn.click();
    }
  }

  async getEpisodeName() {
    return this.episodeTileMeta.innerText();
  }

  async clickEpisode() {
    await Promise.all([
      this.page.waitForNavigation(),
      this.episodeTileMeta.click(),
    ]);
  }

  async getHeroTitleText() {
    return this.heroTitle.textContent();
  }
}
