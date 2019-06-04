/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { element, by } from 'protractor';
import { BrowserActions } from '../utils/browser-actions';

export class EmptyContentPage {

    emptyPageIcon = element(by.css('adf-empty-content__icon'));
    emptyPageTitle = element(by.css('adf-empty-content__title'));
    emptyPageSubtitle = element(by.css('adf-empty-content__subtitle'));

    getIcon() {
        return BrowserActions.getText(this.emptyPageIcon);
    }

    getSubtitle() {
        return BrowserActions.getText(this.emptyPageSubtitle);
    }

    getTitle() {
        return BrowserActions.getText(this.emptyPageTitle);
    }
}
