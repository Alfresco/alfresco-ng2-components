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

var Util = require("../../util/util");
var CardViewPage = require("./cardViewPage");

var ViewerToolbarPage = function () {

    var closeButton = element(by.css("button[data-automation-id='adf-toolbar-back']"));
    var fileName = element(by.id("adf-viewer-display-name"));
    var infoButton = element(by.css("button[data-automation-id='adf-toolbar-sidebar']"));
    var leftSideBarButton = element(by.css("button[data-automation-id='adf-toolbar-left-sidebar']"));
    var previousPageButton = element(by.id("viewer-previous-page-button"));
    var nextPageButton = element(by.id("viewer-next-page-button"));
    var zoomInButton = element(by.id("viewer-zoom-in-button"));
    var zoomOutButton = element(by.id("viewer-zoom-out-button"));
    var scalePageButton = element(by.id("viewer-scale-page-button"));
    var pdfContainer = element(by.id("viewer-pdf-container"));
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
    var thumbnailsBtn = element(by.css("button[data-automation-id='adf-thumbnails-button']"));
    var thumbnailsContent = element(by.css("div[data-automation-id='adf-thumbnails-content']"));
    var thumbnailsClose = element(by.css("button[data-automation-id='adf-thumbnails-close']"));
    var secondThumbnail = element(by.css("adf-pdf-thumb > img[title='Page 2'"));
    var lastThumbnailDisplayed = element.all(by.css("adf-pdf-thumb")).last();
    var passwordDialog = element(by.css("adf-pdf-viewer-password-dialog"));
    var passwordSubmit = element(by.css("button[data-automation-id='adf-password-dialog-submit']"));
    var passwordSubmitDisabled = element(by.css("button[data-automation-id='adf-password-dialog-submit'][disabled]"));
    var passwordInput = element(by.css("input[data-automation-id='adf-password-dialog-input']"));
    var passwordError = element(by.css("mat-error[data-automation-id='adf-password-dialog-error']"));
    var infoSideBar = element(by.id("adf-right-sidebar"));
    var leftSideBar = element(by.id("adf-left-sidebar"));
    var unsupportedFileContainer = element(by.cssContainingText(".label", "Document preview could not be loaded"));
    var pageCanvas = element.all(by.css("div[class='canvasWrapper']")).first();
    var viewer = element(by.css("adf-viewer"));
    var pdfViewer = element(by.css("adf-pdf-viewer"));
    var imgViewer = element(by.css("adf-img-viewer"));
    var activeTab = element(by.css("div[class*='mat-tab-label-active']"));
    var uploadNewVersionButton = element(by.css("input[data-automation-id='upload-single-file']"));
    var rightChevron = element(by.css("div[class*='header-pagination-after']"));
    var toolbarSwitch = element(by.id('adf-switch-toolbar'));
    var toolbar = element(by.id('adf-viewer-toolbar'));
    var goBackSwitch = element(by.id('adf-switch-goback'));

    var openWithSwitch = element(by.id('adf-switch-openwith'));
    var openWith = element(by.id('adf-viewer-openwith'));

    var customNameSwitch = element(by.id('adf-switch-custoname'));

    var showRightSidebarSwitch = element(by.id('adf-switch-showrightsidebar'));
    var showLeftSidebarSwitch = element(by.id('adf-switch-showleftsidebar'));

    var moreActionsSwitch = element(by.id('adf-switch-moreactions'));
    var moreActions = element(by.id('adf-viewer-moreactions'));

    var downloadSwitch = element(by.id('adf-switch-download'));
    var downloadButton = element(by.id('adf-viewer-download'));

    var printSwitch = element(by.id('adf-switch-print'));
    var printButton = element(by.id('adf-viewer-print'));

    var allowSidebarSwitch = element(by.id('adf-switch-allowsidebar'));

    var shareSwitch = element(by.id('adf-switch-share'));
    var shareButton = element(by.id('adf-viewer-share'));

    var uploadButton = element(by.id('adf-viewer-upload'));
    var timeButton = element(by.id('adf-viewer-time'));
    var bugButton = element(by.id('adf-viewer-bug'));

    this.canvasHeight = function () {
        var deferred = protractor.promise.defer();
        pageCanvas.getAttribute("style").then(function (value) {
            var canvasHeight = value.split("height: ")[1].split("px")[0];
            deferred.fulfill(canvasHeight);
        });
        return deferred.promise;
    };

    this.canvasWidth = function () {
        var deferred = protractor.promise.defer();
        pageCanvas.getAttribute("style").then(function (value) {
            var canvasWidth = value.split("width: ")[1].split("px")[0];
            deferred.fulfill(canvasWidth);
        });
        return deferred.promise;
    };

    this.viewFile = function (fileName) {
        var fileView = element.all(by.xpath("//div[@id='document-list-container']//div[@filename='" + fileName + "']")).first();
        Util.waitUntilElementIsVisible(fileView);
        fileView.click();
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    };

    this.clearPageNumber = function () {
        Util.waitUntilElementIsVisible(pageSelectorInput);
        pageSelectorInput.clear();
        pageSelectorInput.sendKeys(protractor.Key.ENTER);
    };

    this.getZoom = function () {
        return percentage.getText();
    };

    this.exitFullScreen = function () {
        var jsCode = "document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen&&document.webkitExitFullscreen();";
        browser.executeScript(jsCode);
    };

    this.enterPassword = function (password) {
        Util.waitUntilElementIsVisible(passwordInput);
        passwordInput.clear();
        passwordInput.sendKeys(password);
    };

    this.checkPageCanvasIsDisplayed = function () {
        Util.waitUntilElementIsVisible(pageCanvas);
    };

    this.checkViewerIsNotDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(viewer);
    };

    this.checkPdfViewerIsDisplayed = function () {
        Util.waitUntilElementIsOnPage(pdfViewer);
    };

    this.checkImgViewerIsDisplayed = function () {
        Util.waitUntilElementIsOnPage(imgViewer);
    };

    this.checkPasswordErrorIsDisplayed = function () {
        Util.waitUntilElementIsVisible(passwordError);
    };

    this.checkPasswordInputIsDisplayed = function () {
        Util.waitUntilElementIsVisible(passwordInput);
    };

    this.checkPasswordSubmitDisabledIsDisplayed = function () {
        Util.waitUntilElementIsVisible(passwordSubmitDisabled);
    };

    this.checkPasswordDialogIsDisplayed = function () {
        Util.waitUntilElementIsVisible(passwordDialog);
    };

    this.checkAllThumbnailsDisplayed = function (nbPages) {
        var defaultThumbnailHeight = 143;
        expect(thumbnailsContent.getAttribute("style")).toEqual("height: " + nbPages * defaultThumbnailHeight + "px; transform: translate(-50%, 0px);");
    };

    this.checkCurrentThumbnailIsSelected = function () {
        var selectedThumbnail = element(by.css("adf-pdf-thumb[class='pdf-thumbnails__thumb ng-star-inserted pdf-thumbnails__thumb--selected'] > img"));
        pageSelectorInput.getAttribute("value").then(function (pageNumber) {
            expect("Page " + pageNumber).toEqual(selectedThumbnail.getAttribute("title"));
        });
    };

    this.checkThumbnailsCloseIsDisplayed = function () {
        Util.waitUntilElementIsVisible(thumbnailsClose);
    };

    this.checkThumbnailsBtnIsDisplayed = function () {
        Util.waitUntilElementIsVisible(thumbnailsBtn);
    };

    this.checkThumbnailsBtnIsDisabled = function () {
        Util.waitUntilElementIsVisible(thumbnailsBtn.getAttribute("disabled"));
        return this;
    };

    this.checkThumbnailsContentIsDisplayed = function () {
        Util.waitUntilElementIsVisible(thumbnailsContent);
    };

    this.checkThumbnailsContentIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(thumbnailsContent);
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

    this.checkInfoButtonIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(infoButton);
    };

    this.checkFileThumbnailIsDisplayed = function () {
        Util.waitUntilElementIsVisible(fileThumbnail);
    };

    this.checkFileNameIsDisplayed = function (file) {
        Util.waitUntilElementIsVisible(fileName);
        expect(fileName.getText()).toEqual(file);
    };

    this.checkPreviousPageButtonIsDisplayed = function () {
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
        pageSelectorInput.getAttribute("value").then(function (pageNumber) {
            expect(pageNumber).toEqual(number);
        });
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

    this.checkZoomedIn = function (zoom) {
        expect(percentage.getText()).toBeGreaterThan(zoom);
    };

    this.checkZoomedOut = function (zoom) {
        expect(percentage.getText()).toBeLessThan(zoom);
    };

    this.checkRotateLeftButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(rotateLeft);
    };

    this.checkRotateRightButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(rotateRight);
    };

    this.checkScaled = function (zoom) {
        expect(percentage.getText()).toEqual(zoom);
    };

    this.checkScaleImgButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(scaleImg);
    };

    this.checkRotation = function (text) {
        var rotation = imgContainer.getAttribute("style");
        expect(rotation).toEqual(text);
    };

    this.checkCustomBtnDisplayed = function () {
        Util.waitUntilElementIsVisible(customBtn);
    };

    this.checkUnsupportedFileContainerIsDisplayed = function () {
        Util.waitUntilElementIsVisible(unsupportedFileContainer);
    };

    this.checkInfoSideBarIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(infoSideBar);
    };

    this.checkInfoSideBarIsDisplayed = function () {
        Util.waitUntilElementIsVisible(infoSideBar);
    };

    this.checkInfoSideBarIsNotDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(infoSideBar);
    };

    this.checkLeftSideBarButtonIsNotDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(leftSideBarButton);
    };

    this.checkLeftSideBarButtonIsDisplayed = function () {
        Util.waitUntilElementIsOnPage(leftSideBarButton);
    };

    this.clickInfoButton = function () {
        Util.waitUntilElementIsVisible(infoButton);
        return infoButton.click();
    };

    this.clickLeftSidebarButton = function () {
        Util.waitUntilElementIsVisible(leftSideBarButton);
        return leftSideBarButton.click();
    };

    this.checkLeftSideBarIsDisplayed = function () {
        Util.waitUntilElementIsVisible(leftSideBar);
    };

    this.checkLeftSideBarIsNotDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(leftSideBar);
    };

    this.clickPasswordSubmit = function () {
        Util.waitUntilElementIsVisible(passwordSubmit);
        return passwordSubmit.click();
    };

    this.clickSecondThumbnail = function () {
        Util.waitUntilElementIsClickable(secondThumbnail);
        return secondThumbnail.click();
    };

    this.clickLastThumbnailDisplayed = function () {
        Util.waitUntilElementIsClickable(lastThumbnailDisplayed);
        return lastThumbnailDisplayed.click();
    };

    this.clickThumbnailsClose = function () {
        Util.waitUntilElementIsClickable(thumbnailsClose);
        return thumbnailsClose.click();
    };

    this.clickThumbnailsBtn = function () {
        Util.waitUntilElementIsVisible(thumbnailsBtn);
        Util.waitUntilElementIsClickable(thumbnailsBtn);
        return thumbnailsBtn.click();
    };

    this.clickScaleImgButton = function () {
        Util.waitUntilElementIsClickable(scaleImg);
        return scaleImg.click();
    };

    this.clickScalePdfButton = function () {
        Util.waitUntilElementIsClickable(scalePageButton);
        return scalePageButton.click();
    };

    this.clickDownloadButton = function () {
        Util.waitUntilElementIsVisible(downloadButton);
        return downloadButton.click();
    };

    this.clickCloseButton = function () {
        Util.waitUntilElementIsVisible(closeButton);
        return closeButton.click();
    };

    this.clickPreviousPageButton = function () {
        Util.waitUntilElementIsVisible(previousPageButton);
        return previousPageButton.click();
    };

    this.clickNextPageButton = function () {
        Util.waitUntilElementIsVisible(nextPageButton);
        return nextPageButton.click();
    };

    this.clickZoomInButton = function () {
        Util.waitUntilElementIsVisible(zoomInButton);
        return zoomInButton.click();
    };

    this.clickZoomOutButton = function () {
        Util.waitUntilElementIsVisible(zoomOutButton);
        return zoomOutButton.click();
    };

    this.clickScalePageButton = function () {
        Util.waitUntilElementIsVisible(scalePageButton);
        scalePageButton.click();
    };

    this.clickFullScreenButton = function () {
        Util.waitUntilElementIsClickable(fullScreenButton);
        return fullScreenButton.click();
    };

    this.clickRotateLeftButton = function () {
        Util.waitUntilElementIsClickable(rotateLeft);
        return rotateLeft.click();
    };

    this.clickRotateRightButton = function () {
        Util.waitUntilElementIsClickable(rotateRight);
        return rotateRight.click();
    };

    this.getActiveTab = function () {
        Util.waitUntilElementIsVisible(activeTab);
        return activeTab.getText();
    };

    this.checkUnsupportedFileContainerIsDisplayed = function () {
        Util.waitUntilElementIsVisible(unsupportedFileContainer);
    };

    this.clickRightChevronToGetToTab = (tabName) => {
        element.all(by.css('.mat-tab-label'))
            .map((element) => element.getAttribute('innerText'))
            .then((texts) => {
                for (let text of texts) {
                    if (text === tabName) {
                        break;
                    }
                    this.clickRightChevron();
                }
            });
    };

    this.clickRightChevron = function () {
        Util.waitUntilElementIsVisible(rightChevron);
        rightChevron.click();
        return this;
    };

    this.clickOnVersionsTab = function () {
        this.clickRightChevronToGetToTab('Versions');
        var versionsTab = element(by.cssContainingText("div[id*='mat-tab-label']", "Versions"));
        Util.waitUntilElementIsVisible(versionsTab);
        versionsTab.click();
        return this;
    };

    this.checkUploadVersionsButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(uploadNewVersionButton);
        return this;
    };

    this.checkVersionIsDisplayed = function (version) {
        Util.waitUntilElementIsVisible(element(by.cssContainingText("h4[class*='adf-version-list-item-name']", version)));
        return this;
    };

    this.clickOnCommentsTab = function () {
        var commentsTab = element(by.cssContainingText("div[id*='mat-tab-label']", "Comments"));
        Util.waitUntilElementIsVisible(commentsTab);
        commentsTab.click();
        return this;
    };

    this.disableToolbar = function () {
        Util.waitUntilElementIsVisible(toolbarSwitch);
        toolbarSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') >= 0) {
                toolbarSwitch.click();
            }
        });
    }

    this.enableToolbar = function () {
        Util.waitUntilElementIsVisible(toolbarSwitch);
        toolbarSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') < 0) {
                toolbarSwitch.click();
            }
        });
    }

    this.checkToolbarIsDisplayed = function () {
        Util.waitUntilElementIsVisible(toolbar);
        return this;
    };

    this.checkToolbarIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(toolbar);
        return this;
    };

    this.disableGoBack = function () {
        Util.waitUntilElementIsVisible(goBackSwitch);
        goBackSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') >= 0) {
                goBackSwitch.click();
            }
        });
    }

    this.enableGoBack = function () {
        Util.waitUntilElementIsVisible(goBackSwitch);
        goBackSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') < 0) {
                goBackSwitch.click();
            }
        });
    }

    this.checkGoBackIsDisplayed = function () {
        Util.waitUntilElementIsVisible(closeButton);
        return this;
    };

    this.checkGoBackIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(closeButton);
        return this;
    };

    this.disableToolbarOptions = function () {
        Util.waitUntilElementIsVisible(openWithSwitch);
        openWithSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') >= 0) {
                openWithSwitch.click();
            }
        });
    }

    this.enableToolbarOptions = function () {
        Util.waitUntilElementIsVisible(openWithSwitch);
        openWithSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') < 0) {
                openWithSwitch.click();
            }
        });
    }

    this.checkToolbarOptionsIsDisplayed = function () {
        Util.waitUntilElementIsVisible(openWith);
        return this;
    };

    this.checkToolbarOptionsIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(openWith);
        return this;
    };

    this.disableDownload = function () {
        Util.waitUntilElementIsVisible(downloadSwitch);
        downloadSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') >= 0) {
                downloadSwitch.click();
            }
        });
    }

    this.enableDownload = function () {
        Util.waitUntilElementIsVisible(openWithSwitch);
        downloadSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') < 0) {
                downloadSwitch.click();
            }
        });
    }

    this.checkDownloadButtonDisplayed = function () {
        Util.waitUntilElementIsVisible(downloadButton);
        return this;
    };

    this.checkDownloadButtonIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(downloadButton);
        return this;
    };

    this.disablePrint = function () {
        Util.waitUntilElementIsVisible(printSwitch);
        printSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') >= 0) {
                printSwitch.click();
            }
        });
    }

    this.enablePrint = function () {
        Util.waitUntilElementIsVisible(printSwitch);
        printSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') < 0) {
                printSwitch.click();
            }
        });
    }

    this.checkPrintButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(printButton);
        return this;
    };

    this.checkPrintButtonIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(printButton);
        return this;
    };

    this.disableShare = function () {
        Util.waitUntilElementIsVisible(shareSwitch);
        shareSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') >= 0) {
                shareSwitch.click();
            }
        });
    }

    this.enableShare = function () {
        Util.waitUntilElementIsVisible(shareSwitch);
        shareSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') < 0) {
                shareSwitch.click();
            }
        });
    }

    this.disableAllowSidebar = function () {
        Util.waitUntilElementIsVisible(allowSidebarSwitch);
        allowSidebarSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') >= 0) {
                allowSidebarSwitch.click();
            }
        });
    }

    this.enableAllowSidebar = function () {
        Util.waitUntilElementIsVisible(allowSidebarSwitch);
        allowSidebarSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') < 0) {
                allowSidebarSwitch.click();
            }
        });
    }

    this.checkShareButtonDisplayed = function () {
        Util.waitUntilElementIsVisible(shareButton);
        return this;
    };

    this.checkShareButtonIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(shareButton);
        return this;
    };

    this.checkMoreActionsDisplayed = function () {
        Util.waitUntilElementIsVisible(bugButton);
        Util.waitUntilElementIsVisible(timeButton);
        Util.waitUntilElementIsVisible(uploadButton);
        return this;
    };

    this.checkMoreActionsIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(bugButton);
        Util.waitUntilElementIsNotVisible(timeButton);
        Util.waitUntilElementIsNotVisible(uploadButton);
        return this;
    };

    this.disableMoreActions = function () {
        Util.waitUntilElementIsVisible(moreActionsSwitch);
        moreActionsSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') >= 0) {
                moreActionsSwitch.click();
            }
        });
    }

    this.enableMoreActions = function () {
        Util.waitUntilElementIsVisible(moreActionsSwitch);
        moreActionsSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') < 0) {
                moreActionsSwitch.click();
            }
        });
    }

    this.disableCustomName = function () {
        Util.waitUntilElementIsVisible(customNameSwitch);
        customNameSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') >= 0) {
                customNameSwitch.click();
            }
        });
    }

    this.enableCustomName = function () {
        Util.waitUntilElementIsVisible(customNameSwitch);
        customNameSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') < 0) {
                customNameSwitch.click();
            }
        });
    }

    this.clickToggleRightSidebar = function () {
        Util.waitUntilElementIsVisible(showRightSidebarSwitch);
        showRightSidebarSwitch.click();
    }

    this.clickToggleLeftSidebar = function () {
        Util.waitUntilElementIsVisible(showLeftSidebarSwitch);
        showLeftSidebarSwitch.click();
    }

    this.enterCustomName = function (text) {
        const textField = element(by.css('input[data-automation-id="adf-text-custom-name"]'));
        Util.waitUntilElementIsVisible(textField);
        textField.sendKeys('');
        textField.clear().sendKeys(text);
        return this;
    };
};

module.exports = ViewerToolbarPage;
