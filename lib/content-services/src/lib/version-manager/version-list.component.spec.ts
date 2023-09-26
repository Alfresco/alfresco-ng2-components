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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { VersionListComponent } from './version-list.component';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Node, VersionPaging, NodeEntry, VersionEntry, Version } from '@alfresco/js-api';
import { ContentTestingModule } from '../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ContentVersionService } from './content-version.service';

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
            imports: [TranslateModule.forRoot(), ContentTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
        fixture = TestBed.createComponent(VersionListComponent);
        dialog = TestBed.inject(MatDialog);
        contentVersionService = TestBed.inject(ContentVersionService);

        component = fixture.componentInstance;
        component.node = { id: nodeId, allowableOperations: ['update'] } as Node;

        spyOn(component, 'downloadContent').and.stub();
        spyOn(component.nodesApi, 'getNode').and.returnValue(Promise.resolve(new NodeEntry({ entry: new Node({ id: 'nodeInfoId' }) })));
    });

    it('should raise confirmation dialog on delete', () => {
        fixture.detectChanges();
        component.versions = versionTest;

        spyOn(dialog, 'open').and.returnValue({
            afterClosed: () => of(false)
        } as any);

        component.deleteVersion('1');

        expect(dialog.open).toHaveBeenCalled();
    });

    it('should delete the version if user confirms', () => {
        fixture.detectChanges();
        component.versions = versionTest;
        spyOn(dialog, 'open').and.returnValue({
            afterClosed: () => of(true)
        } as any);

        spyOn(component.versionsApi, 'deleteVersion').and.returnValue(Promise.resolve());

        component.deleteVersion(versionId);

        expect(dialog.open).toHaveBeenCalled();
        expect(component.versionsApi.deleteVersion).toHaveBeenCalledWith(nodeId, versionId);
    });

    it('should not delete version if user rejects', () => {
        component.versions = versionTest;

        spyOn(dialog, 'open').and.returnValue({
            afterClosed: () => of(false)
        } as any);

        spyOn(component.versionsApi, 'deleteVersion').and.returnValue(Promise.resolve());

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
        it('should use loading bar', () => {
            spyOn(component.versionsApi, 'listVersionHistory').and.callFake(() => Promise.resolve({ list: { entries: versionTest } }));

            let loadingProgressBar = fixture.debugElement.query(By.css('[data-automation-id="version-history-loading-bar"]'));
            expect(loadingProgressBar).toBeNull();

            component.ngOnChanges();
            fixture.detectChanges();

            loadingProgressBar = fixture.debugElement.query(By.css('[data-automation-id="version-history-loading-bar"]'));
            expect(loadingProgressBar).not.toBeNull();
        });

        it('should load the versions for a given id', () => {
            spyOn(component.versionsApi, 'listVersionHistory').and.callFake(() => Promise.resolve({ list: { entries: versionTest } }));

            component.ngOnChanges();
            fixture.detectChanges();

            expect(component.versionsApi.listVersionHistory).toHaveBeenCalledWith(nodeId);
        });

        it('should show the versions after loading', (done) => {
            fixture.detectChanges();
            spyOn(component.versionsApi, 'listVersionHistory').and.callFake(() =>
                Promise.resolve(
                    new VersionPaging({
                        list: {
                            entries: [versionTest[0]]
                        }
                    })
                )
            );

            component.ngOnChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const versionFileName = fixture.debugElement.query(By.css('.adf-version-list-item-name')).nativeElement.innerText;
                const versionIdText = fixture.debugElement.query(By.css('.adf-version-list-item-version')).nativeElement.innerText;
                const versionComment = fixture.debugElement.query(By.css('.adf-version-list-item-comment')).nativeElement.innerText;

                expect(versionFileName).toBe('test-file-name');
                expect(versionIdText).toBe('1.0');
                expect(versionComment).toBe('test-version-comment');
                done();
            });
        });

        it('should NOT show the versions comments if input property is set not to show them', (done) => {
            spyOn(component.versionsApi, 'listVersionHistory').and.callFake(() =>
                Promise.resolve(
                    new VersionPaging({
                        list: {
                            entries: [versionTest[0]]
                        }
                    })
                )
            );

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
            spyOn(component.versionsApi, 'listVersionHistory').and.returnValue(
                Promise.resolve(new VersionPaging({ list: { entries: [versionTest[0]] } }))
            );
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
            spyOn(component.versionsApi, 'listVersionHistory').and.callFake(() =>
                Promise.resolve(new VersionPaging({ list: { entries: [versionTest[0]] } }))
            );
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

        it('should load the versions for a given id', () => {
            fixture.detectChanges();
            component.versions = versionTest;

            const spyOnRevertVersion = spyOn(component.versionsApi, 'revertVersion').and.callFake(() => Promise.resolve(versionTest[0]));

            component.restore(versionId);

            expect(spyOnRevertVersion).toHaveBeenCalledWith(nodeId, versionId, { majorVersion: true, comment: '' });
        });

        it('should get node info after restoring the node', fakeAsync(() => {
            fixture.detectChanges();
            component.versions = versionTest;
            spyOn(component.versionsApi, 'listVersionHistory').and.callFake(() => Promise.resolve({ list: { entries: versionTest } }));

            spyOn(component.versionsApi, 'revertVersion').and.callFake(() => Promise.resolve(versionTest[0]));

            component.restore(versionId);
            fixture.detectChanges();
            tick();

            expect(component.nodesApi.getNode).toHaveBeenCalled();
        }));

        it('should emit with node info data', fakeAsync(() => {
            fixture.detectChanges();
            component.versions = versionTest;
            spyOn(component.versionsApi, 'listVersionHistory').and.callFake(() => Promise.resolve({ list: { entries: versionTest } }));

            spyOn(component.versionsApi, 'revertVersion').and.callFake(() => Promise.resolve(versionTest[0]));

            spyOn(component.restored, 'emit');

            component.restore(versionId);
            fixture.detectChanges();
            tick();

            expect(component.restored.emit).toHaveBeenCalledWith(new Node({ id: 'nodeInfoId' }));
        }));

        it('should reload the version list after a version restore', fakeAsync(() => {
            fixture.detectChanges();
            component.versions = versionTest;

            const spyOnListVersionHistory = spyOn(component.versionsApi, 'listVersionHistory').and.callFake(() =>
                Promise.resolve({ list: { entries: versionTest } })
            );
            spyOn(component.versionsApi, 'revertVersion').and.callFake(() => Promise.resolve(null));

            component.restore(versionId);
            fixture.detectChanges();
            tick();

            expect(spyOnListVersionHistory).toHaveBeenCalledTimes(1);
        }));
    });

    describe('Actions buttons', () => {
        const getActionMenuButton = (version = '1.0'): HTMLButtonElement => {
            fixture.detectChanges();
            return fixture.debugElement.query(By.css(`[id="adf-version-list-action-menu-button-${version}"]`))?.nativeElement;
        };

        const getRestoreButton = (version = '1.0'): HTMLButtonElement => {
            getActionMenuButton(version).click();
            return fixture.debugElement.query(By.css(`[id="adf-version-list-action-restore-${version}"]`))?.nativeElement;
        };

        beforeEach(() => {
            fixture.detectChanges();
            versionTest[1].entry.id = '1.1';
            spyOn(component.versionsApi, 'listVersionHistory').and.callFake(() =>
                Promise.resolve(
                    new VersionPaging({
                        list: {
                            entries: versionTest
                        }
                    })
                )
            );
        });

        describe('showActions', () => {
            beforeEach(() => {
                component.node = new Node({ id: nodeId });
                component.ngOnChanges();
            });

            it('should show Actions if showActions is true', (done) => {
                component.versions = versionTest;

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
    });
});
