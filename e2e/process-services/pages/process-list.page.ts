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

import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import { $ } from 'protractor';

export class ProcessListPage {

    processListTitle = $('.adf-empty-content__title');
    processInstanceList = $('adf-process-instance-list');

    getDisplayedProcessListTitle(): Promise<string> {
        return BrowserActions.getText(this.processListTitle);
    }

    titleNotPresent(): Promise<string> {
        return BrowserVisibility.waitUntilElementIsNotPresent(this.processListTitle);
    }

    async isProcessListDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.processInstanceList);
            return true;
        } catch (error) {
            return false;
        }
    }

}
