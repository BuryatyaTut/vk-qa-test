import type { Page } from '@playwright/test';

enum WidgetPageSelectors {
    WIDGET_BODY = '[class^=widgetWrapper] > [class^=widget__]',
    HEADER_TEXT = 'header h5',
    BUTTON_OPEN = '[data-test="openWidget"]',
    BUTTON_CLOSE = '[class^="widgetWrapper"] > button[class^="closeBtn__"]',
    BUTTON_WRITE_TO_US = '[data-test="button_feedback_form"]',
    ARTICLE_POPULAR_TITLE = '[class^=popularTitle__]',
    ARTICLE_POPULAR_LIST = `${ARTICLE_POPULAR_TITLE} + ul[class^=articles__]`,
    ARTICLE_POPULAR_LIST_ITEM = `${ARTICLE_POPULAR_LIST} > li`,
}

export class WidgetPage {
    static selector = WidgetPageSelectors;

    constructor(protected page: Page) {}

    async openWidget() {
        await this.getOpenButton().click();
    }

    getOpenButton() {
        return this.page.locator(WidgetPage.selector.BUTTON_OPEN);
    }

    async closeWidget() {
        // The desktop close button is outside the widget body.
        await this.page.locator(WidgetPage.selector.BUTTON_CLOSE).click();
    }

    getPopularArticles() {
        return this.getWidgetBody().locator(WidgetPage.selector.ARTICLE_POPULAR_LIST_ITEM);
    }

    async clickWriteToUs() {
        await this.getWidgetBody().locator(WidgetPage.selector.BUTTON_WRITE_TO_US).click();
    }

    getTitle() {
        return this.getWidgetBody().locator(WidgetPage.selector.HEADER_TEXT);
    }

    getWidgetBody() {
        return this.page.locator(WidgetPage.selector.WIDGET_BODY);
    }
}
