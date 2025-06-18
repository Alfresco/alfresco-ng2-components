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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { VersionListComponent, VersionListDataSource } from './version-list.component';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Node, NodeEntry, VersionEntry, Version } from '@alfresco/js-api';
import { ContentTestingModule } from '../testing/content.testing.module';
import { ContentVersionService } from './content-version.service';
import { take } from 'rxjs/operators';
import { CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';

describe('VersionListComponent', () => {
    let component: VersionListComponent;
    let fixture: ComponentFixture<VersionListComponent>;
    let dialog: MatDialog;
    let contentVersionService: ContentVersionService;

    const nodeId = 'test-id';
    const versionId = '1.0';

    const versionTest = [
        new VersionEntry({ entry: new Version({ name: 'test-file-name', id: '1.0', versionComment: 'test-version-comment' }) }),
        new VersionEntry({ entry: new Version({ name: 'test-file-name-two', id: '1.0', versionComment: 'test-version-comment' }) })
    ];

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
        fixture = TestBed.createComponent(VersionListComponent);
        dialog = TestBed.inject(MatDialog);
        contentVersionService = TestBed.inject(ContentVersionService);

        component = fixture.componentInstance;
        component.node = { id: nodeId, allowableOperations: ['update'] } as Node;
        component.isLoading = false;

        spyOn(component, 'downloadContent').and.stub();
        spyOn(component.nodesApi, 'getNode').and.returnValue(Promise.resolve(new NodeEntry({ entry: new Node({ id: 'nodeInfoId' }) })));
        spyOn(VersionListDataSource.prototype, 'getNextBatch').and.callFake(() => of(versionTest));
        spyOn(component.versionsApi, 'listVersionHistory').and.callFake(() => Promise.resolve({ list: { entries: versionTest } }));
    });

    it('should raise confirmation dialog on delete', () => {
        fixture.detectChanges();

        spyOn(dialog, 'open').and.returnValue({
            afterClosed: () => of(false)
        } as any);

        component.deleteVersion('1');

        expect(dialog.open).toHaveBeenCalled();
    });

    it('should delete the version if user confirms', async () => {
        spyOn(dialog, 'open').and.returnValue({
            afterClosed: () => of(true)
        } as any);
        spyOn(component.versionsApi, 'deleteVersion').and.returnValue(Promise.resolve());

        fixture.detectChanges();
        component.deleteVersion(versionId);

        expect(dialog.open).toHaveBeenCalled();
        expect(component.versionsApi.deleteVersion).toHaveBeenCalledWith(nodeId, versionId);
    });

    it('should not delete version if user rejects', () => {
        spyOn(dialog, 'open').and.returnValue({
            afterClosed: () => of(false)
        } as any);

        spyOn(component.versionsApi, 'deleteVersion').and.returnValue(Promise.resolve());
        fixture.detectChanges();
        component.deleteVersion(versionId);

        expect(dialog.open).toHaveBeenCalled();
        expect(component.versionsApi.deleteVersion).not.toHaveBeenCalled();
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
        it('should use loading bar', (done) => {
            fixture.detectChanges();

            let loadingProgressBar = fixture.debugElement.query(By.css('[data-automation-id="version-history-loading-bar"]'));
            expect(loadingProgressBar).toBeNull();

            component.versionsDataSource.isLoading.pipe(take(1)).subscribe(() => {
                fixture.detectChanges();
                loadingProgressBar = fixture.debugElement.query(By.css('[data-automation-id="version-history-loading-bar"]'));
                expect(loadingProgressBar).not.toBeNull();
                done();
            });

            component.ngOnChanges();
        });

        it('should load the versions for a given id', () => {
            fixture.detectChanges();
            spyOn(component.versionsDataSource, 'reset');

            component.ngOnChanges();
            fixture.detectChanges();

            expect(component.versionsDataSource.reset).toHaveBeenCalled();
            expect(component.versionsDataSource.getNextBatch).toHaveBeenCalled();
        });

        it('should show the versions after loading', (done) => {
            fixture.detectChanges();
            component.ngOnChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const versionFileName = fixture.debugElement.query(By.css('.adf-version-list-item-name')).nativeElement.innerText;
                const versionIdText = fixture.debugElement.query(By.css('.adf-version-list-item-version')).nativeElement.innerText;
                const versionComment = fixture.debugElement.query(By.css('.adf-version-list-item-comment')).nativeElement.innerText;

                expect(versionFileName).toBe('test-file-name');
                expect(versionIdText).toBe('1.0');
                expect(versionComment.trim()).toBe('test-version-comment');
                done();
            });
        });

        it('should NOT show the versions comments if input property is set not to show them', (done) => {
            component.showComments = false;
            fixture.detectChanges();

            component.ngOnChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const versionCommentEl = fixture.debugElement.query(By.css('.adf-version-list-item-comment'));

                expect(versionCommentEl).toBeNull();
                done();
            });
        });

        it('should be able to download a version', () => {
            spyOn(contentVersionService.contentApi, 'getContentUrl').and.returnValue('the/download/url');

            fixture.detectChanges();

            component.downloadVersion('1.0');
            expect(contentVersionService.contentApi.getContentUrl).toHaveBeenCalledWith(nodeId, true);
        });

        it('should be able to view a version', () => {
            spyOn(component.viewVersion, 'emit');
            component.onViewVersion('1.0');
            fixture.detectChanges();
            expect(component.viewVersion.emit).toHaveBeenCalledWith('1.0');
        });

        it('should NOT be able to download a version if configured so', () => {
            const spyOnDownload = spyOn(component.contentApi, 'getContentUrl').and.stub();

            component.allowDownload = false;
            fixture.detectChanges();

            component.downloadVersion('1.0');
            expect(spyOnDownload).not.toHaveBeenCalled();
        });
    });

    describe('Version restoring', () => {
        it('should restore version only when restore allowed', () => {
            component.node.allowableOperations = [];
            spyOn(component.versionsApi, 'revertVersion').and.stub();
            component.restore('1');
            expect(component.versionsApi.revertVersion).not.toHaveBeenCalled();
        });

        it('should load the versions for a given id', async () => {
            fixture.detectChanges();
            const spyOnRevertVersion = spyOn(component.versionsApi, 'revertVersion').and.callFake(() => Promise.resolve(versionTest[0]));
            const spyOnOnVersionRestored = spyOn(component, 'onVersionRestored').and.stub();
            component.restore(versionId);

            await fixture.whenStable();

            expect(spyOnRevertVersion).toHaveBeenCalledWith(nodeId, versionId, { majorVersion: true, comment: '' });
            expect(spyOnOnVersionRestored).toHaveBeenCalled();
        });

        it('should get node info after restoring the node', fakeAsync(() => {
            fixture.detectChanges();

            spyOn(component.versionsApi, 'revertVersion').and.callFake(() => Promise.resolve(versionTest[0]));

            component.restore(versionId);
            fixture.detectChanges();
            tick();

            expect(component.nodesApi.getNode).toHaveBeenCalled();
        }));

        it('should emit with node info data', fakeAsync(() => {
            fixture.detectChanges();

            spyOn(component.versionsApi, 'revertVersion').and.callFake(() => Promise.resolve(versionTest[0]));

            spyOn(component.restored, 'emit');

            component.restore(versionId);
            fixture.detectChanges();
            tick();

            expect(component.restored.emit).toHaveBeenCalledWith(new Node({ id: 'nodeInfoId' }));
        }));

        it('should reload the version list after a version restore', fakeAsync(() => {
            fixture.detectChanges();

            spyOn(component.versionsApi, 'revertVersion').and.callFake(() => Promise.resolve(null));
            spyOn(component.versionsDataSource, 'reset');

            component.restore(versionId);
            fixture.detectChanges();
            tick();

            expect(component.versionsDataSource.reset).toHaveBeenCalled();
            expect(component.versionsDataSource.getNextBatch).toHaveBeenCalled();
        }));
    });

    describe('Actions buttons', () => {
        const testDeleteButtonVisibility = (done: DoneFn, visible = true) => {
            fixture.whenStable().then(() => {
                getActionMenuButton('1.1').click();
                expect(getDeleteButton() !== null).toBe(visible);
                done();
            });
        };

        const getActionMenuButton = (version = '1.0'): HTMLButtonElement => {
            fixture.detectChanges();
            return fixture.debugElement.query(By.css(`[id="adf-version-list-action-menu-button-${version}"]`))?.nativeElement;
        };

        const getRestoreButton = (version = '1.0'): HTMLButtonElement => {
            getActionMenuButton(version).click();
            return fixture.debugElement.query(By.css(`[id="adf-version-list-action-restore-${version}"]`))?.nativeElement;
        };

        const getDeleteButton = (version = '1.1') => fixture.debugElement.query(By.css(`[id="adf-version-list-action-delete-${version}"]`));

        beforeEach(() => {
            fixture.detectChanges();
            versionTest[1].entry.id = '1.1';
        });

        describe('showActions', () => {
            beforeEach(() => {
                component.node = new Node({ id: nodeId });
                component.ngOnChanges();
            });

            it('should show Actions if showActions is true', (done) => {
                component.showActions = true;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(getActionMenuButton()).toBeDefined();
                    done();
                });
            });

            it('should hide Actions if showActions is false', (done) => {
                component.showActions = false;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(getActionMenuButton()).toBeUndefined();
                    done();
                });
            });
        });

        describe('disabled', () => {
            beforeEach(() => {
                component.node = { id: nodeId } as Node;
                component.ngOnChanges();
            });

            it('should disable delete action if is not allowed', (done) => {
                fixture.whenStable().then(() => {
                    getActionMenuButton('1.1').click();

                    const deleteButton: any = document.querySelector('[id="adf-version-list-action-delete-1.1"]');

                    expect(deleteButton.disabled).toBe(true);
                    done();
                });
            });

            it('should disable restore action if is not allowed', (done) => {
                fixture.whenStable().then(() => {
                    expect(getRestoreButton().disabled).toBeTrue();
                    done();
                });
            });

            it('should disable restore action for the latest version', (done) => {
                fixture.whenStable().then(() => {
                    expect(getRestoreButton('1.1').disabled).toBeTrue();
                    done();
                });
            });
        });

        describe('enabled', () => {
            beforeEach(() => {
                component.node = { id: nodeId, allowableOperations: ['update', 'delete'] } as Node;
                component.ngOnChanges();
            });

            it('should enable delete action if is allowed', (done) => {
                fixture.whenStable().then(() => {
                    getActionMenuButton('1.1').click();

                    const deleteButton: any = document.querySelector('[id="adf-version-list-action-delete-1.1"]');

                    expect(deleteButton.disabled).toBe(false);
                    done();
                });
            });

            it('should enable restore action if is allowed', (done) => {
                fixture.whenStable().then(() => {
                    expect(getRestoreButton('1.1').disabled).toBeFalse();
                    done();
                });
            });
        });

        describe('Delete action', () => {
            beforeEach(() => {
                component.node = { id: nodeId, allowableOperations: ['update', 'delete'] } as Node;
            });

            it('should show delete action by default', (done) => {
                fixture.detectChanges();
                testDeleteButtonVisibility(done);
            });

            it('should show delete action if allowVersionDelete is true', (done) => {
                component.allowVersionDelete = true;
                fixture.detectChanges();
                testDeleteButtonVisibility(done);
            });

            it('should hide delete action if allowVersionDelete is false', (done) => {
                component.allowVersionDelete = false;
                fixture.detectChanges();
                testDeleteButtonVisibility(done, false);
            });
        });
    });

    describe('Virtual list viewport', () => {
        let virtualListViewport: CdkFixedSizeVirtualScroll;

        beforeEach(() => {
            fixture.detectChanges();
            virtualListViewport = fixture.debugElement.query(By.directive(CdkFixedSizeVirtualScroll)).injector.get(CdkFixedSizeVirtualScroll);
        });

        it('should have assigned correct minBufferPx', () => {
            expect(virtualListViewport.minBufferPx).toBe(440);
        });

        it('should have assigned correct maxBufferPx', () => {
            expect(virtualListViewport.maxBufferPx).toBe(528);
        });
    });
});
