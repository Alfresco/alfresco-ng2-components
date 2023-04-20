/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
     *
     * @param cssLocator css selector as String. Need to be in the tree under the root element
     * @param options if you want to localize it by text, then provide an optional hasText
     * @returns Locator object
     */
     getChild(cssLocator: string, options?: { hasText: string | RegExp }): Locator {
        return this.page.locator(`${this.rootElement} ${cssLocator}`, options);
    }

}
