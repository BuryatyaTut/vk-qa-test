import { test, expect } from '@playwright/test';
import { WidgetPage } from './widget.page';

test.describe('Uchi.ru widget', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({ page, context }) => {
    widgetPage = new WidgetPage(page);

    // Select the original homepage; redesign group c has no embedded widget.
    await context.addCookies([{
      name: 'ab_mainpage_redesign',
      value: 'a',
      url: 'https://uchi.ru',
    }]);

    // Dismiss the real banner whenever it appears, without requiring it.
    // Match only a shown banner, excluding its fake layout copy.
    const cookieBanner = page.locator(
      '._UCHI_COOKIE__wrap.show:not(._UCHI_COOKIE__wrap--fake)',
    );
    await page.addLocatorHandler(cookieBanner, async (banner) => {
      await banner.locator('._UCHI_COOKIE__button').click();
    });

    await page.goto('/');
  });

  test('opens', async () => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible();
    await expect(widgetPage.getTitle()).toHaveText('База знаний Учи.ру');
  });

  test('has correct title', async () => {
    await widgetPage.openWidget();

    await widgetPage.getPopularArticles().first().click();

    await widgetPage.clickWriteToUs();

    await expect(widgetPage.getTitle()).toHaveText('Связь с поддержкой');
  });

  test('closes and reopens', async () => {
    await widgetPage.openWidget();
    await expect(widgetPage.getWidgetBody()).toBeVisible();

    await widgetPage.closeWidget();
    await expect(widgetPage.getWidgetBody()).toBeHidden();
    await expect(widgetPage.getOpenButton()).toBeVisible();
    await expect(widgetPage.getOpenButton()).toBeEnabled();

    await widgetPage.openWidget();
    await expect(widgetPage.getWidgetBody()).toBeVisible();
    await expect(widgetPage.getTitle()).toHaveText('База знаний Учи.ру');
    await expect(widgetPage.getPopularArticles().first()).toBeVisible();
  });
});
