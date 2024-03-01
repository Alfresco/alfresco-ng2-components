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

import { by, element, $ } from 'protractor';
import { TestElement } from '../../../test-element';
import { BrowserActions, BrowserVisibility } from '../../../utils/public-api';
import { materialLocators } from '../../public-api';

export class TabPage {

    changeTabAnimation = $(`${materialLocators.Tab.labels.class} div[class="${materialLocators.Ripple.element.root}"]`);

    public disabledContentNodeSelectorTabInfoIcon = TestElement.byCss('[data-automation-id="adf-content-node-selector-disabled-tab-info-icon"]');

    async clickTabByLabel(tabLabel): Promise<void> {
        const user = element(by.cssContainingText(materialLocators.Tab.label.content.root, tabLabel));
        await BrowserActions.click(user);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.changeTabAnimation);
    }

    async checkTabIsDisplayedByLabel(tabLabel): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText(materialLocators.Tab.label.content.class, tabLabel)));
    }

    async checkTabIsNotDisplayedByLabel(tabLabel): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.cssContainingText(materialLocators.Tab.label.content.class, tabLabel)));
    }
}
