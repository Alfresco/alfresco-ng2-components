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

var Util = require('../../util/util');

var ViewerToolbarPage = function () {

    var closeButton = element(by.css("button[data-automation-id='adf-toolbar-back']"));
    var fileName = element(by.id('adf-viewer-display-name'));
    var downloadButton = element(by.css("button[data-automation-id='adf-toolbar-download'] > span > mat-icon"));
    var infoButton = element(by.css("button[data-automation-id='adf-toolbar-sidebar']"));
    var previousPageButton = element(by.id('viewer-previous-page-button'));
    var nextPageButton = element(by.id('viewer-next-page-button'));
    var zoomInButton = element(by.id('viewer-zoom-in-button'));
    var zoomOutButton = element(by.id('viewer-zoom-out-button'));
    var scalePageButton = element(by.id('viewer-scale-page-button'));
    var pdfContainer = element(by.id('viewer-pdf-container'));
    var fullScreenButton = element(by.css("button[data-automation-id='adf-toolbar-fullscreen']"));
    var rotateLeft = element(by.css("button[id='viewer-rotate-left-button']"));
    var rotateRight = element(by.css("button[id='viewer-rotate-right-button']"));
    var scaleImg = element(by.css("button[id='viewer-reset-button']"));
    var customBtn = element(by.css("data-automation-id='adf-toolbar-custom-btn'"));
    var fileThumbnail = element(by.css("img[data-automation-id='adf-file-thumbnail']"));
    var pageSelectorInput = element(by.css("input[data-automation-id='adf-page-selector']"));
    var imgContainer = element(by.css("div[data-automation-id='adf-image-container']"));
    var mediaContainer = element(by.css("adf-media-player[class='adf-media-player ng-star-inserted']"));
    var allPages = element.all(by.css("div[class='canvasWrapper'] > canvas")).first();
    var percentage = element(by.css("div[data-automation-id='adf-page-scale'"));

    this.viewFile = function (fileName) {
        var fileView = element(by.xpath("//div[@class='document-list-container']//span[@title='" + fileName +"']"));
        Util.waitUntilElementIsVisible(fileView);
        fileView.click();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    };

    this.clearPageNumber = function ()
    {
        Util.waitUntilElementIsVisible(pageSelectorInput);
        pageSelectorInput.clear();
        pageSelectorInput.sendKeys(protractor.Key.ENTER);
    };

    this.getZoom = function ()
    {
        return percentage.getText();
    };

    this.exitFullScreen = function () {
        var jsCode = "document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen&&document.webkitExitFullscreen();";
        browser.executeScript(jsCode);
    };

    this.checkCloseButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(closeButton);
    };

    this.checkDownloadButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(downloadButton);
    };

    this.checkInfoButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(infoButton);
    };

    this.checkFileThumbnailIsDisplayed = function () {
        Util.waitUntilElementIsVisible(fileThumbnail);
    };

    this.checkFileNameIsDisplayed = function (file) {
        Util.waitUntilElementIsVisible(fileName);
        expect(fileName.getText()).toEqual(file);
    };

    this.checkPreviousPageButtonIsDisplayed =function () {
        Util.waitUntilElementIsVisible(previousPageButton);
    };

    this.checkNextPageButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(nextPageButton);
    };

    this.checkZoomInButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(zoomInButton);
    };

    this.checkZoomInButtonIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(zoomInButton);
    };

    this.checkZoomOutButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(zoomOutButton);
    };

    this.checkScalePageButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(scalePageButton);
    };

    this.checkPageSelectorInputIsDisplayed = function (number) {
        Util.waitUntilElementIsVisible(pageSelectorInput);
        pageSelectorInput.getAttribute('value').then(function (pageNumber) {
            expect(pageNumber).toEqual(number);
        })
    };

    this.checkImgContainerIsDisplayed = function () {
        Util.waitUntilElementIsVisible(imgContainer);
    };

    this.checkPdfContainerIsDisplayed = function () {
        Util.waitUntilElementIsVisible(pdfContainer);
    };

    this.checkMediaPlayerContainerIsDisplayed = function () {
        Util.waitUntilElementIsVisible(mediaContainer);
    };

    this.checkFileContent = function (pageNumber, text) {
        var pageLoaded = element.all(by.css("div[data-page-number='" + pageNumber + "'][data-loaded='true']")).first();
        var textLayerLoaded = element.all(by.css("div[data-page-number='" + pageNumber + "'] div[class='textLayer'] > div")).first();
        var specificText = element.all(by.cssContainingText("div[data-page-number='" + pageNumber + "'] div[class='textLayer'] > div", text)).first();
        Util.waitUntilElementIsVisible(allPages);
        Util.waitUntilElementIsVisible(pageLoaded);
        Util.waitUntilElementIsVisible(textLayerLoaded);
        Util.waitUntilElementIsVisible(specificText);
    };

    this.checkFullScreenButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(fullScreenButton);
    };

    this.checkFullScreenButtonIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(fullScreenButton);
    };

    this.checkPercentageIsDisplayed = function () {
        Util.waitUntilElementIsVisible(percentage);
    };

    this.checkZoomedIn = function (zoom)
    {
        expect(percentage.getText()).toBeGreaterThan(zoom);

    };

    this.checkZoomedOut = function (zoom)
    {
        expect(percentage.getText()).toBeLessThan(zoom);

    };

    this.checkRotateLeftButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(rotateLeft);
    };

    this.checkRotateRightButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(rotateRight);
    };

    this.checkScaled = function (zoom)
    {
        expect(percentage.getText()).toEqual(zoom);
    };

    this.checkScaleImgButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(scaleImg);
    };

    this.checkRotation = function (text)
    {
        rotation = imgContainer.getAttribute('style');
        expect(rotation).toEqual(text);
    };

    this.checkCustomBtnDisplayed = function ()
    {
        Util.waitUntilElementIsVisible(customBtn);
    };

    this.clickScaleImgButton = function ()
    {
        Util.waitUntilElementIsClickable(scaleImg);
        scaleImg.click();
    };

    this.clickScalePdfButton = function ()
    {
        Util.waitUntilElementIsClickable(scalePageButton);
        scalePageButton.click();
    };

    this.clickDownloadButton = function () {
        Util.waitUntilElementIsVisible(downloadButton);
        downloadButton.click();
    };

    this.clickCloseButton = function () {
        Util.waitUntilElementIsVisible(closeButton);
        closeButton.click();
    };

    this.clickPreviousPageButton = function () {
        Util.waitUntilElementIsVisible(previousPageButton);
        previousPageButton.click();
    };

    this.clickNextPageButton = function () {
        Util.waitUntilElementIsVisible(nextPageButton);
        nextPageButton.click();
    };

    this.clickZoomInButton = function () {
        Util.waitUntilElementIsVisible(zoomInButton);
        zoomInButton.click();
    };

    this.clickZoomOutButton = function () {
        Util.waitUntilElementIsVisible(zoomOutButton);
        zoomOutButton.click();
    };

    this.clickScalePageButton = function () {
        Util.waitUntilElementIsVisible(scalePageButton);
        scalePageButton.click();
    };

    this.clickFullScreenButton = function ()
    {
        Util.waitUntilElementIsClickable(fullScreenButton);
        fullScreenButton.click();
    };

    this.clickRotateLeftButton = function ()
    {
        Util.waitUntilElementIsClickable(rotateLeft);
        rotateLeft.click();
    };

    this.clickRotateRightButton = function ()
    {
        Util.waitUntilElementIsClickable(rotateRight);
        rotateRight.click();
    };
};

module.exports = ViewerToolbarPage;
