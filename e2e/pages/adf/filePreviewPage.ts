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

import { by, element, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class FilePreviewPage {

    pdfTitleFromSearch = element(by.css(`span[id='adf-viewer-display-name']`));
    textLayer = element.all(by.css(`div[class='textLayer'] > div`)).first();

    getPDFTitleFromSearch() {
        const deferred = protractor.promise.defer();
        BrowserVisibility.waitUntilElementIsVisible(this.pdfTitleFromSearch);
        BrowserVisibility.waitUntilElementIsVisible(this.textLayer);
        this.pdfTitleFromSearch.getText().then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    closePreviewWithButton() {
        BrowserActions.clickExecuteScript('button[data-automation-id="adf-toolbar-back"]');
    }
}
