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

import { BrowserActions } from '../utils/browser-actions';
import { TabsPage } from './material/tabs.page';
import { TogglePage } from './material/toggle.page';
import { BrowserVisibility } from '../utils/browser-visibility';
import { element, by, browser, protractor } from 'protractor';
import { Logger } from '../utils/logger';

export class ViewerPage {

    tabsPage = new TabsPage();
    togglePage = new TogglePage();

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
    mediaContainer = element(by.css('.adf-media-player'));
    percentage = element(by.css('div[data-automation-id="adf-page-scale"'));
    thumbnailsBtn = element(by.css('button[data-automation-id="adf-thumbnails-button"]'));
    thumbnailsContent = element(by.css('div[data-automation-id="adf-thumbnails-content"]'));
    thumbnailsClose = element(by.css('button[data-automation-id="adf-thumbnails-close"]'));
    secondThumbnail = element(by.css('adf-pdf-thumb > img[title="Page 2"'));
    lastThumbnailDisplayed = element.all(by.css('adf-pdf-thumb')).last();
    passwordDialog = element(by.css('adf-pdf-viewer-password-dialog'));
    passwordSubmit = element(by.css('button[data-automation-id="adf-password-dialog-submit"]'));
    passwordDialogClose = element(by.css('button[data-automation-id="adf-password-dialog-close"]'));
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
    canvasLayer = element.all(by.css('.canvasWrapper > canvas')).first();

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

    showTabWithIconSwitch = element(by.id('adf-tab-with-icon'));
    showTabWithIconAndLabelSwitch = element(by.id('adf-icon-and-label-tab'));
    unknownFormat = element(by.css(`adf-viewer-unknown-format .adf-viewer__unknown-format-view`));

    async checkCodeViewerIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.codeViewer);
    }

    async viewFile(fileName: string): Promise<void> {
        const fileView = element.all(by.css(`#document-list-container div[data-automation-id="${fileName}"]`)).first();
        await BrowserActions.click(fileView);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
        await this.waitTillContentLoaded();
    }

    async waitTillContentLoaded(): Promise<void> {
        await browser.sleep(500);

        if (this.isSpinnerPresent()) {
            Logger.log('wait spinner disappear');
            await BrowserVisibility.waitUntilElementIsNotPresent(element(by.tagName('mat-progress-spinner')));
        } else {
            try {
                Logger.log('wait spinner is present');
                await BrowserVisibility.waitUntilElementIsPresent(element(by.tagName('mat-progress-spinner')));
            } catch (error) {
            }
        }
    }

    private async isSpinnerPresent(): Promise<boolean> {
        let isSpinnerPresent;

        try {
            isSpinnerPresent = await element(by.tagName('mat-progress-spinner')).isDisplayed();
        } catch (error) {
            isSpinnerPresent = false;
        }

        return isSpinnerPresent;
    }

    async clearPageNumber(): Promise<void> {
        await BrowserActions.clearSendKeys(this.pageSelectorInput);
    }

    async getZoom(): Promise<string> {
        return BrowserActions.getText(this.percentage);
    }

    async getCanvasWidth(): Promise<string> {
        return this.canvasLayer.getAttribute(`width`);
    }

    async getCanvasHeight(): Promise<string> {
        return this.canvasLayer.getAttribute(`height`);
    }

    async getDisplayedFileName(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.fileName);
        return BrowserActions.getText(this.fileName);
    }

    async exitFullScreen(): Promise<void> {
        const jsCode = 'document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen&&document.webkitExitFullscreen();';
        await browser.executeScript(jsCode);
    }

    async enterPassword(password: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.passwordInput, password);
    }

    async checkFileIsLoaded(fileName?: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.pdfPageLoaded, 60000, `${fileName} not loaded`);
    }

    async clickClosePasswordDialog(): Promise<void> {
        await BrowserActions.click(this.passwordDialogClose);
    }

    async checkImgViewerIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.imgViewer);
    }

    async checkPasswordErrorIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.passwordError);
    }

    async checkPasswordInputIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.passwordInput);
    }

    async checkPasswordSubmitDisabledIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.passwordSubmitDisabled);
    }

    async checkPasswordDialogIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.passwordDialog);
    }

    async checkAllThumbnailsDisplayed(nbPages): Promise<void> {
        const defaultThumbnailHeight = 143;
        await expect(await this.thumbnailsContent.getAttribute('style')).toEqual('height: ' + nbPages * defaultThumbnailHeight + 'px; transform: translate(-50%, 0px);');
    }

    async checkCurrentThumbnailIsSelected(): Promise<void> {
        const selectedThumbnail = element(by.css('adf-pdf-thumb.adf-pdf-thumbnails__thumb.adf-pdf-thumbnails__thumb--selected > img'));
        const pageNumber = await this.pageSelectorInput.getAttribute('value');

        await expect('Page ' + pageNumber).toEqual(await selectedThumbnail.getAttribute('title'));
    }

    async checkThumbnailsCloseIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.thumbnailsClose);
    }

    async checkThumbnailsBtnIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.thumbnailsBtn);
    }

    async checkThumbnailsBtnIsDisabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css('button[data-automation-id="adf-thumbnails-button"]:disabled')));
    }

    async checkThumbnailsContentIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.thumbnailsContent);
    }

    async checkThumbnailsContentIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.thumbnailsContent);
    }

    async checkCloseButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.closeButton);
    }

    async getLastButtonTitle(): Promise<string> {
        return this.lastButton.getAttribute('title');
    }

    async getMoreActionsMenuTitle(): Promise<string> {
        return this.moreActionsMenu.getAttribute('title');
    }

    async checkDownloadButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.downloadButton);
    }

    async checkInfoButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.infoButton);
    }

    async checkInfoButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.infoButton);
    }

    async checkFileThumbnailIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.fileThumbnail);
    }

    async checkFileNameIsDisplayed(filename: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.fileName);
        await BrowserVisibility.waitUntilElementHasText(this.fileName, filename);
    }

    async checkPreviousPageButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.previousPageButton);
    }

    async checkNextPageButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.nextPageButton);
    }

    async checkZoomInButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.zoomInButton);
    }

    async checkZoomInButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.zoomInButton);
    }

    async checkZoomOutButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.zoomOutButton);
    }

    async checkScalePageButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.scalePageButton);
    }

    async checkPageSelectorInputIsDisplayed(checkNumber): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.pageSelectorInput);
        await expect(await this.pageSelectorInput.getAttribute('value')).toEqual(checkNumber);
    }

    async checkImgContainerIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.imgContainer);
    }

    async checkMediaPlayerContainerIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.mediaContainer);
    }

    async checkFileContent(pageNumber: string, text: string): Promise<void> {
        const allPages = this.canvasLayer;
        const pageLoaded = element.all(by.css('div[data-page-number="' + pageNumber + '"][data-loaded="true"]')).first();
        const textLayerLoaded = element.all(by.css('div[data-page-number="' + pageNumber + '"] .textLayer')).first();
        const specificText = element.all(by.cssContainingText('div[data-page-number="' + pageNumber + '"] .textLayer', text)).first();

        await BrowserVisibility.waitUntilElementIsVisible(allPages);
        await BrowserVisibility.waitUntilElementIsVisible(pageLoaded);
        await BrowserVisibility.waitUntilElementIsVisible(textLayerLoaded);
        await BrowserVisibility.waitUntilElementIsVisible(specificText);
    }

    async checkFullScreenButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.fullScreenButton);
    }

    async checkFullScreenButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.fullScreenButton);
    }

    async checkPercentageIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.percentage);
    }

    async checkZoomedIn(zoom): Promise<void> {
        await expect(await BrowserActions.getText(this.percentage)).toBeGreaterThan(zoom);
    }

    async checkZoomedOut(zoom): Promise<void> {
        await expect(await BrowserActions.getText(this.percentage)).toBeLessThan(zoom);
    }

    async checkRotateLeftButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rotateLeft);
    }

    async checkRotateRightButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rotateRight);
    }

    async checkScaleImgButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.scaleImg);
    }

    async checkRotation(text): Promise<void> {
        const rotation = await this.imgContainer.getAttribute('style');
        await expect(rotation).toEqual(text);
    }

    async checkInfoSideBarIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.infoSideBar);
    }

    async checkInfoSideBarIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.infoSideBar);
    }

    async checkLeftSideBarButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.leftSideBarButton);
    }

    async checkLeftSideBarButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.leftSideBarButton);
    }

    async clickInfoButton(): Promise<void> {
        await BrowserActions.click(element(by.css('button[data-automation-id="adf-toolbar-sidebar"]')));
    }

    async clickOnTab(tabName: string): Promise<void> {
        await this.tabsPage.clickTabByTitle(tabName);
    }

    async checkTabIsActive(tabName: string): Promise<void> {
        const tab = element(by.cssContainingText('.adf-info-drawer-layout-content div.mat-tab-labels div.mat-tab-label-active .mat-tab-label-content', tabName));
        await BrowserVisibility.waitUntilElementIsVisible(tab);
    }

    async clickLeftSidebarButton(): Promise<void> {
        await BrowserActions.click(this.leftSideBarButton);
    }

    async checkLeftSideBarIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.leftSideBar);
    }

    async checkLeftSideBarIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.leftSideBar);
    }

    async clickPasswordSubmit(): Promise<void> {
        await BrowserActions.click(this.passwordSubmit);
    }

    async clickSecondThumbnail(): Promise<void> {
        await BrowserActions.click(this.secondThumbnail);
    }

    async clickLastThumbnailDisplayed(): Promise<void> {
        await BrowserActions.click(this.lastThumbnailDisplayed);
    }

    async clickThumbnailsClose(): Promise<void> {
        await BrowserActions.click(this.thumbnailsClose);
    }

    async clickThumbnailsBtn(): Promise<void> {
        await BrowserActions.click(this.thumbnailsBtn);
    }

    async clickScaleImgButton(): Promise<void> {
        await BrowserActions.click(this.scaleImg);
    }

    async clickDownloadButton(): Promise<void> {
        await BrowserActions.click(this.downloadButton);
    }

    async clickCloseButton(): Promise<void> {
        await BrowserActions.click(this.closeButton);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.viewer);
    }

    async clickPreviousPageButton(): Promise<void> {
        await BrowserActions.click(this.previousPageButton);
    }

    async clickNextPageButton(): Promise<void> {
        await BrowserActions.click(this.nextPageButton);
    }

    async clickZoomInButton(): Promise<void> {
        await BrowserActions.click(this.zoomInButton);
    }

    async clickZoomOutButton(): Promise<void> {
        await BrowserActions.click(this.zoomOutButton);
    }

    async clickActualSize(): Promise<void> {
        await BrowserActions.click(this.scalePageButton);
    }

    async clickFullScreenButton(): Promise<void> {
        await BrowserActions.click(this.fullScreenButton);
    }

    async clickRotateLeftButton(): Promise<void> {
        await BrowserActions.click(this.rotateLeft);
    }

    async clickRotateRightButton(): Promise<void> {
        await BrowserActions.click(this.rotateRight);
    }

    async getActiveTab(): Promise<string> {
        return BrowserActions.getText(this.activeTab);
    }

    async clickOnCommentsTab(): Promise<void> {
        await this.tabsPage.clickTabByTitle('Comments');
    }

    async disableToolbar(): Promise<void> {
        await this.togglePage.disableToggle(this.toolbarSwitch);
    }

    async enableToolbar(): Promise<void> {
        await this.togglePage.enableToggle(this.toolbarSwitch);
    }

    async checkToolbarIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.toolbar);
    }

    async checkToolbarIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.toolbar);
    }

    async disableGoBack(): Promise<void> {
        await this.togglePage.disableToggle(this.goBackSwitch);
    }

    async enableGoBack(): Promise<void> {
        await this.togglePage.enableToggle(this.goBackSwitch);
    }

    async checkGoBackIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.closeButton);
    }

    async checkGoBackIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.closeButton);
    }

    async disableToolbarOptions(): Promise<void> {
        await this.togglePage.disableToggle(this.openWithSwitch);
    }

    async enableToolbarOptions() {
        await this.togglePage.enableToggle(this.openWithSwitch);
    }

    async checkToolbarOptionsIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.openWith);
    }

    async checkToolbarOptionsIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.openWith);
    }

    async disableDownload(): Promise<void> {
        await this.togglePage.disableToggle(this.downloadSwitch);
    }

    async enableDownload(): Promise<void> {
        await this.togglePage.enableToggle(this.openWithSwitch);
    }

    async enableShowTabWithIcon(): Promise<void> {
        await browser.executeScript('arguments[0].scrollIntoView()', this.showTabWithIconSwitch);
        await this.togglePage.enableToggle(this.showTabWithIconSwitch);
    }

    async enableShowTabWithIconAndLabel(): Promise<void> {
        await this.togglePage.enableToggle(this.showTabWithIconAndLabelSwitch);
    }

    async checkDownloadButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.downloadButton);
    }

    async disablePrint(): Promise<void> {
        await this.togglePage.disableToggle(this.printSwitch);
    }

    async enablePrint(): Promise<void> {
        await this.togglePage.enableToggle(this.printSwitch);
    }

    async checkPrintButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.printButton);
    }

    async checkPrintButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.printButton);
    }

    async disableAllowSidebar(): Promise<void> {
        await this.togglePage.disableToggle(this.allowSidebarSwitch);
    }

    async disableAllowLeftSidebar(): Promise<void> {
        await browser.executeScript('arguments[0].scrollIntoView()', this.allowLeftSidebarSwitch);
        await this.togglePage.disableToggle(this.allowLeftSidebarSwitch);
    }

    async checkMoreActionsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.bugButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.timeButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.uploadButton);
    }

    async checkMoreActionsIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.bugButton);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.timeButton);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.uploadButton);
    }

    async checkPreviewFileDefaultOptionsAreDisplayed(): Promise<void> {
        await this.checkToolbarIsDisplayed();
        await this.checkMoreActionsDisplayed();
        await this.checkPrintButtonIsDisplayed();
        await this.checkDownloadButtonIsDisplayed();
        await this.checkFullScreenButtonIsDisplayed();
        await this.checkLeftSideBarButtonIsDisplayed();
        await this.checkInfoButtonIsDisplayed();
    }

    async disableMoreActions(): Promise<void> {
        await this.togglePage.disableToggle(this.moreActionsSwitch);
    }

    async enableMoreActions(): Promise<void> {
        await this.togglePage.enableToggle(this.moreActionsSwitch);
    }

    async enableMoreActionsMenu(): Promise<void> {
        await this.togglePage.enableToggle(this.moreActionsMenuSwitch);
    }

    async disableCustomToolbar(): Promise<void> {
        await browser.executeScript('arguments[0].scrollIntoView()', this.customToolbarToggle);
        await this.togglePage.disableToggle(this.customToolbarToggle);
    }

    async enableCustomToolbar(): Promise<void> {
        await browser.executeScript('arguments[0].scrollIntoView()', this.customToolbarToggle);
        await this.togglePage.enableToggle(this.customToolbarToggle);
    }

    async checkCustomToolbarIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.customToolbar);
    }

    async disableCustomName(): Promise<void> {
        await this.togglePage.disableToggle(this.customNameSwitch);
    }

    async enableCustomName(): Promise<void> {
        await this.togglePage.enableToggle(this.customNameSwitch);
    }

    async clickToggleRightSidebar(): Promise<void> {
        await BrowserActions.click(this.showRightSidebarSwitch);
    }

    async clickToggleLeftSidebar(): Promise<void> {
        await BrowserActions.click(this.showLeftSidebarSwitch);
    }

    async enterCustomName(text: string): Promise<void> {
        const textField = element(by.css('input[data-automation-id="adf-text-custom-name"]'));
        await BrowserActions.clearSendKeys(textField, text);
    }

    async disableOverlay(): Promise<void> {
        await this.togglePage.disableToggle(element(by.id('adf-viewer-overlay')));
    }

    async checkOverlayViewerIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.viewer.element(by.css('div[class*="adf-viewer-overlay-container"]')));
    }

    async checkInlineViewerIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.viewer.element(by.css('div[class*="adf-viewer-inline-container"]')));
    }

    async checkTabHasNoIcon(index: number): Promise<void> {
        const tab = element(by.css(`div[id="mat-tab-label-1-${index}"] .mat-tab-label-content mat-icon`));
        await BrowserVisibility.waitUntilElementIsNotVisible(tab);
    }

    async checkTabHasNoLabel(index: number): Promise<void> {
        const tab = element(by.css(`div[id="mat-tab-label-1-${index}"] .mat-tab-label-content span`));
        await BrowserVisibility.waitUntilElementIsNotVisible(tab);
    }

    async getTabLabelById(index: number): Promise<string> {
        const tab = element(by.css(`div[id="mat-tab-label-1-${index}"] .mat-tab-label-content span`));
        return BrowserActions.getText(tab);
    }

    async getTabIconById(index: number): Promise<string> {
        const tab = element(by.css(`div[id="mat-tab-label-1-${index}"] .mat-tab-label-content mat-icon`));
        return BrowserActions.getText(tab);
    }

    async checkUnknownFormatIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.unknownFormat);
    }

    async getUnknownFormatMessage(): Promise<string> {
        const unknownFormatLabel = this.unknownFormat.element(by.css(`.adf-viewer__unknown-label`));
        return BrowserActions.getText(unknownFormatLabel);
    }

    async expectUrlToContain(text: string): Promise<void> {
        await expect(browser.getCurrentUrl()).toContain(text);
    }
}
