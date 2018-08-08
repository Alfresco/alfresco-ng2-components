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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { VersionListComponent } from './version-list.component';
import { AlfrescoApiService, setupTestBed, CoreModule, AlfrescoApiServiceMock } from '@alfresco/adf-core';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('VersionListComponent', () => {
    let component: VersionListComponent;
    let fixture: ComponentFixture<VersionListComponent>;
    let alfrescoApiService: AlfrescoApiService;
    let dialog: MatDialog;

    const nodeId = 'test-id';
    const versionId = '1.0';

    const versionTest = [
        {
            entry: { name: 'test-file-name', id: '1.0', versionComment: 'test-version-comment' }
        },
        {
            entry: { name: 'test-file-name-two', id: '1.0', versionComment: 'test-version-comment' }
        }
    ];

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            NoopAnimationsModule
        ],
        declarations: [
            VersionListComponent
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VersionListComponent);
        alfrescoApiService = TestBed.get(AlfrescoApiService);
        dialog = TestBed.get(MatDialog);

        component = fixture.componentInstance;
        component.node = { id: nodeId, allowableOperations: ['update'] };

        spyOn(component, 'downloadContent').and.stub();
    });

    it('should raise confirmation dialog on delete', () => {
        fixture.detectChanges();
        component.versions = versionTest;

        spyOn(dialog, 'open').and.returnValue({
            afterClosed() {
                return of(false);
            }
        });

        component.deleteVersion('1');

        expect(dialog.open).toHaveBeenCalled();
    });

    it('should delete the version if user confirms', () => {
        fixture.detectChanges();
        component.versions = versionTest;
        spyOn(dialog, 'open').and.returnValue({
            afterClosed() {
                return of(true);
            }
        });

        spyOn(alfrescoApiService.versionsApi, 'deleteVersion').and.returnValue(Promise.resolve(true));

        component.deleteVersion(versionId);

        expect(dialog.open).toHaveBeenCalled();
        expect(alfrescoApiService.versionsApi.deleteVersion).toHaveBeenCalledWith(nodeId, versionId);
    });

    it('should not delete version if user rejects', () => {
        component.versions = versionTest;

        spyOn(dialog, 'open').and.returnValue({
            afterClosed() {
                return of(false);
            }
        });

        spyOn(alfrescoApiService.versionsApi, 'deleteVersion').and.returnValue(Promise.resolve(true));

        component.deleteVersion(versionId);

        expect(dialog.open).toHaveBeenCalled();
        expect(alfrescoApiService.versionsApi.deleteVersion).not.toHaveBeenCalled();
    });

    it('should reload and raise deleted event', (done) => {
        spyOn(component, 'loadVersionHistory').and.stub();
        component.deleted.subscribe(() => {
            expect(component.loadVersionHistory).toHaveBeenCalled();
            done();
        });
        fixture.detectChanges();
        component.onVersionDeleted({});
    });

    describe('Version history fetching', () => {

        it('should use loading bar', () => {
            spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and
                .callFake(() => Promise.resolve({ list: { entries: versionTest } }));

            let loadingProgressBar = fixture.debugElement.query(By.css('[data-automation-id="version-history-loading-bar"]'));
            expect(loadingProgressBar).toBeNull();

            component.ngOnChanges();
            fixture.detectChanges();

            loadingProgressBar = fixture.debugElement.query(By.css('[data-automation-id="version-history-loading-bar"]'));
            expect(loadingProgressBar).not.toBeNull();
        });

        it('should load the versions for a given id', () => {
            spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and
                .callFake(() => Promise.resolve({ list: { entries: versionTest } }));

            component.ngOnChanges();
            fixture.detectChanges();

            expect(alfrescoApiService.versionsApi.listVersionHistory).toHaveBeenCalledWith(nodeId);
        });

        it('should show the versions after loading', (done) => {
            fixture.detectChanges();
            spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and.callFake(() => {
                return Promise.resolve({
                    list: {
                        entries: [
                            {
                                entry: { name: 'test-file-name', id: '1.0', versionComment: 'test-version-comment' }
                            }
                        ]
                    }
                });
            });

            component.ngOnChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let versionFileName = fixture.debugElement.query(By.css('.adf-version-list-item-name')).nativeElement.innerText;
                let versionIdText = fixture.debugElement.query(By.css('.adf-version-list-item-version')).nativeElement.innerText;
                let versionComment = fixture.debugElement.query(By.css('.adf-version-list-item-comment')).nativeElement.innerText;

                expect(versionFileName).toBe('test-file-name');
                expect(versionIdText).toBe('1.0');
                expect(versionComment).toBe('test-version-comment');
                done();
            });
        });

        it('should NOT show the versions comments if input property is set not to show them', (done) => {
            spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and
                .callFake(() => Promise.resolve(
                    {
                        list: {
                            entries: [
                                {
                                    entry: { name: 'test-file-name', id: '1.0', versionComment: 'test-version-comment' }
                                }
                            ]
                        }
                    }
                ));

            component.showComments = false;
            fixture.detectChanges();

            component.ngOnChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                let versionCommentEl = fixture.debugElement.query(By.css('.adf-version-list-item-comment'));

                expect(versionCommentEl).toBeNull();
                done();
            });
        });

        it('should be able to download a version', () => {
            const versionEntry = {
                entry: {
                    name: 'test-file-name',
                    id: '1.0',
                    versionComment: 'test-version-comment'
                }
            };
            spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and.returnValue(Promise.resolve({ list: { entries: [versionEntry] } }));
            spyOn(alfrescoApiService.contentApi, 'getContentUrl').and.returnValue('the/download/url');

            fixture.detectChanges();

            component.downloadVersion('1.0');
            expect(alfrescoApiService.contentApi.getContentUrl).toHaveBeenCalledWith(nodeId, true);
        });

        it('should NOT be able to download a version if configured so', () => {
            const versionEntry = {
                entry: {
                    name: 'test-file-name',
                    id: '1.0',
                    versionComment: 'test-version-comment'
                }
            };
            spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and
                .callFake(() => Promise.resolve({ list: { entries: [versionEntry] } }));
            const spyOnDownload = spyOn(alfrescoApiService.contentApi, 'getContentUrl').and.stub();

            component.allowDownload = false;
            fixture.detectChanges();

            component.downloadVersion('1.0');
            expect(spyOnDownload).not.toHaveBeenCalled();
        });

    });

    describe('Version restoring', () => {

        it('should reload and raise version-restored DOM event', (done) => {
            spyOn(component, 'loadVersionHistory').and.stub();
            component.restored.subscribe(() => {
                expect(component.loadVersionHistory).toHaveBeenCalled();
                done();
            });
            fixture.detectChanges();
            component.onVersionRestored({});
        });

        it('should restore version only when restore allowed', () => {
            component.node.allowableOperations = [];
            spyOn(alfrescoApiService.versionsApi, 'revertVersion').and.stub();
            component.restore('1');
            expect(alfrescoApiService.versionsApi.revertVersion).not.toHaveBeenCalled();
        });

        it('should load the versions for a given id', () => {
            fixture.detectChanges();
            component.versions = versionTest;

            const spyOnRevertVersion = spyOn(alfrescoApiService.versionsApi, 'revertVersion').and
                .callFake(() => Promise.resolve(
                    { entry: { name: 'test-file-name', id: '1.0', versionComment: 'test-version-comment' } }));

            component.restore(versionId);

            expect(spyOnRevertVersion).toHaveBeenCalledWith(nodeId, versionId, { majorVersion: true, comment: '' });
        });

        it('should reload the version list after a version restore', (done) => {
            fixture.detectChanges();
            component.versions = versionTest;

            const spyOnListVersionHistory = spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and
                .callFake(() => Promise.resolve({ list: { entries: versionTest } }));
            spyOn(alfrescoApiService.versionsApi, 'revertVersion').and.callFake(() => Promise.resolve());

            component.restore(versionId);

            fixture.whenStable().then(() => {
                expect(spyOnListVersionHistory).toHaveBeenCalledTimes(1);
                done();
            });
        });
    });

    describe('Actions buttons', () => {

        describe('showActions', () => {

            beforeEach(() => {
                fixture.detectChanges();
                component.node = { id: nodeId };
                spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and.callFake(() => {
                    return Promise.resolve({
                        list: {
                            entries: [
                                {
                                    entry: { name: 'test-file-name', id: '1.0', versionComment: 'test-version-comment' }
                                }
                            ]
                        }
                    });
                });

                component.ngOnChanges();
            });

            it('should show Actions if showActions is true', (done) => {
                component.versions = versionTest;

                component.showActions = true;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let menuButton = fixture.nativeElement.querySelector('[id="adf-version-list-action-menu-button-1.0"]');

                    expect(menuButton).not.toBeNull();
                    done();
                });
            });

            it('should hide Actions if showActions is false', (done) => {
                component.showActions = false;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let menuButton = fixture.nativeElement.querySelector('[id="adf-version-list-action-menu-button-1.0"]');

                    expect(menuButton).toBeNull();
                    done();
                });
            });
        });

        describe('disabled', () => {

            beforeEach(() => {
                fixture.detectChanges();
                component.node = { id: nodeId };
                spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and.callFake(() => {
                    return Promise.resolve({
                        list: {
                            entries: [
                                {
                                    entry: { name: 'test-file-two', id: '1.1', versionComment: 'test-version-comment' }
                                },
                                {
                                    entry: { name: 'test-file-name', id: '1.0', versionComment: 'test-version-comment' }
                                }
                            ]
                        }
                    });
                });

                component.ngOnChanges();
            });

            it('should disable delete action if is not allowed', (done) => {
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let menuButton = fixture.nativeElement.querySelector('[id="adf-version-list-action-menu-button-1.1"]');
                    menuButton.click();

                    let deleteButton: any = document.querySelector('[id="adf-version-list-action-delete-1.1"]');

                    expect(deleteButton.disabled).toBe(true);
                    done();
                });
            });

            it('should disable restore action if is not allowed', (done) => {
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let menuButton = fixture.nativeElement.querySelector('[id="adf-version-list-action-menu-button-1.1"]');
                    menuButton.click();

                    let restoreButton: any = document.querySelector('[id="adf-version-list-action-restore-1.1"]');

                    expect(restoreButton.disabled).toBe(true);
                    done();
                });
            });
        });

        describe('enabled', () => {

            beforeEach(() => {
                fixture.detectChanges();
                component.node = { id: nodeId, allowableOperations: ['update', 'delete'] };
                spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and.callFake(() => {
                    return Promise.resolve({
                        list: {
                            entries: [
                                {
                                    entry: { name: 'test-file-name', id: '1.1', versionComment: 'test-version-comment' }
                                },
                                {
                                    entry: { name: 'test-file-name', id: '1.0', versionComment: 'test-version-comment' }
                                }
                            ]
                        }
                    });
                });

                component.ngOnChanges();
            });

            it('should enable delete action if is allowed', (done) => {
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let menuButton = fixture.nativeElement.querySelector('[id="adf-version-list-action-menu-button-1.1"]');
                    menuButton.click();

                    let deleteButton: any = document.querySelector('[id="adf-version-list-action-delete-1.1"]');

                    expect(deleteButton.disabled).toBe(false);
                    done();
                });
            });

            it('should enable restore action if is allowed', (done) => {
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let menuButton = fixture.nativeElement.querySelector('[id="adf-version-list-action-menu-button-1.1"]');
                    menuButton.click();

                    let restoreButton: any = document.querySelector('[id="adf-version-list-action-restore-1.1"]');

                    expect(restoreButton.disabled).toBe(false);
                    done();
                });
            });
        });
    });

});
