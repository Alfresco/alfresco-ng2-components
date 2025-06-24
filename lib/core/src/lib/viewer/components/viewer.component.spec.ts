/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, DebugElement, SimpleChanges } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { AppConfigService } from '../../app-config';
import { EventMock } from '../../mock';
import { CoreTestingModule, UnitTestingUtils } from '../../testing';
import { DownloadPromptActions } from '../models/download-prompt.actions';
import { CloseButtonPosition } from '../models/viewer.model';
import { ViewUtilService } from '../services/view-util.service';
import { DownloadPromptDialogComponent } from './download-prompt-dialog/download-prompt-dialog.component';
import { ViewerWithCustomMoreActionsComponent } from './mock/adf-viewer-container-more-actions.component.mock';
import { ViewerWithCustomOpenWithComponent } from './mock/adf-viewer-container-open-with.component.mock';
import { ViewerWithCustomSidebarComponent } from './mock/adf-viewer-container-sidebar.component.mock';
import { ViewerWithCustomToolbarActionsComponent } from './mock/adf-viewer-container-toolbar-actions.component.mock';
import { ViewerWithCustomToolbarComponent } from './mock/adf-viewer-container-toolbar.component.mock';
import { ViewerComponent } from './viewer.component';
import { ThumbnailService } from '../../common/services/thumbnail.service';

@Component({
    selector: 'adf-dialog-dummy',
    template: ``
})
class DummyDialogComponent {}

describe('ViewerComponent', () => {
    let component: ViewerComponent<any>;
    let fixture: ComponentFixture<ViewerComponent<any>>;
    let dialog: MatDialog;
    let viewUtilService: ViewUtilService;
    let appConfigService: AppConfigService;
    let thumbnailService: ThumbnailService;
    let testingUtils: UnitTestingUtils;

    const getFileName = (): string => testingUtils.getByCSS('#adf-viewer-display-name').nativeElement.textContent;
    const getDividers = (): DebugElement[] => testingUtils.getAllByCSS('.adf-toolbar-divider');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreTestingModule,
                MatButtonModule,
                MatIconModule,
                ViewerWithCustomToolbarComponent,
                ViewerWithCustomSidebarComponent,
                ViewerWithCustomOpenWithComponent,
                ViewerWithCustomMoreActionsComponent,
                ViewerWithCustomToolbarActionsComponent
            ],
            providers: [MatDialog, { provide: DownloadPromptDialogComponent, useClass: DummyDialogComponent }]
        });

        fixture = TestBed.createComponent(ViewerComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        component = fixture.componentInstance;
        dialog = TestBed.inject(MatDialog);
        viewUtilService = TestBed.inject(ViewUtilService);
        appConfigService = TestBed.inject(AppConfigService);
        thumbnailService = TestBed.inject(ThumbnailService);
        component.fileName = 'test-file.pdf';

        appConfigService.config = {
            ...appConfigService.config,
            viewer: {
                enableDownloadPrompt: false,
                enableDownloadPromptReminder: false,
                downloadPromptDelay: 3,
                downloadPromptReminderDelay: 2
            }
        };
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Mime Type Test', () => {
        it('should mimeType change when blobFile changes', () => {
            const mockSimpleChanges: any = { blobFile: { currentValue: { type: 'image/png' } } };

            component.ngOnChanges(mockSimpleChanges);

            expect(component.mimeType).toBe('image/png');
        });

        it('should set mimeTypeIconUrl when mimeType changes and no nodeMimeType is provided', () => {
            spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue('image/png');
            const mockSimpleChanges: any = { mimeType: { currentValue: 'image/png' }, nodeMimeType: undefined };

            component.ngOnChanges(mockSimpleChanges);

            expect(thumbnailService.getMimeTypeIcon).toHaveBeenCalledWith('image/png');
            expect(component.mimeTypeIconUrl).toBe('image/png');
        });

        it('should set mimeTypeIconUrl when nodeMimeType changes', () => {
            spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue('application/pdf');
            const mockSimpleChanges: any = { mimeType: { currentValue: 'image/png' }, nodeMimeType: { currentValue: 'application/pdf' } };

            component.ngOnChanges(mockSimpleChanges);
            fixture.detectChanges();

            expect(thumbnailService.getMimeTypeIcon).toHaveBeenCalledWith('application/pdf');
            expect(component.mimeTypeIconUrl).toBe('application/pdf');
        });

        it('should reset urlFile and blobFile on onNavigateBeforeClick', () => {
            component.urlFile = 'some-url';
            component.blobFile = new Blob(['content'], { type: 'text/plain' });

            component.onNavigateBeforeClick(new MouseEvent('click'));

            expect(component.urlFile).toBe('');
            expect(component.blobFile).toBeNull();
        });

        it('should reset urlFile and blobFile on onNavigateNextClick', () => {
            component.urlFile = 'some-url';
            component.blobFile = new Blob(['content'], { type: 'text/plain' });

            component.onNavigateNextClick(new MouseEvent('click'));

            expect(component.urlFile).toBe('');
            expect(component.blobFile).toBeNull();
        });
    });

    describe('File Name Display Tests', () => {
        describe('displayFileName method', () => {
            it('should return full filename when total length is 80 characters or less', () => {
                const fileShortName = 'shortname.txt';
                component.fileName = fileShortName;
                fixture.detectChanges();

                expect(component.getDisplayFileName()).toBe(fileShortName);
                expect(getFileName()).toBe(fileShortName);
            });

            it('should truncate filename when total length exceeds 80 characters', () => {
                const longName =
                    'verylongfilenamethatexceedsmaximumlengthallowedverylongfilenamethatexceedsmaximumlengthallowed.verylongextensionnamethatistoolongverylongextensionnamethatistoolong';

                component.fileName = longName;
                fixture.detectChanges();

                const result = component.getDisplayFileName();

                expect(result).toContain('.....');
                expect(result.length).toBe(50);
            });

            it('should handle empty filename', () => {
                component.fileName = '';
                fixture.detectChanges();

                expect(component.getDisplayFileName()).toBe('');
                expect(getFileName()).toBe('');
            });
        });

        describe('fileName setter integration', () => {
            it('should fileName be set by urlFile input if the fileName is not provided as Input', () => {
                component.fileName = '';
                spyOn(viewUtilService, 'getFilenameFromUrl').and.returnValue('fakeFileName.jpeg');
                const mockSimpleChanges = { urlFile: { currentValue: 'https://fakefile.url/fakeFileName.jpeg' } } as unknown as SimpleChanges;

                component.ngOnChanges(mockSimpleChanges);
                fixture.detectChanges();

                expect(getFileName()).toEqual('fakeFileName.jpeg');
            });

            it('should set fileName providing fileName input', () => {
                component.fileName = 'testFileName.jpg';
                spyOn(viewUtilService, 'getFilenameFromUrl').and.returnValue('fakeFileName.jpeg');
                const mockSimpleChanges = { urlFile: { currentValue: 'https://fakefile.url/fakeFileName.jpeg' } } as unknown as SimpleChanges;

                component.ngOnChanges(mockSimpleChanges);
                fixture.detectChanges();

                expect(getFileName()).toEqual('testFileName.jpg');
            });
        });
    });

    describe('Viewer Example Component Rendering', () => {
        it('should use custom toolbar', (done) => {
            const customFixture = TestBed.createComponent(ViewerWithCustomToolbarComponent);
            testingUtils.setDebugElement(customFixture.debugElement);
            customFixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(testingUtils.getByCSS('.custom-toolbar-element')).toBeDefined();
                done();
            });
        });

        it('should use custom toolbar actions', (done) => {
            const customFixture = TestBed.createComponent(ViewerWithCustomToolbarActionsComponent);
            testingUtils.setDebugElement(customFixture.debugElement);
            customFixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(testingUtils.getByCSS('#custom-button')).toBeDefined();
                done();
            });
        });

        it('should use custom info drawer', (done) => {
            const customFixture = TestBed.createComponent(ViewerWithCustomSidebarComponent);
            testingUtils.setDebugElement(customFixture.debugElement);
            customFixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(testingUtils.getByCSS('.custom-info-drawer-element')).toBeDefined();
                done();
            });
        });

        it('should use custom open with menu', (done) => {
            const customFixture = TestBed.createComponent(ViewerWithCustomOpenWithComponent);
            testingUtils.setDebugElement(customFixture.debugElement);
            customFixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(testingUtils.getByCSS('.adf-viewer-container-open-with')).toBeDefined();
                done();
            });
        });

        it('should use custom more actions menu', (done) => {
            const customFixture = TestBed.createComponent(ViewerWithCustomMoreActionsComponent);
            testingUtils.setDebugElement(customFixture.debugElement);
            customFixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(testingUtils.getByCSS('.adf-viewer-container-more-actions')).toBeDefined();
                done();
            });
        });
    });

    describe('Toolbar', () => {
        it('should show only next file button', async () => {
            component.allowNavigate = true;
            component.canNavigateBefore = false;
            component.canNavigateNext = true;

            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByDataAutomationId('adf-toolbar-next-file')).not.toBeNull();
            expect(testingUtils.getByDataAutomationId('adf-toolbar-pref-file')).toBeNull();
        });

        it('should provide tooltip for next file button', async () => {
            component.allowNavigate = true;
            component.canNavigateBefore = false;
            component.canNavigateNext = true;

            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByDataAutomationId('adf-toolbar-next-file').nativeElement.title).toBe('ADF_VIEWER.ACTIONS.NEXT_FILE');
        });

        it('should show only previous file button', async () => {
            component.allowNavigate = true;
            component.canNavigateBefore = true;
            component.canNavigateNext = false;

            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByDataAutomationId('adf-toolbar-next-file')).toBeNull();
            expect(testingUtils.getByDataAutomationId('adf-toolbar-pref-file')).not.toBeNull();
        });

        it('should provide tooltip for the previous file button', async () => {
            component.allowNavigate = true;
            component.canNavigateBefore = true;
            component.canNavigateNext = false;

            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByDataAutomationId('adf-toolbar-pref-file').nativeElement.title).toBe('ADF_VIEWER.ACTIONS.PREV_FILE');
        });

        it('should show both file navigation buttons', async () => {
            component.allowNavigate = true;
            component.canNavigateBefore = true;
            component.canNavigateNext = true;

            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByDataAutomationId('adf-toolbar-next-file')).not.toBeNull();
            expect(testingUtils.getByDataAutomationId('adf-toolbar-pref-file')).not.toBeNull();
        });

        it('should not show navigation buttons', async () => {
            component.allowNavigate = false;

            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByDataAutomationId('adf-toolbar-next-file')).toBeNull();
            expect(testingUtils.getByDataAutomationId('adf-toolbar-pref-file')).toBeNull();
        });

        it('should not show navigation buttons if file is saving', async () => {
            component.allowNavigate = true;
            fixture.detectChanges();
            const viewerRender = testingUtils.getByCSS('adf-viewer-render');

            viewerRender.triggerEventHandler('isSaving', true);
            expect(component.allowNavigate).toBeFalsy();

            viewerRender.triggerEventHandler('isSaving', false);
            expect(component.allowNavigate).toBeTruthy();
        });

        it('should now show navigation buttons even if navigation enabled', async () => {
            component.allowNavigate = true;
            component.canNavigateBefore = false;
            component.canNavigateNext = false;

            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByDataAutomationId('adf-toolbar-next-file')).toBeNull();
            expect(testingUtils.getByDataAutomationId('adf-toolbar-pref-file')).toBeNull();
        });

        it('should render fullscreen button', () => {
            expect(testingUtils.getByDataAutomationId('adf-toolbar-fullscreen')).toBeDefined();
        });

        it('should render close viewer button if it is not a shared link', (done) => {
            component.closeButtonPosition = CloseButtonPosition.Left;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(testingUtils.getByDataAutomationId('adf-toolbar-left-back')).not.toBeNull();
                done();
            });
        });


   

        it('should display toolbar dividers by default when close button is visible', () => {
            component.allowGoBack = true;
            component.showToolbar = true;
            component.closeButtonPosition = CloseButtonPosition.Right;
            fixture.detectChanges();
            const dividers = getDividers();
            expect(dividers.length).toBe(1);
        });

        it('should display toolbar divider when close button is hidden', () => {
            component.allowGoBack = false;
            component.showToolbar = true;
            fixture.detectChanges();
            const dividers = getDividers();
            expect(dividers.length).toBe(0);
        });
  it('should not display any toolbar dividers when showToolbarDividers param is set to false', () => {
            component.showToolbarDividers = false;
            component.showToolbar = true;
            component.allowGoBack = true;
            fixture.detectChanges();
            const dividers = getDividers();
            expect(dividers.length).toBe(1);
        });

        describe('Base component', () => {
            beforeEach(() => {
                component.mimeType = 'application/pdf';

                fixture.detectChanges();
            });

            describe('SideBar Test', () => {
                it('should NOT display sidebar if is not allowed', (done) => {
                    component.showRightSidebar = true;
                    component.allowRightSidebar = false;
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expect(testingUtils.getByCSS('#adf-right-sidebar')).toBeNull();
                        done();
                    });
                });

                it('should display sidebar on the right side', (done) => {
                    component.allowRightSidebar = true;
                    component.showRightSidebar = true;
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        const sidebar = testingUtils.getByCSS('#adf-right-sidebar').nativeElement;
                        expect(getComputedStyle(sidebar).order).toEqual('4');
                        done();
                    });
                });

                it('should NOT display left sidebar if is not allowed', (done) => {
                    component.showLeftSidebar = true;
                    component.allowLeftSidebar = false;
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expect(testingUtils.getByCSS('#adf-left-sidebar')).toBeNull();
                        done();
                    });
                });

                it('should display sidebar on the left side', (done) => {
                    component.allowLeftSidebar = true;
                    component.showLeftSidebar = true;
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        const sidebar = testingUtils.getByCSS('#adf-left-sidebar').nativeElement;
                        expect(getComputedStyle(sidebar).order).toEqual('1');
                        done();
                    });
                });
            });

            describe('Info Button', () => {
                const infoButton = () => testingUtils.getByDataAutomationId('adf-toolbar-sidebar');

                it('should NOT display info button on the right side', () => {
                    component.allowRightSidebar = true;
                    component.hideInfoButton = true;
                    fixture.detectChanges();

                    expect(infoButton()).toBeNull();
                });

                it('should display info button on the right side', () => {
                    component.allowRightSidebar = true;
                    component.hideInfoButton = false;
                    fixture.detectChanges();

                    expect(infoButton()).not.toBeNull();
                });
            });

            describe('View', () => {
                describe('Overlay mode true', () => {
                    beforeEach(() => {
                        component.overlayMode = true;
                        component.fileName = 'fake-test-file.pdf';
                        fixture.detectChanges();
                    });

                    it('should header be present if is overlay mode', () => {
                        expect(testingUtils.getByCSS('.adf-viewer-toolbar')).not.toBeNull();
                    });

                    it('should file name be present if is overlay mode ', async () => {
                        const mockSimpleChanges: any = { blobFile: { currentValue: { type: 'image/png' } } };
                        component.ngOnChanges(mockSimpleChanges);
                        fixture.detectChanges();
                        await fixture.whenStable();
                        expect(getFileName()).toEqual('fake-test-file.pdf');
                    });

                    it('should Close button be present if overlay mode', async () => {
                        fixture.detectChanges();
                        await fixture.whenStable();
                        expect(testingUtils.getByCSS('.adf-viewer-close-button')).not.toBeNull();
                    });

                    it('should Click on close button hide the viewer', async () => {
                        testingUtils.clickByCSS('.adf-viewer-close-button');
                        fixture.detectChanges();

                        await fixture.whenStable();
                        expect(testingUtils.getByCSS('.adf-viewer-content')).toBeNull();
                    });

                    it('should Esc button hide the viewer', async () => {
                        EventMock.keyDown(27);

                        fixture.detectChanges();

                        await fixture.whenStable();
                        expect(testingUtils.getByCSS('.adf-viewer-content')).toBeNull();
                    });

                    it('should not close the viewer on Escape event if dialog was opened', (done) => {
                        const event = new KeyboardEvent('keydown', {
                            bubbles: true,
                            keyCode: 27
                        } as KeyboardEventInit);

                        const dialogRef = dialog.open(DummyDialogComponent);

                        dialogRef.afterClosed().subscribe(() => {
                            EventMock.keyDown(27);
                            fixture.detectChanges();
                            expect(testingUtils.getByCSS('.adf-viewer-content')).toBeNull();
                            done();
                        });

                        fixture.detectChanges();

                        document.body.dispatchEvent(event);
                        fixture.detectChanges();
                        expect(testingUtils.getByCSS('.adf-viewer-content')).not.toBeNull();
                    });
                });

                describe('Overlay mode false', () => {
                    beforeEach(() => {
                        component.overlayMode = false;
                        fixture.detectChanges();
                    });

                    it('should Esc button not hide the viewer if is not overlay mode', (done) => {
                        EventMock.keyDown(27);

                        fixture.detectChanges();

                        fixture.whenStable().then(() => {
                            expect(testingUtils.getByCSS('.adf-viewer-content')).not.toBeNull();
                            done();
                        });
                    });
                });
            });

            describe('Attribute', () => {
                it('should showViewer default value  be true', () => {
                    expect(component.showViewer).toBe(true);
                });

                it('should viewer be hide if showViewer value is false', () => {
                    component.showViewer = false;

                    fixture.detectChanges();
                    expect(testingUtils.getByCSS('.adf-viewer-content')).toBeNull();
                });
            });

            describe('Close Button', () => {
                const getRightCloseButton = () => testingUtils.getByDataAutomationId('adf-toolbar-right-back');
                const getLeftCloseButton = () => testingUtils.getByDataAutomationId('adf-toolbar-left-back');

                it('should show close button on left side when closeButtonPosition is left and allowGoBack is true', () => {
                    component.allowGoBack = true;
                    component.closeButtonPosition = CloseButtonPosition.Left;
                    fixture.detectChanges();

                    expect(getLeftCloseButton()).not.toBeNull();
                    expect(getRightCloseButton()).toBeNull();
                });

                it('should show close button on right side when closeButtonPosition is right and allowGoBack is true', () => {
                    component.allowGoBack = true;
                    component.closeButtonPosition = CloseButtonPosition.Right;
                    fixture.detectChanges();

                    expect(getRightCloseButton()).not.toBeNull();
                    expect(getLeftCloseButton()).toBeNull();
                });

                it('should hide close button allowGoBack is false', () => {
                    component.allowGoBack = false;
                    fixture.detectChanges();

                    expect(getRightCloseButton()).toBeNull();
                    expect(getLeftCloseButton()).toBeNull();
                });
            });

            describe('Viewer component - Full Screen Mode - Mocking fixture element', () => {
                beforeEach(() => {
                    fixture = TestBed.createComponent(ViewerComponent);
                    component = fixture.componentInstance;
                    component.showToolbar = true;
                    component.mimeType = 'application/pdf';
                    fixture.detectChanges();
                });

                it('should request only if enabled', () => {
                    const domElement = jasmine.createSpyObj('el', ['requestFullscreen']);
                    spyOn(fixture.nativeElement, 'querySelector').and.returnValue(domElement);

                    component.allowFullScreen = false;
                    component.enterFullScreen();

                    expect(domElement.requestFullscreen).not.toHaveBeenCalled();
                });

                it('should use standard mode', () => {
                    const domElement = jasmine.createSpyObj('el', ['requestFullscreen']);
                    spyOn(fixture.nativeElement, 'querySelector').and.returnValue(domElement);

                    component.enterFullScreen();
                    expect(domElement.requestFullscreen).toHaveBeenCalled();
                });

                it('should use webkit prefix', () => {
                    const domElement = jasmine.createSpyObj('el', ['webkitRequestFullscreen']);
                    spyOn(fixture.nativeElement, 'querySelector').and.returnValue(domElement);

                    component.enterFullScreen();
                    expect(domElement.webkitRequestFullscreen).toHaveBeenCalled();
                });

                it('should use moz prefix', () => {
                    const domElement = jasmine.createSpyObj('el', ['mozRequestFullScreen']);
                    spyOn(fixture.nativeElement, 'querySelector').and.returnValue(domElement);

                    component.enterFullScreen();
                    expect(domElement.mozRequestFullScreen).toHaveBeenCalled();
                });

                it('should use ms prefix', () => {
                    const domElement = jasmine.createSpyObj('el', ['msRequestFullscreen']);
                    spyOn(fixture.nativeElement, 'querySelector').and.returnValue(domElement);

                    component.enterFullScreen();
                    expect(domElement.msRequestFullscreen).toHaveBeenCalled();
                });
            });
        });

        describe('Download Prompt Dialog', () => {
            let dialogOpenSpy: jasmine.Spy;

            beforeEach(() => {
                appConfigService.config = {
                    ...appConfigService.config,
                    viewer: {
                        enableDownloadPrompt: true,
                        enableDownloadPromptReminder: true,
                        downloadPromptDelay: 3,
                        downloadPromptReminderDelay: 2
                    }
                };
                dialogOpenSpy = spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(null) } as any);
                component.urlFile = undefined;
                component.clearDownloadPromptTimeouts();
            });

            it('should configure initial timeout to display non responsive dialog when initialising component', () => {
                fixture.detectChanges();
                expect(component.downloadPromptTimer).toBeDefined();
            });

            it('should configure reminder timeout to display non responsive dialog after initial dialog', fakeAsync(() => {
                dialogOpenSpy.and.returnValue({ afterClosed: () => of(DownloadPromptActions.WAIT) } as any);
                fixture.detectChanges();
                tick(3000);
                expect(component.downloadPromptReminderTimer).toBeDefined();
                dialogOpenSpy.and.returnValue({ afterClosed: () => of(null) } as any);
                flush();
                discardPeriodicTasks();
            }));

            it('should show initial non responsive dialog after initial timeout', fakeAsync(() => {
                fixture.detectChanges();
                tick(3000);
                fixture.detectChanges();
                expect(dialogOpenSpy).toHaveBeenCalled();
            }));

            it('should not show non responsive dialog if blobFile was provided', fakeAsync(() => {
                component.blobFile = new Blob(['mock content'], { type: 'text/plain' });
                fixture.detectChanges();
                tick(3000);
                fixture.detectChanges();
                expect(dialogOpenSpy).not.toHaveBeenCalled();
            }));

            it('should show reminder non responsive dialog after initial dialog', fakeAsync(() => {
                dialogOpenSpy.and.returnValue({ afterClosed: () => of(DownloadPromptActions.WAIT) } as any);
                fixture.detectChanges();
                tick(3000);
                expect(dialogOpenSpy).toHaveBeenCalled();

                dialogOpenSpy.and.returnValue({ afterClosed: () => of(null) } as any);
                tick(2000);
                expect(dialogOpenSpy).toHaveBeenCalledTimes(2);

                flush();
                discardPeriodicTasks();
            }));

            it('should emit downloadFileEvent when DownloadPromptDialog return DownloadPromptActions.DOWNLOAD on close', fakeAsync(() => {
                dialogOpenSpy.and.returnValue({ afterClosed: () => of(DownloadPromptActions.DOWNLOAD) } as any);
                spyOn(component.downloadFile, 'emit');
                fixture.detectChanges();
                tick(3000);
                fixture.detectChanges();

                expect(component.downloadFile.emit).toHaveBeenCalled();
            }));
        });

        describe('ViewerComponent toolbar separators', () => {
            const getVisibleDividers = () =>
                testingUtils.getAllByCSS('.adf-toolbar-divider').filter((sep) => getComputedStyle(sep.nativeElement).display !== 'none');

            const scenarios: [boolean, any, any, boolean, string, number, string][] = [
                [false, null, null, false, 'Right', 0, 'no elements before fullscreen'],
                [true, null, null, false, 'Right', 1, 'left sidebar only'],
                [false, {}, null, false, 'Right', 0, 'open with only'],
                [false, null, {}, false, 'Right', 0, 'more actions only'],
                [false, null, null, true, 'Left', 0, 'left close button only'],
                [true, {}, {}, true, 'Left', 1, 'all elements present'],
                [false, null, null, false, 'Left', 0, 'no elements at all (left close button not enabled)']
            ];

            scenarios.forEach(
                ([allowLeftSidebar, mnuOpenWith, mnuMoreActions, allowGoBack, closeButtonPosition, expectedSeparatorCount, description]) => {
                    it(`should show ${expectedSeparatorCount} separator(s) when ${description}`, () => {
                        component.allowLeftSidebar = allowLeftSidebar;
                        component.mnuOpenWith = mnuOpenWith;
                        component.mnuMoreActions = mnuMoreActions;
                        component.allowGoBack = allowGoBack;
                        component.closeButtonPosition = CloseButtonPosition[closeButtonPosition as keyof typeof CloseButtonPosition];
                        fixture.detectChanges();

                        expect(getVisibleDividers().length).toBe(expectedSeparatorCount);
                    });
                }
            );
        });
    });
});
