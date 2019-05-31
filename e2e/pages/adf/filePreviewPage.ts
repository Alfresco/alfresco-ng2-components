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
    textLayer = element.all(by.css(`div[class='textLayer'] > div`)).first();
    canvasLayer = element.all(by.css(`div[class='canvasWrapper'] > canvas`)).first();
    closeButton = element(by.css('button[data-automation-id="adf-toolbar-back"]'));
    zoomInButton = element(by.id('viewer-zoom-in-button'));
    zoomOutButton = element(by.id('viewer-zoom-out-button'));
    scalePageButton = element(by.id('viewer-scale-page-button'));

    waitForElements() {
        BrowserVisibility.waitUntilElementIsVisible(this.closeButton);

        BrowserVisibility.waitUntilElementIsVisible(this.canvasLayer);
        BrowserVisibility.waitUntilElementIsVisible(this.textLayer);
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
        BrowserActions.click(this.zoomInButton);
    }

    clickZoomOut() {
        BrowserActions.click(this.zoomOutButton);
    }

    clickActualSize() {
        BrowserActions.click(this.scalePageButton);
    }

    getCanvasWidth() {
        return this.canvasLayer.getAttribute(`width`).then((width) => {
            return width;
        });
    }

    getCanvasHeight() {
        return this.canvasLayer.getAttribute(`height`).then((height) => {
            return height;
        });
    }

    zoomIn() {
        this.waitForElements();

        let actualWidth,
            zoomedInWidth,
            actualHeight,
            zoomedInHeight;

        this.getCanvasWidth().then((width) => {
            actualWidth = width;
        });

        this.getCanvasHeight().then((height) => {
            actualHeight = height;
        });

        this.clickZoomIn();

        this.getCanvasWidth().then((width) => {
            zoomedInWidth = width;
            if (actualWidth && zoomedInWidth) {
                expect(zoomedInWidth).toBeGreaterThan(actualWidth);
            }
        });

        this.getCanvasHeight().then((height) => {
            zoomedInHeight = height;
            if (actualHeight && zoomedInHeight) {
                expect(zoomedInHeight).toBeGreaterThan(actualHeight);
            }
        });
    }

    actualSize() {
        this.waitForElements();

        let actualWidth,
            actualHeight,
            zoomedWidth,
            zoomedHeight,
            newWidth,
            newHeight;

        this.getCanvasWidth().then((width) => {
            actualWidth = width;
        });

        this.getCanvasHeight().then((height) => {
            actualHeight = height;
        });

        this.clickZoomIn();

        this.getCanvasWidth().then((width) => {
            zoomedWidth = width;
        });

        this.getCanvasHeight().then((height) => {
            zoomedHeight = height;
        });

        this.clickActualSize();

        this.getCanvasWidth().then((width) => {
            newWidth = width;
            if (actualWidth && zoomedWidth && newWidth) {
                expect(+newWidth).toBeLessThan(+zoomedWidth);
                expect(+newWidth).toEqual(+actualWidth);
            }
        });

        this.getCanvasHeight().then((height) => {
            newHeight = height;
            if (actualHeight && zoomedHeight && newHeight) {
                expect(newHeight).toBeLessThan(zoomedHeight);
                expect(newHeight).toEqual(actualHeight);
            }
        });
    }

    zoomOut() {
        this.waitForElements();

        let actualWidth;
        let zoomedOutWidth;
        let actualHeight;
        let zoomedOutHeight;

        this.getCanvasWidth().then((width) => {
            actualWidth = width;
        });

        this.getCanvasHeight().then((height) =>  {
            actualHeight = height;
        });

        this.clickZoomOut();

        this.getCanvasWidth().then((width) => {
            zoomedOutWidth = width;
            if (actualWidth && zoomedOutWidth) {
                expect(+zoomedOutWidth).toBeLessThan(+actualWidth);
            }
        });

        this.getCanvasHeight().then((height) => {
            zoomedOutHeight = height;
            if (actualHeight && zoomedOutHeight) {
                expect(+zoomedOutHeight).toBeLessThan(+actualHeight);
            }
        });
    }
}
