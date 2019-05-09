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

import { browser, by, element, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class FilePreviewPage {

    pdfTitleFromSearch = element(by.css(`span[id='adf-viewer-display-name']`));
    textLayer = element.all(by.css(`div[class='textLayer']`)).first();
    closeButton = element(by.css('button[data-automation-id="adf-toolbar-back"]'));

    waitForElements() {
        BrowserVisibility.waitUntilElementIsVisible(element(by.css(`i[id='viewer-close-button']`)));
    }

    viewFile(fileName) {
        BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText(`div[data-automation-id="${fileName}"]`, fileName)));
        browser.actions().doubleClick(element(by.cssContainingText(`div[data-automation-id="${fileName}"]`, fileName))).perform();
        this.waitForElements();
    }

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

    clickZoomIn() {
        const zoomInButton = element(by.css(`div[id='viewer-zoom-in-button']`));
        BrowserActions.click(zoomInButton);
    }

    clickZoomOut() {
        const zoomOutButton = element(by.css(`div[id='viewer-zoom-out-button']`));
        BrowserActions.click(zoomOutButton);
    }

    clickActualSize() {
        const actualSizeButton = element(by.css(`div[id='viewer-scale-page-button']`));
        BrowserActions.click(actualSizeButton);
    }

    checkCanvasWidth() {
        return element.all(by.css(`div[class='canvasWrapper'] > canvas`)).first().getAttribute(`width`).then((width) => {
            return width;
        });
    }

    checkCanvasHeight() {
        return element.all(by.css(`div[class='canvasWrapper'] > canvas`)).first().getAttribute(`height`).then((height) => {
            return height;
        });
    }

    zoomIn() {
        const canvasLayer = element.all(by.css(`div[class='canvasWrapper'] > canvas`)).first();
        const textLayer = element(by.css(`div[id*='pageContainer'] div[class='textLayer'] > div`));

        BrowserVisibility.waitUntilElementIsVisible(canvasLayer);
        BrowserVisibility.waitUntilElementIsVisible(textLayer);

        let actualWidth,
            zoomedInWidth,
            actualHeight,
            zoomedInHeight;

        this.checkCanvasWidth().then((width) => {
            actualWidth = width;
            if (actualWidth && zoomedInWidth) {
                expect(zoomedInWidth).toBeGreaterThan(actualWidth);
            }
        });

        this.checkCanvasHeight().then((height) => {
            actualHeight = height;
            if (actualHeight && zoomedInHeight) {
                expect(zoomedInHeight).toBeGreaterThan(actualHeight);
            }
        });

        this.clickZoomIn();

        this.checkCanvasWidth().then((width) => {
            zoomedInWidth = width;
            if (actualWidth && zoomedInWidth) {
                expect(zoomedInWidth).toBeGreaterThan(actualWidth);
            }
        });

        this.checkCanvasHeight().then((height) => {
            zoomedInHeight = height;
            if (actualHeight && zoomedInHeight) {
                expect(zoomedInHeight).toBeGreaterThan(actualHeight);
            }
        });
    }

    actualSize() {
        const canvasLayer = element.all(by.css(`div[class='canvasWrapper'] > canvas`)).first();
        const textLayer = element(by.css(`div[id*='pageContainer'] div[class='textLayer'] > div`));

        BrowserVisibility.waitUntilElementIsVisible(canvasLayer);
        BrowserVisibility.waitUntilElementIsVisible(textLayer);

        let actualWidth,
            actualHeight,
            zoomedWidth,
            zoomedHeight,
            newWidth,
            newHeight;

        this.checkCanvasWidth().then((width) => {
            actualWidth = width;
        });

        this.checkCanvasHeight().then((height) => {
            actualHeight = height;
        });

        this.clickZoomIn();

        this.checkCanvasWidth().then((width) => {
            zoomedWidth = width;
        });

        this.checkCanvasHeight().then((height) => {
            zoomedHeight = height;
        });

        this.clickActualSize();

        this.checkCanvasWidth().then((width) => {
            newWidth = width;
            if (actualWidth && zoomedWidth && newWidth) {
                expect(newWidth).toBeLessThan(zoomedWidth);
                expect(newWidth).toEqual(actualWidth);
            }
        });

        this.checkCanvasHeight().then((height) => {
            newHeight = height;
            if (actualHeight && zoomedHeight && newHeight) {
                expect(newHeight).toBeLessThan(zoomedHeight);
                expect(newHeight).toEqual(actualHeight);
            }
        });
    }
}
