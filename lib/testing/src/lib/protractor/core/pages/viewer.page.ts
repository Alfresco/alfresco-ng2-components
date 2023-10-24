/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { BrowserVisibility } from '../utils/browser-visibility';
import { element, by, browser, protractor, $, $$ } from 'protractor';
import { Logger } from '../utils/logger';

const MAX_LOADING_TIME = 120000;

export class ViewerPage {
    tabsPage = new TabsPage();
    closeButton = $('button[data-automation-id="adf-toolbar-back"]');
    fileName = $('#adf-viewer-display-name');
    infoButton = $('button[data-automation-id="adf-toolbar-sidebar"]');
    previousPageButton = $('#viewer-previous-page-button');
    nextPageButton = $('#viewer-next-page-button');
    zoomInButton = $('#viewer-zoom-in-button');
    zoomOutButton = $('#viewer-zoom-out-button');
    scalePageButton = $('#viewer-scale-page-button');
    fullScreenButton = $('button[data-automation-id="adf-toolbar-fullscreen"]');
    scaleImg = $('button[id="viewer-reset-button"]');
    fileThumbnail = $('img[data-automation-id="adf-file-thumbnail"]');
    pageSelectorInput = $('input[data-automation-id="adf-page-selector"]');
    imgContainer = $('div[data-automation-id="adf-image-container"]');
    mediaContainer = $('.adf-media-player');
    percentage = $('div[data-automation-id="adf-page-scale"]');
    thumbnailsBtn = $('button[data-automation-id="adf-thumbnails-button"]');
    thumbnailsContent = $('div[data-automation-id="adf-thumbnails-content"]');
    thumbnailsClose = $('button[data-automation-id="adf-thumbnails-close"]');
    secondThumbnail = $('adf-pdf-thumb > img[title="Page 2"]');
    lastThumbnailDisplayed = $$('adf-pdf-thumb').last();
    infoSideBar = $('#adf-right-sidebar');
    viewer = $('adf-viewer');
    imgViewer = $('adf-img-viewer');
    activeTab = $('div[class*="mat-tab-label-active"]');
    toolbar = $('#adf-viewer-toolbar');
    canvasLayer = $$('.canvasWrapper > canvas').first();

    pdfPageLoaded = $('[data-page-number="1"][data-loaded="true"], adf-img-viewer, adf-txt-viewer');
    downloadButton = $('#adf-alfresco-viewer-download');
    unknownFormat = $(`adf-viewer-unknown-format .adf-viewer__unknown-format-view`);

    async viewFile(fileName: string): Promise<void> {
        const fileView = $$(`#document-list-container div[data-automation-id="${fileName}"]`).first();
        await BrowserActions.click(fileView);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
        await this.waitTillContentLoaded();
    }

    async waitTillContentLoaded(): Promise<void> {
        await browser.sleep(500);

        if (await this.isSpinnerPresent()) {
            Logger.log('wait spinner disappear');
            await BrowserVisibility.waitUntilElementIsNotVisible(element(by.tagName('mat-progress-spinner')), MAX_LOADING_TIME);
        } else {
            try {
                Logger.log('wait spinner is present');
                await BrowserVisibility.waitUntilElementIsVisible(element(by.tagName('mat-progress-spinner')));
                await BrowserVisibility.waitUntilElementIsNotVisible(element(by.tagName('mat-progress-spinner')), MAX_LOADING_TIME);
            } catch (error) {}
        }
    }

    async clearPageNumber(): Promise<void> {
        await BrowserActions.clearSendKeys(this.pageSelectorInput);
    }

    async getZoom(): Promise<string> {
        return BrowserActions.getText(this.percentage);
    }

    async getCanvasWidth(): Promise<string> {
        return BrowserActions.getAttribute(this.canvasLayer, `width`);
    }

    async getCanvasHeight(): Promise<string> {
        return BrowserActions.getAttribute(this.canvasLayer, `height`);
    }

    async getDisplayedFileName(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.fileName);
        return BrowserActions.getText(this.fileName);
    }

    async exitFullScreen(): Promise<void> {
        const jsCode = 'document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen&&document.webkitExitFullscreen();';
        await browser.executeScript(jsCode);
    }

    async checkFileIsLoaded(fileName?: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.pdfPageLoaded, 60000, `${fileName} not loaded`);
    }

    async checkImgViewerIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.imgViewer);
    }

    async checkAllThumbnailsDisplayed(nbPages): Promise<void> {
        const defaultThumbnailHeight = 143;
        await expect(await BrowserActions.getAttribute(this.thumbnailsContent, 'style')).toEqual(
            'height: ' + nbPages * defaultThumbnailHeight + 'px; transform: translate(-50%, 0px);'
        );
    }

    async checkCurrentThumbnailIsSelected(): Promise<void> {
        const selectedThumbnail = $('adf-pdf-thumb.adf-pdf-thumbnails__thumb.adf-pdf-thumbnails__thumb--selected > img');
        const pageNumber = await BrowserActions.getInputValue(this.pageSelectorInput);

        await expect('Page ' + pageNumber).toEqual(await BrowserActions.getAttribute(selectedThumbnail, 'title'));
    }

    async checkThumbnailsCloseIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.thumbnailsClose);
    }

    async checkThumbnailsBtnIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.thumbnailsBtn);
    }

    async checkThumbnailsBtnIsDisabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible($('button[data-automation-id="adf-thumbnails-button"]:disabled'));
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

    async checkDownloadButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.downloadButton);
    }

    async checkInfoButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.infoButton);
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

    async checkPageSelectorInputIsDisplayed(checkNumber: string): Promise<void> {
        await expect(await BrowserActions.getInputValue(this.pageSelectorInput)).toEqual(checkNumber);
    }

    async checkImgContainerIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.imgContainer);
    }

    async checkMediaPlayerContainerIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.mediaContainer);
    }

    async checkFileContent(pageNumber: string, text: string): Promise<void> {
        const allPages = this.canvasLayer;
        const pageLoaded = $$('div[data-page-number="' + pageNumber + '"][data-loaded="true"]').first();
        const textLayerLoaded = $$('div[data-page-number="' + pageNumber + '"] .textLayer').first();
        const specificText = element.all(by.cssContainingText('div[data-page-number="' + pageNumber + '"] .textLayer', text)).first();

        await BrowserVisibility.waitUntilElementIsVisible(allPages);
        await BrowserVisibility.waitUntilElementIsVisible(pageLoaded);
        await BrowserVisibility.waitUntilElementIsVisible(textLayerLoaded);
        await BrowserVisibility.waitUntilElementIsVisible(specificText);
    }

    async checkFullScreenButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.fullScreenButton);
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

    async checkScaleImgButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.scaleImg);
    }

    async checkInfoSideBarIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.infoSideBar);
    }

    async checkInfoSideBarIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.infoSideBar);
    }

    async clickInfoButton(): Promise<void> {
        await BrowserActions.click($('button[data-automation-id="adf-toolbar-sidebar"]'));
    }

    async clickOnTab(tabName: string): Promise<void> {
        await this.tabsPage.clickTabByTitle(tabName);
    }

    async checkTabIsActive(tabName: string): Promise<void> {
        const tab = element(
            by.cssContainingText('.adf-info-drawer-layout-content div.mat-tab-labels div.mat-tab-label-active .mat-tab-label-content', tabName)
        );
        await BrowserVisibility.waitUntilElementIsVisible(tab);
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

    async clickDownloadButton(): Promise<void> {
        await BrowserActions.click(this.downloadButton);
    }

    async clickCloseButton(): Promise<void> {
        await BrowserActions.click(this.closeButton);
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

    async getActiveTab(): Promise<string> {
        return BrowserActions.getText(this.activeTab);
    }

    async clickOnCommentsTab(): Promise<void> {
        await this.tabsPage.clickTabByTitle('Comments');
    }

    async checkToolbarIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.toolbar);
    }

    async checkUnknownFormatIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.unknownFormat);
    }

    async getUnknownFormatMessage(): Promise<string> {
        const unknownFormatLabel = this.unknownFormat.$(`.adf-viewer__unknown-label`);
        return BrowserActions.getText(unknownFormatLabel);
    }

    async expectUrlToContain(text: string): Promise<void> {
        await expect(browser.getCurrentUrl()).toContain(text);
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
}
