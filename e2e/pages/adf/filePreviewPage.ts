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
import { Util } from '../../util/util';

export class FilePreviewPage {

    pdfTitleFromSearch = element(by.css(`span[id='adf-viewer-display-name']`));
    textLayer = element.all(by.css(`div[class='textLayer']`)).first();
    closeButton = element(by.css('button[data-automation-id="adf-toolbar-back"]'));

    waitForElements() {
        Util.waitUntilElementIsVisible(element(by.css(`i[id='viewer-close-button']`)));
    }

    viewFile(fileName) {
        Util.waitUntilElementIsVisible(element(by.cssContainingText(`div[data-automation-id="${fileName}"]`, fileName)));
        browser.actions().doubleClick(element(by.cssContainingText(`div[data-automation-id="${fileName}"]`, fileName))).perform();
        this.waitForElements();
    }

    getPDFTitleFromSearch() {
        let deferred = protractor.promise.defer();
        Util.waitUntilElementIsVisible(this.pdfTitleFromSearch);
        Util.waitUntilElementIsVisible(this.textLayer);
        this.pdfTitleFromSearch.getText().then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    checkCloseButton() {
        Util.waitUntilElementIsVisible(element(by.css(`i[id='viewer-close-button']`)));
    }

    checkOriginalSizeButton() {
        Util.waitUntilElementIsVisible(element(by.cssContainingText(`div[id='viewer-scale-page-button'] > i `, `zoom_out_map`)));
    }

    checkZoomInButton() {
        Util.waitUntilElementIsVisible(element(by.css(`div[id='viewer-zoom-in-button']`)));

    }

    checkZoomOutButton() {
        Util.waitUntilElementIsVisible(element(by.css(`div[id='viewer-zoom-out-button']`)));
    }

    checkPreviousPageButton() {
        Util.waitUntilElementIsVisible(element(by.css(`div[id='viewer-previous-page-button']`)));
    }

    checkNextPageButton() {
        Util.waitUntilElementIsVisible(element(by.css(`div[id='viewer-next-page-button']`)));
    }

    checkDownloadButton() {
        Util.waitUntilElementIsVisible(element(by.css(`button[id='viewer-download-button']`)));
    }

    checkCurrentPageNumber(pageNumber) {
        Util.waitUntilElementIsVisible(element(by.css(`input[id='viewer-pagenumber-input'][ng-reflect-value="${pageNumber}"]`)));
    }

    checkText(pageNumber, text) {
        let allPages = element.all(by.css(`div[class='canvasWrapper'] > canvas`)).first();
        let pageLoaded = element(by.css(`div[id="pageContainer${pageNumber}"][data-loaded='true']`));
        let textLayerLoaded = element(by.css(`div[id="pageContainer${pageNumber}"] div[class='textLayer'] > div`));
        let specificText = element(by.cssContainingText(`div[id="pageContainer${pageNumber}"] div[class='textLayer'] > div`, text));

        Util.waitUntilElementIsVisible(allPages);
        Util.waitUntilElementIsVisible(pageLoaded);
        Util.waitUntilElementIsVisible(textLayerLoaded);
        Util.waitUntilElementIsVisible(specificText);
    }

    goToNextPage() {
        let nextPageIcon = element(by.css(`div[id='viewer-next-page-button']`));
        Util.waitUntilElementIsVisible(nextPageIcon);
        nextPageIcon.click();
    }

    goToPreviousPage() {
        let previousPageIcon = element(by.css(`div[id='viewer-previous-page-button']`));
        Util.waitUntilElementIsVisible(previousPageIcon);
        previousPageIcon.click();
    }

    goToPage(page) {
        let pageInput = element(by.css(`input[id='viewer-pagenumber-input']`));

        Util.waitUntilElementIsVisible(pageInput);
        pageInput.clear();
        pageInput.sendKeys(page);
        pageInput.sendKeys(protractor.Key.ENTER);
    }

    closePreviewWithButton() {
        Util.waitUntilElementIsVisible(this.closeButton);
        this.closeButton.click();
    }

    closePreviewWithEsc(fileName) {
        let filePreview = element.all(by.css(`div[class='canvasWrapper'] > canvas`)).first();

        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        Util.waitUntilElementIsVisible(element(by.cssContainingText(`div[data-automation-id="text_${fileName}"]`, fileName)));
        Util.waitUntilElementIsNotOnPage(filePreview);
    }

    clickDownload(fileName) {
        let downloadButton = element(by.css(`button[id='viewer-download-button']`));

        Util.waitUntilElementIsVisible(downloadButton);
        downloadButton.click();
    }

    clickZoomIn() {
        let zoomInButton = element(by.css(`div[id='viewer-zoom-in-button']`));

        Util.waitUntilElementIsVisible(zoomInButton);
        zoomInButton.click();
    }

    clickZoomOut() {
        let zoomOutButton = element(by.css(`div[id='viewer-zoom-out-button']`));

        Util.waitUntilElementIsVisible(zoomOutButton);
        zoomOutButton.click();
    }

    clickActualSize() {
        let actualSizeButton = element(by.css(`div[id='viewer-scale-page-button']`));

        Util.waitUntilElementIsVisible(actualSizeButton);
        actualSizeButton.click();
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
        let canvasLayer = element.all(by.css(`div[class='canvasWrapper'] > canvas`)).first();
        let textLayer = element(by.css(`div[id*='pageContainer'] div[class='textLayer'] > div`));

        Util.waitUntilElementIsVisible(canvasLayer);
        Util.waitUntilElementIsVisible(textLayer);

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

        this.checkCanvasHeight().then( (height) => {
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

        this.checkCanvasHeight().then( (height) => {
            zoomedInHeight = height;
            if (actualHeight && zoomedInHeight) {
                expect(zoomedInHeight).toBeGreaterThan(actualHeight);
            }
        });
    }

    actualSize() {
        let canvasLayer = element.all(by.css(`div[class='canvasWrapper'] > canvas`)).first();
        let textLayer = element(by.css(`div[id*='pageContainer'] div[class='textLayer'] > div`));

        Util.waitUntilElementIsVisible(canvasLayer);
        Util.waitUntilElementIsVisible(textLayer);

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

    zoomOut() {
        let canvasLayer = element.all(by.css(`div[class='canvasWrapper'] > canvas`)).first();
        let textLayer = element(by.css(`div[id*='pageContainer'] div[class='textLayer'] > div`));

        Util.waitUntilElementIsVisible(canvasLayer);
        Util.waitUntilElementIsVisible(textLayer);

        let actualWidth,
            zoomedOutWidth,
            actualHeight,
            zoomedOutHeight;

        this.checkCanvasWidth().then((width) => {
            actualWidth = width;
            if (actualWidth && zoomedOutWidth) {
                expect(zoomedOutWidth).toBeLessThan(actualWidth);
            }
        });

        this.checkCanvasHeight().then((height) =>  {
            actualHeight = height;
            if (actualHeight && zoomedOutHeight) {
                expect(zoomedOutHeight).toBeLessThan(actualHeight);
            }
        });

        this.clickZoomOut();

        this.checkCanvasWidth().then((width) => {
            zoomedOutWidth = width;
            if (actualWidth && zoomedOutWidth) {
                expect(zoomedOutWidth).toBeLessThan(actualWidth);
            }
        });

        this.checkCanvasHeight().then(() => {
            if (actualHeight && zoomedOutHeight) {
                expect(zoomedOutHeight).toBeLessThan(actualHeight);
            }
        });
    }
}
