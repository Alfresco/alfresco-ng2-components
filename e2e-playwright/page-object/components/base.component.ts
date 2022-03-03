/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Locator, Page } from '@playwright/test';
import { PlaywrightBase } from '../playwright-base';

export abstract class BaseComponent extends PlaywrightBase {
    private rootElement: string;

    constructor(page: Page,rootElement: string) {
        super(page);
        this.rootElement = rootElement;
    }

    /**
     * Method which should be used across the repository, while creating
     * reference to elements, which are in root element of component.
     * @param cssLocator css selector as String. Need to be in the tree under the root element
     * @param options if you want to localize it by text, then provide an optional hasText
     * @returns Locator object
     */
     getChild(cssLocator: string, options?: { hasText: string | RegExp }): Locator {
        return this.page.locator(`${this.rootElement} ${cssLocator}`, options);
    }

}
