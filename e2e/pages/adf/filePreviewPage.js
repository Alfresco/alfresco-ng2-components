/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

var Page = require('astrolabe').Page;
var Util = require('../../util/util');
var documentList = require('./documentListPage');

var pdfTitleFromSearch = element(by.css("span[id='adf-viewer-display-name']"));
var textLayer = element.all(by.css("div[class='textLayer']")).first();
var closeButton = element(by.css("button[class*='adf-viewer-close-button']"));

/**
 * Provides the file preview Page.
 * @module pages
 * @submodule share
 * @class pages.adf.filePreviewPage
 */
module.exports = Page.create({

    /**
     * Wait for elements to appear
     * @property waitForElements
     * @type protractor.Element
     * */
    waitForElements: {
        value: function () {
            Util.waitUntilElementIsVisible(element(by.css("i[id='viewer-close-button']")));
        }
    },

    /**
     * Click view file
     * @property viewFile
     * */
    viewFile: {
        value: function (fileName) {
            documentList.checkItemInDocList(fileName);
            browser.actions().doubleClick(element(by.cssContainingText("div[data-automation-id='text_" + fileName + "']", fileName))).perform();
            this.waitForElements();
        }
    },

    /**
     * get file title
     * @method getPDFTitle
     */
    getPDFTitleFromSearch: {
        value: function () {
            var deferred = protractor.promise.defer();
            Util.waitUntilElementIsVisible(pdfTitleFromSearch);
            Util.waitUntilElementIsVisible(textLayer);
            pdfTitleFromSearch.getText().then(function (result) {
                deferred.fulfill(result);
            })
            return deferred.promise;
        }
    },

    /**
     * Check close button is displayed
     * @method checkCloseButton
     */
    checkCloseButton: {
        value: function () {
            Util.waitUntilElementIsVisible(element(by.css("i[id='viewer-close-button']")));
        }
    },

    /**
     * Check original size button
     * @method checkOriginalSizeButton
     */
    checkOriginalSizeButton: {
        value: function () {
            Util.waitUntilElementIsVisible(element(by.cssContainingText("div[id='viewer-scale-page-button'] > i ", "zoom_out_map")));
        }
    },

    /**
     * Check zoom in button
     * @method checkZoomInButton
     */
    checkZoomInButton: {
        value: function () {
            Util.waitUntilElementIsVisible(element(by.css("div[id='viewer-zoom-in-button']")));
        }
    },

    /**
     * Check zoom out button
     * @method checkZoomOutButton
     */
    checkZoomOutButton: {
        value: function () {
            Util.waitUntilElementIsVisible(element(by.css("div[id='viewer-zoom-out-button']")));
        }
    },

    /**
     * Check previous page button
     * @method checkPreviousPageButton
     */
    checkPreviousPageButton: {
        value: function () {
            Util.waitUntilElementIsVisible(element(by.css("div[id='viewer-previous-page-button']")));
        }
    },

    /**
     * Check next page button
     * @method checkNextPageButton
     */
    checkNextPageButton: {
        value: function () {
            Util.waitUntilElementIsVisible(element(by.css("div[id='viewer-next-page-button']")));
        }
    },

    /**
     * Check download button on unsupported documents
     * @method checkDownloadButton
     */
    checkDownloadButton: {
        value: function () {
            Util.waitUntilElementIsVisible(element(by.css("button[id='viewer-download-button']")));
        }
    },

    /**
     * Check current pageNumber
     * @method checkCurrentPageNumber
     */
    checkCurrentPageNumber: {
        value: function (pageNumber) {
            Util.waitUntilElementIsVisible(element(by.css("input[id='viewer-pagenumber-input'][ng-reflect-value='" + pageNumber + "']")));
        }
    },

    /**
     * Check text in file
     * @method checkText
     */
    checkText: {
        value: function (pageNumber, text) {
            var allPages = element.all(by.css("div[class='canvasWrapper'] > canvas")).first();
            var pageLoaded = element(by.css("div[id='pageContainer" + pageNumber + "'][data-loaded='true']"));
            var textLayerLoaded = element(by.css("div[id='pageContainer" + pageNumber + "'] div[class='textLayer'] > div"));
            var specificText = element(by.cssContainingText("div[id='pageContainer" + pageNumber + "'] div[class='textLayer'] > div", text));

            Util.waitUntilElementIsVisible(allPages);
            Util.waitUntilElementIsVisible(pageLoaded);
            Util.waitUntilElementIsVisible(textLayerLoaded);
            Util.waitUntilElementIsVisible(specificText);
        }
    },

    /**
     * Check total amount of pages
     * @method checkTitle
     */
    checktotalPages: {
        value: function (totalPages) {
            var totalPages = element(by.cssContainingText("div[id='viewer-total-pages']", totalPages));
            Util.waitUntilElementIsVisible(totalPages);
        }
    },

    /**
     * Go to next page
     * @method goToNextPage
     */
    goToNextPage: {
        value: function () {
            var nextPageIcon = element(by.css("div[id='viewer-next-page-button']"));
            Util.waitUntilElementIsVisible(nextPageIcon);
            nextPageIcon.click();
        }
    },

    /**
     * Go to previous page
     * @method goToPreviousPage
     */
    goToPreviousPage: {
        value: function () {
            var previousPageIcon = element(by.css("div[id='viewer-previous-page-button']"));
            Util.waitUntilElementIsVisible(previousPageIcon);
            previousPageIcon.click();
        }
    },

    /**
     * Go to certain page
     * @method goToPage
     */
    goToPage: {
        value: function (page) {
            var pageInput = element(by.css("input[id='viewer-pagenumber-input']"));

            Util.waitUntilElementIsVisible(pageInput);
            pageInput.clear().sendKeys(page);
            pageInput.sendKeys(protractor.Key.ENTER);
        }
    },

    /**
     * Close preview with close option
     * @method closePreviewWithButton
     */
    closePreviewWithButton: {
        value: function () {
            Util.waitUntilElementIsVisible(closeButton);
            closeButton.click();
        }
    },

    /**
     * Close preview by pressing esc key
     * @method closePreviewWithEsc
     */
    closePreviewWithEsc: {
        value: function (fileName) {
            var filePreview = element.all(by.css("div[class='canvasWrapper'] > canvas")).first();

            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            documentList.checkItemInDocList(fileName);
            Util.waitUntilElementIsNotOnPage(filePreview);
        }
    },

    /**
     * Close preview by pressing esc key
     * @method clickDownload
     */
    clickDownload: {
        value: function (fileName) {
            var downloadButton = element(by.css("button[id='viewer-download-button']"));

            Util.waitUntilElementIsVisible(downloadButton);
            downloadButton.click();
        }
    },

    /**
     * Click zoom in
     * @method clickZoomIn
     */
    clickZoomIn: {
        value: function () {
            var zoomInButton = element(by.css("div[id='viewer-zoom-in-button']"));

            Util.waitUntilElementIsVisible(zoomInButton);
            zoomInButton.click();
        }
    },

    /**
     * Click zoom in
     * @method clickZoomIn
     */
    clickZoomOut: {
        value: function () {
            var zoomOutButton = element(by.css("div[id='viewer-zoom-out-button']"));

            Util.waitUntilElementIsVisible(zoomOutButton);
            zoomOutButton.click();
        }
    },

    /**
     * Click actual size
     * @method clickActualSize
     */
    clickActualSize: {
        value: function () {
            var actualSizeButton = element(by.css("div[id='viewer-scale-page-button']"));

            Util.waitUntilElementIsVisible(actualSizeButton);
            actualSizeButton.click();
        }
    },

    /**
     * Check canvas width
     * @method checkCanvasWidth
     */
    checkCanvasWidth: {
        value: function () {
            return element.all(by.css("div[class='canvasWrapper'] > canvas")).first().getAttribute("width").then(function(width) {
                return width;
            });
        }
    },

    /**
     * Check canvas height
     * @method checkCanvasHeight
     */
    checkCanvasHeight: {
        value: function () {
            return element.all(by.css("div[class='canvasWrapper'] > canvas")).first().getAttribute("height").then(function(height) {
                return height;
            });
        }
    },

    /**
     * Zoom in and check
     * @method zoomIn
     */
    zoomIn: {
        value: function () {
            var canvasLayer = element.all(by.css("div[class='canvasWrapper'] > canvas")).first();
            var textLayer = element(by.css("div[id*='pageContainer'] div[class='textLayer'] > div"));

            Util.waitUntilElementIsVisible(canvasLayer);
            Util.waitUntilElementIsVisible(textLayer);

            var actualWidth,
                zoomedInWidth,
                actualHeight,
                zoomedInHeight;

            this.checkCanvasWidth().then(function (width) {
                actualWidth = width;
                if (actualWidth && zoomedInWidth) {
                    expect(zoomedInWidth).toBeGreaterThan(actualWidth);
                }
            });

            this.checkCanvasHeight().then(function (height) {
                actualHeight = height;
                if (actualHeight && zoomedInHeight) {
                    expect(zoomedInHeight).toBeGreaterThan(actualHeight);
                }
            });

            this.clickZoomIn();

            this.checkCanvasWidth().then(function (width) {
                zoomedInWidth = width;
                if (actualWidth && zoomedInWidth) {
                    expect(zoomedInWidth).toBeGreaterThan(actualWidth);
                }
            });

            this.checkCanvasHeight().then(function (height) {
                zoomedInHeight = height;
                if (actualHeight && zoomedInHeight) {
                    expect(zoomedInHeight).toBeGreaterThan(actualHeight);
                }
            });
        }
    },

    /**
     * Check actual size of document, zoom in, actual size
     * @method zoomIn
     */
    actualSize: {
        value: function () {
            var canvasLayer = element.all(by.css("div[class='canvasWrapper'] > canvas")).first();
            var textLayer = element(by.css("div[id*='pageContainer'] div[class='textLayer'] > div"));

            Util.waitUntilElementIsVisible(canvasLayer);
            Util.waitUntilElementIsVisible(textLayer);

            var actualWidth,
                actualHeight,
                zoomedWidth,
                zoomedHeight,
                newWidth,
                newHeight;

            this.checkCanvasWidth().then(function (width) {
                actualWidth = width;
            });

            this.checkCanvasHeight().then(function (height) {
                actualHeight = height;
            });

            this.clickZoomIn();

            this.checkCanvasWidth().then(function (width) {
                zoomedWidth = width;
            });

            this.checkCanvasHeight().then(function (height) {
                zoomedHeight = height;
            });

            this.clickActualSize();

            this.checkCanvasWidth().then(function (width) {
                newWidth = width;
                if (actualWidth && zoomedWidth && newWidth) {
                    expect(newWidth).toBeLessThan(zoomedWidth);
                    expect(newWidth).toEqual(actualWidth);
                }
            });

            this.checkCanvasHeight().then(function (height) {
                newHeight = height;
                if (actualHeight && zoomedHeight && newHeight) {
                    expect(newHeight).toBeLessThan(zoomedHeight);
                    expect(newHeight).toEqual(actualHeight);
                }
            });
        }
    },

    /**
     * Zoom out and check
     * @method zoomOut
     */
    zoomOut: {
        value: function () {
            var canvasLayer = element.all(by.css("div[class='canvasWrapper'] > canvas")).first();
            var textLayer = element(by.css("div[id*='pageContainer'] div[class='textLayer'] > div"));

            Util.waitUntilElementIsVisible(canvasLayer);
            Util.waitUntilElementIsVisible(textLayer);

            var actualWidth,
                zoomedOutWidth,
                actualHeight,
                zoomedOutHeight;

            this.checkCanvasWidth().then(function (width) {
                actualWidth = width;
                if (actualWidth && zoomedOutWidth) {
                    expect(zoomedOutWidth).toBeLessThan(actualWidth);
                }
            });

            this.checkCanvasHeight().then(function (height) {
                actualHeight = height;
                if (actualHeight && zoomedOutHeight) {
                    expect(zoomedOutHeight).toBeLessThan(actualHeight);
                }
            });

            this.clickZoomOut();

            this.checkCanvasWidth().then(function (width) {
                zoomedOutWidth = width;
                if (actualWidth && zoomedOutWidth) {
                    expect(zoomedOutWidth).toBeLessThan(actualWidth);
                }
            });

            this.checkCanvasHeight().then(function (height) {
                zoomedInHeight = height;
                if (actualHeight && zoomedOutHeight) {
                    expect(zoomedOutHeight).toBeLessThan(actualHeight);
                }
            });
        }
    },
});
