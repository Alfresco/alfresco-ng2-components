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

import { $ } from 'protractor';
import { BrowserActions } from '../utils/browser-actions';
import { BrowserVisibility } from '../utils/browser-visibility';

export class ContextMenuPage {
    contextMenu = $('#adf-context-menu-content');

    async isContextMenuDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.contextMenu);
            return true;
        } catch (error) {
            return false;
        }
    }

    async clickContextMenuActionNamed(actionName: string): Promise<void> {
        await BrowserActions.click($(`button[data-automation-id="context-${actionName}"]`));
    }
}
