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
import { ElementFinder } from 'protractor/built/element';

import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class InfinitePaginationPage {

    rootElement: ElementFinder;
    loadMoreButton;

    constructor(rootElement: ElementFinder = element.all(by.css('adf-infinite-pagination')).first()) {
        this.rootElement = rootElement;
        this.loadMoreButton = this.rootElement.element(by.css('button[data-automation-id="adf-infinite-pagination-button"]'));
    }

    clickLoadMoreButton() {
        BrowserActions.click(this.loadMoreButton);
        return this;
    }

    checkLoadMoreButtonIsNotDisplayed() {
        return BrowserVisibility.waitUntilElementIsNotOnPage(this.loadMoreButton);
    }

}
