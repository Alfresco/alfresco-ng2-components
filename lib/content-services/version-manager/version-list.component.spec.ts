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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { VersionListComponent } from './version-list.component';
import { AlfrescoApiService } from '@alfresco/adf-core';

describe('VersionListComponent', () => {
    let component: VersionListComponent;
    let fixture: ComponentFixture<VersionListComponent>;
    let alfrescoApiService: AlfrescoApiService;

    const nodeId = 'test-id';
    const versionId = '1.0';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                VersionListComponent
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VersionListComponent);
        alfrescoApiService = TestBed.get(AlfrescoApiService);

        component = fixture.componentInstance;
        component.id = nodeId;

        spyOn(component, 'downloadContent').and.stub();
    });

    describe('Version history fetching', () => {

        it('should use loading bar', () => {
            spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and
                .callFake(() => Promise.resolve({ list: { entries: []}}));

            let loadingProgressBar = fixture.debugElement.query(By.css('[data-automation-id="version-history-loading-bar"]'));
            expect(loadingProgressBar).toBeNull();

            component.ngOnChanges();
            fixture.detectChanges();

            loadingProgressBar = fixture.debugElement.query(By.css('[data-automation-id="version-history-loading-bar"]'));
            expect(loadingProgressBar).not.toBeNull();
        });

        it('should load the versions for a given id', () => {
            spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and
                .callFake(() => Promise.resolve({ list: { entries: []}}));

            component.ngOnChanges();
            fixture.detectChanges();

            expect(alfrescoApiService.versionsApi.listVersionHistory).toHaveBeenCalledWith(nodeId);
        });

        it('should show the versions after loading', (done) => {
            fixture.detectChanges();
            spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and.callFake(() => {
                return Promise.resolve({ list: { entries: [
                    {
                        entry: { name: 'test-file-name', id: '1.0', versionComment: 'test-version-comment' }
                    }
                ]}});
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
            const versionEntry =  { entry: { name: 'test-file-name', id: '1.0', versionComment: 'test-version-comment' }};
            spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and.returnValue(Promise.resolve({ list: { entries: [ versionEntry ] }}));
            spyOn(alfrescoApiService.contentApi, 'getContentUrl').and.returnValue('the/download/url');

            fixture.detectChanges();

            component.downloadVersion('1.0');
            expect(alfrescoApiService.contentApi.getContentUrl).toHaveBeenCalledWith(nodeId, true);
        });

        it('should NOT be able to download a version if configured so', () => {
            const versionEntry =  { entry: { name: 'test-file-name', id: '1.0', versionComment: 'test-version-comment' }};
            spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and
                .callFake(() => Promise.resolve({ list: { entries: [ versionEntry ] }}));
            const spyOnDownload = spyOn(alfrescoApiService.contentApi, 'getContentUrl').and.stub();

            component.allowDownload = false;
            fixture.detectChanges();

            component.downloadVersion('1.0');
            expect(spyOnDownload).not.toHaveBeenCalled();
        });

    });

    describe('Version restoring', () => {

        it('should load the versions for a given id', () => {
            fixture.detectChanges();
            spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and
                .callFake(() => Promise.resolve({ list: { entries: []}}));
            const spyOnRevertVersion = spyOn(alfrescoApiService.versionsApi, 'revertVersion').and
                .callFake(() => Promise.resolve(
                    { entry: { name: 'test-file-name', id: '1.0', versionComment: 'test-version-comment' }}));

            component.restore(versionId);

            expect(spyOnRevertVersion).toHaveBeenCalledWith(nodeId, versionId, { majorVersion: true, comment: ''});
        });

        it('should reload the version list after a version restore', (done) => {
            fixture.detectChanges();
            const spyOnListVersionHistory = spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and
                .callFake(() => Promise.resolve({ list: { entries: []}}));
            spyOn(alfrescoApiService.versionsApi, 'revertVersion').and.callFake(() => Promise.resolve());

            component.restore(versionId);

            fixture.whenStable().then(() => {
                expect(spyOnListVersionHistory).toHaveBeenCalledTimes(1);
                done();
            });
        });
    });
});
