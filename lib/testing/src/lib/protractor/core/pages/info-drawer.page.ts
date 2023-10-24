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

import { ElementFinder, $ } from 'protractor';
import { BrowserVisibility } from './../utils/browser-visibility';

// TODO: cleanup once https://github.com/Alfresco/hxp-frontend-apps/pull/6582 is merged
export class InfoDrawerPage {
    rootElement: ElementFinder;

    constructor() {
        this.rootElement = $(`adf-info-drawer[class*='adf-info-drawer']`);
    }

    // used in APA
    async isInfoDrawerDisplayed(): Promise<boolean> {
        try {
            const infoDrawerElement = $(`adf-info-drawer[class*='adf-info-drawer']`);
            await BrowserVisibility.waitUntilElementIsVisible(infoDrawerElement);
            return true;
        } catch (error) {
            return false;
        }
    }
}
