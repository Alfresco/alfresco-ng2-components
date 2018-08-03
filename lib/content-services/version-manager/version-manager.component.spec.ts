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
import { AlfrescoApiService, setupTestBed, CoreModule, AlfrescoApiServiceMock } from '@alfresco/adf-core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { VersionManagerComponent } from './version-manager.component';
import { VersionListComponent } from './version-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('VersionManagerComponent', () => {
    let component: VersionManagerComponent;
    let fixture: ComponentFixture<VersionManagerComponent>;
    let spyOnListVersionHistory: jasmine.Spy;
    let alfrescoApiService: AlfrescoApiService;

    const expectedComment = 'test-version-comment';
    const  node: MinimalNodeEntryEntity = {
        id: '1234',
        name: 'TEST-NODE',
        isFile: true
    };
    const versionEntry = {
       entry: {
           id: '1.0',
           name: node.name,
           versionComment: expectedComment
       }
    };

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            NoopAnimationsModule
        ],
        declarations: [
            VersionManagerComponent,
            VersionListComponent
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VersionManagerComponent);
        component = fixture.componentInstance;
        component.node = node;

        alfrescoApiService = TestBed.get(AlfrescoApiService);
        spyOnListVersionHistory = spyOn(alfrescoApiService.versionsApi, 'listVersionHistory').and
            .callFake(() => Promise.resolve({ list: { entries: [ versionEntry ] }}));
    });

    it('should load the versions for a given node', () => {
        fixture.detectChanges();
        expect(spyOnListVersionHistory).toHaveBeenCalledWith(node.id);
    });

    it('should display comments for versions when not configured otherwise', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let versionCommentEl = fixture.debugElement.query(By.css('.adf-version-list-item-comment'));

            expect(versionCommentEl).not.toBeNull();
            expect(versionCommentEl.nativeElement.innerText).toBe(expectedComment);
        });
    }));

    it('should not display comments for versions when configured not to show them', async(() => {
        component.showComments = false;
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let versionCommentEl = fixture.debugElement.query(By.css('.adf-version-list-item-comment'));

            expect(versionCommentEl).toBeNull();
        });
    }));

    it('should emit success event upon successful upload of a new version', async(() => {
        fixture.detectChanges();

        const emittedData = { value: { entry: node }};
        component.uploadSuccess.subscribe(event => {
            expect(event).toBe(node);
        });
        component.onUploadSuccess(emittedData);
    }));

    it('should emit nodeUpdated event upon successful upload of a new version', (done) => {
        fixture.detectChanges();
        alfrescoApiService.nodeUpdated.subscribe(() => {
            done();
        });

        const emittedData = { value: { entry: node }};
        component.onUploadSuccess(emittedData);
    });

    describe('Animation', () => {

        it('should upload button be hide by default', () => {
            fixture.detectChanges();

            expect(component.uploadState).toEqual('close');
        });

        it('should upload button be visible after click on add new version button', () => {
            fixture.detectChanges();

            let showUploadButton = fixture.debugElement.query(By.css('#adf-show-version-upload-button'));

            showUploadButton.nativeElement.click();

            expect(component.uploadState).toEqual('open');
        });

    });
});
