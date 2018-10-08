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

import Util = require('../../util/util');

import { TabsPage } from './material/tabsPage';
import { FormControllersPage } from './material/formControllersPage';
import { element, by, browser, protractor } from 'protractor';

export class ViewerPage {

    tabsPage = new TabsPage();
    formControllersPage = new FormControllersPage();

    closeButton = element(by.css('button[data-automation-id="adf-toolbar-back"]'));
    fileName = element(by.id('adf-viewer-display-name'));
    infoButton = element(by.css('button[data-automation-id="adf-toolbar-sidebar"]'));
    leftSideBarButton = element(by.css('button[data-automation-id="adf-toolbar-left-sidebar"]'));
    previousPageButton = element(by.id('viewer-previous-page-button'));
    nextPageButton = element(by.id('viewer-next-page-button'));
    zoomInButton = element(by.id('viewer-zoom-in-button'));
    zoomOutButton = element(by.id('viewer-zoom-out-button'));
    scalePageButton = element(by.id('viewer-scale-page-button'));
    pdfContainer = element(by.id('viewer-pdf-container'));
    fullScreenButton = element(by.css('button[data-automation-id="adf-toolbar-fullscreen"]'));
    rotateLeft = element(by.css('button[id="viewer-rotate-left-button"]'));
    rotateRight = element(by.css('button[id="viewer-rotate-right-button"]'));
    scaleImg = element(by.css('button[id="viewer-reset-button"]'));
    customBtn = element(by.css('data-automation-id="adf-toolbar-custom-btn"'));
    fileThumbnail = element(by.css('img[data-automation-id="adf-file-thumbnail"]'));
    pageSelectorInput = element(by.css('input[data-automation-id="adf-page-selector"]'));
    imgContainer = element(by.css('div[data-automation-id="adf-image-container"]'));
    mediaContainer = element(by.css('adf-media-player[class="adf-media-player ng-star-inserted"]'));
    percentage = element(by.css('div[data-automation-id="adf-page-scale"'));
    thumbnailsBtn = element(by.css('button[data-automation-id="adf-thumbnails-button"]'));
    thumbnailsContent = element(by.css('div[data-automation-id="adf-thumbnails-content"]'));
    thumbnailsClose = element(by.css('button[data-automation-id="adf-thumbnails-close"]'));
    secondThumbnail = element(by.css('adf-pdf-thumb > img[title="Page 2"'));
    lastThumbnailDisplayed = element.all(by.css('adf-pdf-thumb')).last();
    passwordDialog = element(by.css('adf-pdf-viewer-password-dialog'));
    passwordSubmit = element(by.css('button[data-automation-id="adf-password-dialog-submit"]'));
    passwordSubmitDisabled = element(by.css('button[data-automation-id="adf-password-dialog-submit"][disabled]'));
    passwordInput = element(by.css('input[data-automation-id="adf-password-dialog-input"]'));
    passwordError = element(by.css('mat-error[data-automation-id="adf-password-dialog-error"]'));
    infoSideBar = element(by.id('adf-right-sidebar'));
    leftSideBar = element(by.id('adf-left-sidebar'));
    unsupportedFileContainer = element(by.cssContainingText('.label', 'Document preview could not be loaded'));
    pageCanvas = element.all(by.css('div[class="canvasWrapper"]')).first();
    viewer = element(by.css('adf-viewer'));
    pdfViewer = element(by.css('adf-pdf-viewer'));
    imgViewer = element(by.css('adf-img-viewer'));
    activeTab = element(by.css('div[class*="mat-tab-label-active"]'));
    uploadNewVersionButton = element(by.css('input[data-automation-id="upload-single-file"]'));
    toolbarSwitch = element(by.id('adf-switch-toolbar'));
    toolbar = element(by.id('adf-viewer-toolbar'));
    datatableHeader = element(by.css('div.adf-datatable-header'));
    goBackSwitch = element(by.id('adf-switch-goback'));

    openWithSwitch = element(by.id('adf-switch-openwith'));
    openWith = element(by.id('adf-viewer-openwith'));

    customNameSwitch = element(by.id('adf-switch-custoname'));

    showRightSidebarSwitch = element(by.id('adf-switch-showrightsidebar'));
    showLeftSidebarSwitch = element(by.id('adf-switch-showleftsidebar'));

    moreActionsSwitch = element(by.id('adf-switch-moreactions'));
    pdfPageLoaded = element(by.css('[data-page-number="1"][data-loaded="true"], adf-img-viewer, adf-txt-viewer'));

    downloadSwitch = element(by.id('adf-switch-download'));
    downloadButton = element(by.id('adf-viewer-download'));

    printSwitch = element(by.id('adf-switch-print'));
    printButton = element(by.id('adf-viewer-print'));

    allowSidebarSwitch = element(by.id('adf-switch-allowsidebar'));
    allowLeftSidebarSwitch = element(by.id('adf-switch-allowLeftSidebar'));

    shareSwitch = element(by.id('adf-switch-share'));
    shareButton = element(by.id('adf-viewer-share'));

    uploadButton = element(by.id('adf-viewer-upload'));
    timeButton = element(by.id('adf-viewer-time'));
    bugButton = element(by.id('adf-viewer-bug'));

    canvasHeight() {
        let deferred = protractor.promise.defer();
        this.pageCanvas.getAttribute('style').then(function (value) {
            let canvasHeight = value.split('height: ')[1].split('px')[0];
            deferred.fulfill(canvasHeight);
        });
        return deferred.promise;
    }

    canvasWidth() {
        let deferred = protractor.promise.defer();
        this.pageCanvas.getAttribute('style').then(function (value) {
            let canvasWidth = value.split('width: ')[1].split('px')[0];
            deferred.fulfill(canvasWidth);
        });
        return deferred.promise;
    }

    viewFile(fileName) {
        let fileView = element.all(by.xpath('//div[@id="document-list-container"]//div[@filename="' + fileName + '"]')).first();
        Util.waitUntilElementIsVisible(fileView);
        fileView.click();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    clearPageNumber() {
        Util.waitUntilElementIsVisible(this.pageSelectorInput);
        this.pageSelectorInput.clear();
        this.pageSelectorInput.sendKeys(protractor.Key.ENTER);
    }

    getZoom() {
        return this.percentage.getText();
    }

    exitFullScreen() {
        let jsCode = 'document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen&&document.webkitExitFullscreen();';
        browser.executeScript(jsCode);
    }

    enterPassword(password) {
        Util.waitUntilElementIsVisible(this.passwordInput);
        this.passwordInput.clear();
        this.passwordInput.sendKeys(password);
    }

    checkDatatableHeaderIsDisplayed() {
        Util.waitUntilElementIsVisible(this.datatableHeader);
    }

    checkFileIsLoaded() {
        Util.waitUntilElementIsOnPage(this.pdfPageLoaded, 15000);
    }

    checkImgViewerIsDisplayed() {
        Util.waitUntilElementIsOnPage(this.imgViewer);
    }

    checkPasswordErrorIsDisplayed() {
        Util.waitUntilElementIsVisible(this.passwordError);
    }

    checkPasswordInputIsDisplayed() {
        Util.waitUntilElementIsVisible(this.passwordInput);
    }

    checkPasswordSubmitDisabledIsDisplayed() {
        Util.waitUntilElementIsVisible(this.passwordSubmitDisabled);
    }

    checkPasswordDialogIsDisplayed() {
        Util.waitUntilElementIsVisible(this.passwordDialog);
    }

    checkAllThumbnailsDisplayed(nbPages) {
        let defaultThumbnailHeight = 143;
        expect(this.thumbnailsContent.getAttribute('style')).toEqual('height: ' + nbPages * defaultThumbnailHeight + 'px; transform: translate(-50%, 0px);');
    }

    checkCurrentThumbnailIsSelected() {
        let selectedThumbnail = element(by.css('adf-pdf-thumb[class="pdf-thumbnails__thumb ng-star-inserted pdf-thumbnails__thumb--selected"] > img'));
        this.pageSelectorInput.getAttribute('value').then(function (pageNumber) {
            expect('Page ' + pageNumber).toEqual(selectedThumbnail.getAttribute('title'));
        });
    }

    checkThumbnailsCloseIsDisplayed() {
        Util.waitUntilElementIsVisible(this.thumbnailsClose);
    }

    checkThumbnailsBtnIsDisplayed() {
        Util.waitUntilElementIsVisible(this.thumbnailsBtn);
    }

    checkThumbnailsBtnIsDisabled() {
        Util.waitUntilElementIsVisible(this.thumbnailsBtn.getAttribute('disabled'));
        return this;
    }

    checkThumbnailsContentIsDisplayed() {
        Util.waitUntilElementIsVisible(this.thumbnailsContent);
    }

    checkThumbnailsContentIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.thumbnailsContent);
    }

    checkCloseButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.closeButton);
    }

    checkDownloadButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.downloadButton);
    }

    checkInfoButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.infoButton);
    }

    checkInfoButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.infoButton);
    }

    checkFileThumbnailIsDisplayed() {
        Util.waitUntilElementIsVisible(this.fileThumbnail);
    }

    checkFileNameIsDisplayed(file) {
        Util.waitUntilElementIsVisible(this.fileName);
        expect(this.fileName.getText()).toEqual(file);
    }

    checkPreviousPageButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.previousPageButton);
    }

    checkNextPageButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.nextPageButton);
    }

    checkZoomInButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.zoomInButton);
    }

    checkZoomInButtonIsDisplayed(timeout) {
        Util.waitUntilElementIsVisible(this.zoomInButton, timeout);
    }

    checkZoomInButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.zoomInButton);
    }

    checkZoomOutButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.zoomOutButton);
    }

    checkScalePageButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.scalePageButton);
    }

    checkPageSelectorInputIsDisplayed(checkNumber) {
        Util.waitUntilElementIsVisible(this.pageSelectorInput);
        this.pageSelectorInput.getAttribute('value').then(function (pageNumber) {
            expect(pageNumber).toEqual(checkNumber);
        });
    }

    checkImgContainerIsDisplayed() {
        Util.waitUntilElementIsVisible(this.imgContainer);
    }

    checkPdfContainerIsDisplayed() {
        Util.waitUntilElementIsVisible(this.pdfContainer);
    }

    checkMediaPlayerContainerIsDisplayed() {
        Util.waitUntilElementIsVisible(this.mediaContainer);
    }

    checkFileContent(pageNumber, text) {
        let allPages = element.all(by.css('div[class="canvasWrapper"] > canvas')).first();
        let pageLoaded = element.all(by.css('div[data-page-number="' + pageNumber + '"][data-loaded="true"]')).first();
        let textLayerLoaded = element.all(by.css('div[data-page-number="' + pageNumber + '"] div[class="textLayer"] > div')).first();
        let specificText = element.all(by.cssContainingText('div[data-page-number="' + pageNumber + '"] div[class="textLayer"] > div', text)).first();

        Util.waitUntilElementIsVisible(allPages);
        Util.waitUntilElementIsVisible(pageLoaded);
        Util.waitUntilElementIsVisible(textLayerLoaded);
        Util.waitUntilElementIsVisible(specificText);
    }

    checkFullScreenButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.fullScreenButton);
    }

    checkFullScreenButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.fullScreenButton);
    }

    checkPercentageIsDisplayed() {
        Util.waitUntilElementIsVisible(this.percentage);
    }

    checkZoomedIn(zoom) {
        expect(this.percentage.getText()).toBeGreaterThan(zoom);
    }

    checkZoomedOut(zoom) {
        expect(this.percentage.getText()).toBeLessThan(zoom);
    }

    checkRotateLeftButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.rotateLeft);
    }

    checkRotateRightButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.rotateRight);
    }

    checkScaled(zoom) {
        expect(this.percentage.getText()).toEqual(zoom);
    }

    checkScaleImgButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.scaleImg);
    }

    checkRotation(text) {
        let rotation = this.imgContainer.getAttribute('style');
        expect(rotation).toEqual(text);
    }

    checkCustomBtnDisplayed() {
        Util.waitUntilElementIsVisible(this.customBtn);
    }

    checkUnsupportedFileContainerIsDisplayed() {
        Util.waitUntilElementIsVisible(this.unsupportedFileContainer);
    }

    checkInfoSideBarIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.infoSideBar);
    }

    checkInfoSideBarIsDisplayed() {
        Util.waitUntilElementIsVisible(this.infoSideBar);
    }

    checkInfoSideBarIsNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.infoSideBar);
    }

    checkLeftSideBarButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.leftSideBarButton);
    }

    checkLeftSideBarButtonIsDisplayed() {
        Util.waitUntilElementIsOnPage(this.leftSideBarButton);
    }

    clickInfoButton() {
        Util.waitUntilElementIsVisible(this.infoButton);
        return this.infoButton.click();
    }

    clickLeftSidebarButton() {
        Util.waitUntilElementIsVisible(this.leftSideBarButton);
        return this.leftSideBarButton.click();
    }

    checkLeftSideBarIsDisplayed() {
        Util.waitUntilElementIsVisible(this.leftSideBar);
    }

    checkLeftSideBarIsNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.leftSideBar);
    }

    clickPasswordSubmit() {
        Util.waitUntilElementIsVisible(this.passwordSubmit);
        return this.passwordSubmit.click();
    }

    clickSecondThumbnail() {
        Util.waitUntilElementIsClickable(this.secondThumbnail);
        return this.secondThumbnail.click();
    }

    clickLastThumbnailDisplayed() {
        Util.waitUntilElementIsClickable(this.lastThumbnailDisplayed);
        return this.lastThumbnailDisplayed.click();
    }

    clickThumbnailsClose() {
        Util.waitUntilElementIsClickable(this.thumbnailsClose);
        return this.thumbnailsClose.click();
    }

    clickThumbnailsBtn() {
        Util.waitUntilElementIsVisible(this.thumbnailsBtn);
        Util.waitUntilElementIsClickable(this.thumbnailsBtn);
        return this.thumbnailsBtn.click();
    }

    clickScaleImgButton() {
        Util.waitUntilElementIsClickable(this.scaleImg);
        return this.scaleImg.click();
    }

    clickScalePdfButton() {
        Util.waitUntilElementIsClickable(this.scalePageButton);
        return this.scalePageButton.click();
    }

    clickDownloadButton() {
        Util.waitUntilElementIsVisible(this.downloadButton);
        return this.downloadButton.click();
    }

    clickCloseButton() {
        Util.waitUntilElementIsVisible(this.closeButton);
        return this.closeButton.click();
    }

    clickPreviousPageButton() {
        Util.waitUntilElementIsVisible(this.previousPageButton);
        return this.previousPageButton.click();
    }

    clickNextPageButton() {
        Util.waitUntilElementIsVisible(this.nextPageButton);
        return this.nextPageButton.click();
    }

    clickZoomInButton() {
        Util.waitUntilElementIsVisible(this.zoomInButton);
        return this.zoomInButton.click();
    }

    clickZoomOutButton() {
        Util.waitUntilElementIsVisible(this.zoomOutButton);
        return this.zoomOutButton.click();
    }

    clickScalePageButton() {
        Util.waitUntilElementIsVisible(this.scalePageButton);
        this.scalePageButton.click();
    }

    clickFullScreenButton() {
        Util.waitUntilElementIsClickable(this.fullScreenButton);
        return this.fullScreenButton.click();
    }

    clickRotateLeftButton() {
        Util.waitUntilElementIsClickable(this.rotateLeft);
        return this.rotateLeft.click();
    }

    clickRotateRightButton() {
        Util.waitUntilElementIsClickable(this.rotateRight);
        return this.rotateRight.click();
    }

    getActiveTab() {
        Util.waitUntilElementIsVisible(this.activeTab);
        return this.activeTab.getText();
    }

    clickOnVersionsTab() {
        clickRightChevronToGetToTab('Versions');
        tabsPage.clickTabByTitle('Versions');
        return this;
    }

    checkUploadVersionsButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.uploadNewVersionButton);
        return this;
    }

    checkVersionIsDisplayed(version) {
        Util.waitUntilElementIsVisible(element(by.cssContainingText('h4[class*="adf-version-list-item-name"]', version)));
        return this;
    }

    clickOnCommentsTab() {
        this.tabsPage.clickTabByTitle('Comments');
        return this;
    }

    disableToolbar() {
        this.formControllersPage.disableToggle(this.toolbarSwitch);
    }

    enableToolbar() {
        this.formControllersPage.enableToggle(this.toolbarSwitch);
    }

    checkToolbarIsDisplayed() {
        Util.waitUntilElementIsVisible(this.toolbar);
        return this;
    }

    checkToolbarIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.toolbar);
        return this;
    }

    disableGoBack() {
        this.formControllersPage.disableToggle(this.goBackSwitch);
    }

    enableGoBack() {
        this.formControllersPage.enableToggle(this.goBackSwitch);
    }

    checkGoBackIsDisplayed() {
        Util.waitUntilElementIsVisible(this.closeButton);
        return this;
    }

    checkGoBackIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.closeButton);
        return this;
    }

    disableToolbarOptions() {
        this.formControllersPage.disableToggle(this.openWithSwitch);
    }

    enableToolbarOptions() {
        this.formControllersPage.enableToggle(this.openWithSwitch);
    }

    checkToolbarOptionsIsDisplayed() {
        Util.waitUntilElementIsVisible(this.openWith);
        return this;
    }

    checkToolbarOptionsIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.openWith);
        return this;
    }

    disableDownload() {
        this.formControllersPage.disableToggle(this.downloadSwitch);
    }

    enableDownload() {
        this.formControllersPage.enableToggle(this.openWithSwitch);
    }

    checkDownloadButtonDisplayed() {
        Util.waitUntilElementIsVisible(this.downloadButton);
        return this;
    }

    checkDownloadButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.downloadButton);
        return this;
    }

    disablePrint() {
        this.formControllersPage.disableToggle(this.printSwitch);
    }

    enablePrint() {
        this.formControllersPage.enableToggle(this.printSwitch);
    }

    checkPrintButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.printButton);
        return this;
    }

    checkPrintButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.printButton);
        return this;
    }

    disableShare() {
        this.formControllersPage.disableToggle(this.shareSwitch);
    }

    enableShare() {
        this.formControllersPage.enableToggle(this.shareSwitch);
    }

    disableAllowSidebar() {
        this.formControllersPage.disableToggle(this.allowSidebarSwitch);
    }

    enableAllowSidebar() {
        this.formControllersPage.enableToggle(this.allowSidebarSwitch);
    }

    disableAllowLeftSidebar() {
        this.formControllersPage.disableToggle(this.allowLeftSidebarSwitch);
    }

    enableAllowLeftSidebar() {
        this.formControllersPage.enableToggle(this.allowLeftSidebarSwitch);
    }

    checkShareButtonDisplayed() {
        Util.waitUntilElementIsVisible(this.shareButton);
        return this;
    }

    checkShareButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.shareButton);
        return this;
    }

    checkMoreActionsDisplayed() {
        Util.waitUntilElementIsVisible(this.bugButton);
        Util.waitUntilElementIsVisible(this.timeButton);
        Util.waitUntilElementIsVisible(this.uploadButton);
        return this;
    }

    checkMoreActionsIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.bugButton);
        Util.waitUntilElementIsNotVisible(this.timeButton);
        Util.waitUntilElementIsNotVisible(this.uploadButton);
        return this;
    }

    disableMoreActions() {
        this.formControllersPage.disableToggle(this.moreActionsSwitch);
    }

    enableMoreActions() {
        this.formControllersPage.enableToggle(this.moreActionsSwitch);
    }

    disableCustomName() {
        this.formControllersPage.disableToggle(this.customNameSwitch);
    }

    enableCustomName() {
        this.formControllersPage.enableToggle(this.customNameSwitch);
    }

    clickToggleRightSidebar() {
        Util.waitUntilElementIsVisible(this.showRightSidebarSwitch);
        this.showRightSidebarSwitch.click();
    }

    clickToggleLeftSidebar() {
        Util.waitUntilElementIsVisible(this.showLeftSidebarSwitch);
        this.showLeftSidebarSwitch.click();
    }

    enterCustomName(text) {
        const textField = element(by.css('input[data-automation-id="adf-text-custom-name"]'));
        Util.waitUntilElementIsVisible(textField);
        textField.sendKeys('');
        textField.clear().sendKeys(text);
        return this;
    }
}
