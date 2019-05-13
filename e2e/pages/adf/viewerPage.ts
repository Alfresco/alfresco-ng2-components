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

import { TabsPage } from '@alfresco/adf-testing';
import { FormControllersPage } from '@alfresco/adf-testing';
import { element, by, browser, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

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
    fullScreenButton = element(by.css('button[data-automation-id="adf-toolbar-fullscreen"]'));
    rotateLeft = element(by.css('button[id="viewer-rotate-left-button"]'));
    rotateRight = element(by.css('button[id="viewer-rotate-right-button"]'));
    scaleImg = element(by.css('button[id="viewer-reset-button"]'));
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
    viewer = element(by.css('adf-viewer'));
    pdfViewer = element(by.css('adf-pdf-viewer'));
    imgViewer = element(by.css('adf-img-viewer'));
    activeTab = element(by.css('div[class*="mat-tab-label-active"]'));
    toolbarSwitch = element(by.id('adf-switch-toolbar'));
    toolbar = element(by.id('adf-viewer-toolbar'));
    lastButton = element.all(by.css('#adf-viewer-toolbar mat-toolbar > button[data-automation-id*="adf-toolbar-"]')).last();
    goBackSwitch = element(by.id('adf-switch-goback'));

    openWithSwitch = element(by.id('adf-switch-openwith'));
    openWith = element(by.id('adf-viewer-openwith'));

    moreActionsMenuSwitch = element(by.id('adf-switch-moreactionsmenu'));
    moreActionsMenu = element(by.css('button[data-automation-id="adf-toolbar-more-actions"]'));

    customNameSwitch = element(by.id('adf-switch-custoname'));
    customToolbarToggle = element(by.id('adf-toggle-custom-toolbar'));
    customToolbar = element(by.css('adf-viewer-toolbar[data-automation-id="adf-viewer-custom-toolbar"]'));

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

    uploadButton = element(by.id('adf-viewer-upload'));
    timeButton = element(by.id('adf-viewer-time'));
    bugButton = element(by.id('adf-viewer-bug'));

    codeViewer = element(by.id('adf-monaco-file-editor'));
    moveRightChevron = element(by.css('.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron'));

    showTabWithIconSwitch = element(by.id('adf-tab-with-icon'));
    showTabWithIconAndLabelSwitch = element(by.id('adf-icon-and-label-tab'));

    checkCodeViewerIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.codeViewer);
    }

    viewFile(fileName) {
        BrowserActions.closeMenuAndDialogs();
        const fileView = element.all(by.css(`#document-list-container div[data-automation-id="${fileName}"]`)).first();
        BrowserActions.click(fileView);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    clearPageNumber() {
        BrowserVisibility.waitUntilElementIsVisible(this.pageSelectorInput);
        this.pageSelectorInput.clear();
        this.pageSelectorInput.sendKeys(protractor.Key.ENTER);
    }

    getZoom() {
        return BrowserActions.getText(this.percentage);
    }

    exitFullScreen() {
        const jsCode = 'document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen&&document.webkitExitFullscreen();';
        browser.executeScript(jsCode);
    }

    enterPassword(password) {
        BrowserVisibility.waitUntilElementIsVisible(this.passwordInput);
        this.passwordInput.clear();
        this.passwordInput.sendKeys(password);
    }

    checkFileIsLoaded(fileName?: string) {
        BrowserVisibility.waitUntilElementIsVisible(this.pdfPageLoaded, 30000, `not loaded ${fileName}`);
    }

    checkImgViewerIsDisplayed() {
        BrowserVisibility.waitUntilElementIsOnPage(this.imgViewer);
    }

    checkPasswordErrorIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.passwordError);
    }

    checkPasswordInputIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.passwordInput);
    }

    checkPasswordSubmitDisabledIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.passwordSubmitDisabled);
    }

    checkPasswordDialogIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.passwordDialog);
    }

    checkAllThumbnailsDisplayed(nbPages) {
        const defaultThumbnailHeight = 143;
        expect(this.thumbnailsContent.getAttribute('style')).toEqual('height: ' + nbPages * defaultThumbnailHeight + 'px; transform: translate(-50%, 0px);');
    }

    checkCurrentThumbnailIsSelected() {
        const selectedThumbnail = element(by.css('adf-pdf-thumb[class="adf-pdf-thumbnails__thumb ng-star-inserted adf-pdf-thumbnails__thumb--selected"] > img'));
        this.pageSelectorInput.getAttribute('value').then((pageNumber) => {
            browser.controlFlow().execute(async () => {
                expect('Page ' + pageNumber).toEqual(await selectedThumbnail.getAttribute('title'));
            });
        });
    }

    checkThumbnailsCloseIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.thumbnailsClose);
    }

    checkThumbnailsBtnIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.thumbnailsBtn);
    }

    checkThumbnailsBtnIsDisabled() {
        BrowserVisibility.waitUntilElementIsVisible(element(by.css('button[data-automation-id="adf-thumbnails-button"]:disabled')));
        return this;
    }

    checkThumbnailsContentIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.thumbnailsContent);
    }

    checkThumbnailsContentIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.thumbnailsContent);
    }

    checkCloseButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.closeButton);
    }

    getLastButtonTitle() {
        return this.lastButton.getAttribute('title');
    }

    getMoreActionsMenuTitle() {
        return this.moreActionsMenu.getAttribute('title');
    }

    checkDownloadButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.downloadButton);
    }

    checkInfoButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.infoButton);
    }

    checkInfoButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.infoButton);
    }

    checkFileThumbnailIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.fileThumbnail);
    }

    checkFileNameIsDisplayed(file) {
        BrowserVisibility.waitUntilElementIsVisible(this.fileName);
        expect(this.fileName.getText()).toEqual(file);
    }

    checkPreviousPageButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.previousPageButton);
    }

    checkNextPageButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.nextPageButton);
    }

    checkZoomInButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.zoomInButton);
    }

    checkZoomInButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.zoomInButton);
    }

    checkZoomOutButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.zoomOutButton);
    }

    checkScalePageButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.scalePageButton);
    }

    checkPageSelectorInputIsDisplayed(checkNumber) {
        BrowserVisibility.waitUntilElementIsVisible(this.pageSelectorInput);
        this.pageSelectorInput.getAttribute('value').then((pageNumber) => {
            expect(pageNumber).toEqual(checkNumber);
        });
    }

    checkImgContainerIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.imgContainer);
    }

    checkMediaPlayerContainerIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.mediaContainer);
    }

    async checkFileContent(pageNumber, text) {
        const allPages = element.all(by.css('div[class="canvasWrapper"] > canvas')).first();
        const pageLoaded = element.all(by.css('div[data-page-number="' + pageNumber + '"][data-loaded="true"]')).first();
        const textLayerLoaded = element.all(by.css('div[data-page-number="' + pageNumber + '"] div[class="textLayer"]')).first();
        const specificText = element.all(by.cssContainingText('div[data-page-number="' + pageNumber + '"] div[class="textLayer"]', text)).first();

        BrowserVisibility.waitUntilElementIsVisible(allPages);
        BrowserVisibility.waitUntilElementIsVisible(pageLoaded);
        BrowserVisibility.waitUntilElementIsVisible(textLayerLoaded);
        BrowserVisibility.waitUntilElementIsVisible(specificText);
    }

    checkFullScreenButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.fullScreenButton);
    }

    checkFullScreenButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.fullScreenButton);
    }

    checkPercentageIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.percentage);
    }

    checkZoomedIn(zoom) {
        expect(this.percentage.getText()).toBeGreaterThan(zoom);
    }

    checkZoomedOut(zoom) {
        expect(this.percentage.getText()).toBeLessThan(zoom);
    }

    checkRotateLeftButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.rotateLeft);
    }

    checkRotateRightButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.rotateRight);
    }

    checkScaleImgButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.scaleImg);
    }

    checkRotation(text) {
        const rotation = this.imgContainer.getAttribute('style');
        expect(rotation).toEqual(text);
    }

    checkInfoSideBarIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.infoSideBar);
    }

    checkInfoSideBarIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.infoSideBar);
    }

    checkLeftSideBarButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.leftSideBarButton);
    }

    checkLeftSideBarButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsOnPage(this.leftSideBarButton);
    }

    clickInfoButton() {
        BrowserActions.clickExecuteScript('button[data-automation-id="adf-toolbar-sidebar"]');
    }

    clickOnTab(tabName) {
        this.tabsPage.clickTabByTitle(tabName);
        return this;
    }

    checkTabIsActive(tabName) {
        const tab = element(by.cssContainingText('.adf-info-drawer-layout-content div.mat-tab-labels div.mat-tab-label-active .mat-tab-label-content', tabName));
        BrowserVisibility.waitUntilElementIsVisible(tab);
        return this;
    }

    clickLeftSidebarButton() {
        BrowserActions.click(this.leftSideBarButton);
    }

    checkLeftSideBarIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.leftSideBar);
    }

    checkLeftSideBarIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.leftSideBar);
    }

    clickPasswordSubmit() {
        BrowserActions.click(this.passwordSubmit);
    }

    clickSecondThumbnail() {
        BrowserActions.click(this.secondThumbnail);
    }

    clickLastThumbnailDisplayed() {
        BrowserActions.click(this.lastThumbnailDisplayed);
    }

    clickThumbnailsClose() {
        BrowserActions.click(this.thumbnailsClose);
    }

    clickThumbnailsBtn() {
        BrowserActions.click(this.thumbnailsBtn);
    }

    clickScaleImgButton() {
        BrowserActions.click(this.scaleImg);
    }

    clickDownloadButton() {
        BrowserActions.click(this.downloadButton);
    }

    clickCloseButton() {
        BrowserActions.clickExecuteScript('button[data-automation-id="adf-toolbar-back"]');
    }

    clickPreviousPageButton() {
        BrowserActions.click(this.previousPageButton);
    }

    clickNextPageButton() {
        BrowserActions.click(this.nextPageButton);
    }

    clickZoomInButton() {
        BrowserActions.click(this.zoomInButton);
    }

    clickZoomOutButton() {
        BrowserActions.click(this.zoomOutButton);
    }

    clickFullScreenButton() {
        BrowserActions.click(this.fullScreenButton);
    }

    clickRotateLeftButton() {
        BrowserActions.click(this.rotateLeft);
    }

    clickRotateRightButton() {
        BrowserActions.click(this.rotateRight);
    }

    getActiveTab() {
        return BrowserActions.getText(this.activeTab);
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
        BrowserVisibility.waitUntilElementIsVisible(this.toolbar);
        return this;
    }

    checkToolbarIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.toolbar);
        return this;
    }

    disableGoBack() {
        this.formControllersPage.disableToggle(this.goBackSwitch);
    }

    enableGoBack() {
        this.formControllersPage.enableToggle(this.goBackSwitch);
    }

    checkGoBackIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.closeButton);
        return this;
    }

    checkGoBackIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.closeButton);
        return this;
    }

    disableToolbarOptions() {
        this.formControllersPage.disableToggle(this.openWithSwitch);
    }

    enableToolbarOptions() {
        this.formControllersPage.enableToggle(this.openWithSwitch);
    }

    checkToolbarOptionsIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.openWith);
        return this;
    }

    checkToolbarOptionsIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.openWith);
        return this;
    }

    disableDownload() {
        this.formControllersPage.disableToggle(this.downloadSwitch);
    }

    enableDownload() {
        this.formControllersPage.enableToggle(this.openWithSwitch);
    }

    disableShowTabWithIcon() {
        this.formControllersPage.disableToggle(this.showTabWithIconSwitch);
    }

    enableShowTabWithIcon() {
        this.formControllersPage.enableToggle(this.showTabWithIconSwitch);
    }

    disableShowTabWithIconAndLabel() {
        this.formControllersPage.disableToggle(this.showTabWithIconAndLabelSwitch);
    }

    enableShowTabWithIconAndLabel() {
        this.formControllersPage.enableToggle(this.showTabWithIconAndLabelSwitch);
    }

    checkDownloadButtonDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.downloadButton);
        return this;
    }

    checkDownloadButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.downloadButton);
        return this;
    }

    disablePrint() {
        this.formControllersPage.disableToggle(this.printSwitch);
    }

    enablePrint() {
        this.formControllersPage.enableToggle(this.printSwitch);
    }

    checkPrintButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.printButton);
        return this;
    }

    checkPrintButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.printButton);
        return this;
    }

    disableAllowSidebar() {
        this.formControllersPage.disableToggle(this.allowSidebarSwitch);
    }

    disableAllowLeftSidebar() {
        this.formControllersPage.disableToggle(this.allowLeftSidebarSwitch);
    }

    checkMoreActionsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.bugButton);
        BrowserVisibility.waitUntilElementIsVisible(this.timeButton);
        BrowserVisibility.waitUntilElementIsVisible(this.uploadButton);
        return this;
    }

    checkMoreActionsIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.bugButton);
        BrowserVisibility.waitUntilElementIsNotVisible(this.timeButton);
        BrowserVisibility.waitUntilElementIsNotVisible(this.uploadButton);
        return this;
    }

    disableMoreActions() {
        this.formControllersPage.disableToggle(this.moreActionsSwitch);
    }

    enableMoreActions() {
        this.formControllersPage.enableToggle(this.moreActionsSwitch);
    }

    enableMoreActionsMenu() {
        this.formControllersPage.enableToggle(this.moreActionsMenuSwitch);
    }

    disableCustomToolbar() {
        this.formControllersPage.disableToggle(this.customToolbarToggle);
        return this;
    }

    enableCustomToolbar() {
        this.formControllersPage.enableToggle(this.customToolbarToggle);
        return this;
    }

    checkCustomToolbarIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.customToolbar);
        return this;
    }

    disableCustomName() {
        this.formControllersPage.disableToggle(this.customNameSwitch);
    }

    enableCustomName() {
        this.formControllersPage.enableToggle(this.customNameSwitch);
    }

    clickToggleRightSidebar() {
        BrowserActions.click(this.showRightSidebarSwitch);
    }

    clickToggleLeftSidebar() {
        BrowserActions.click(this.showLeftSidebarSwitch);
    }

    enterCustomName(text) {
        const textField = element(by.css('input[data-automation-id="adf-text-custom-name"]'));
        BrowserVisibility.waitUntilElementIsVisible(textField);
        textField.sendKeys('');
        textField.clear();
        textField.sendKeys(text);
        return this;
    }

    disableOverlay() {
        this.formControllersPage.disableToggle(element(by.id('adf-viewer-overlay')));
        return this;
    }

    checkOverlayViewerIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.viewer.element(by.css('div[class*="adf-viewer-overlay-container"]')));
        return this;
    }

    checkInlineViewerIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.viewer.element(by.css('div[class*="adf-viewer-inline-container"]')));
        return this;
    }

    checkTabHasNoIcon(index: number) {
        const tab = element(by.css(`div[id="mat-tab-label-1-${index}"] div[class="mat-tab-label-content"] mat-icon`));
        BrowserVisibility.waitUntilElementIsNotVisible(tab);
        return this;
    }

    checkTabHasNoLabel(index: number) {
        const tab = element(by.css(`div[id="mat-tab-label-1-${index}"] div[class="mat-tab-label-content"] span`));
        BrowserVisibility.waitUntilElementIsNotVisible(tab);
        return this;
    }

    getTabLabelById(index: number) {
        const tab = element(by.css(`div[id="mat-tab-label-1-${index}"] div[class="mat-tab-label-content"] span`));
        return BrowserActions.getText(tab);
    }

    getTabIconById(index: number) {
        const tab = element(by.css(`div[id="mat-tab-label-1-${index}"] div[class="mat-tab-label-content"] mat-icon`));
        return BrowserActions.getText(tab);
    }
}
