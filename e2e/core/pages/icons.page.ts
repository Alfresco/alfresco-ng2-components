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

import { $, ElementFinder } from 'protractor';
import { BrowserVisibility } from '@alfresco/adf-testing';

export class IconsPage {

    locateCustomIcon = (name: string): ElementFinder => $(`adf-icon[value='${name}'] svg`);
    locateLigatureIcon = (name: string): ElementFinder => $(`adf-icon[value='${name}'] .material-icons`);

    async isCustomIconDisplayed(name: string) {
        const present = await BrowserVisibility.waitUntilElementIsVisible(this.locateCustomIcon(name));
        if (present) {
          return this.locateCustomIcon(name).isDisplayed();
        } else {
          return false;
        }
    }

    async isLigatureIconDisplayed(name: string) {
        const present = await BrowserVisibility.waitUntilElementIsVisible(this.locateLigatureIcon(name));
        if (present) {
          return this.locateLigatureIcon(name).isDisplayed();
        } else {
          return false;
        }
    }
}
