/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Node, Version, VersionEntry, VersionPaging } from '@alfresco/js-api';
import { VersionManagerComponent } from './version-manager.component';
import { ContentTestingModule } from '../testing/content.testing.module';
import { NodesApiService } from '../common/services/nodes-api.service';

describe('VersionManagerComponent', () => {
    let component: VersionManagerComponent;
    let fixture: ComponentFixture<VersionManagerComponent>;
    let spyOnListVersionHistory: jasmine.Spy;
    let nodesApiService: NodesApiService;

    const expectedComment = 'test-version-comment';
    const node: Node = new Node({
        id: '1234',
        name: 'TEST-NODE',
        isFile: true
    });
    const versionEntry = new VersionEntry({ entry: new Version({ id: '1.0', name: node.name, versionComment: expectedComment }) });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });
        fixture = TestBed.createComponent(VersionManagerComponent);
        component = fixture.componentInstance;
        component.node = node;

        nodesApiService = TestBed.inject(NodesApiService);
        spyOnListVersionHistory = spyOn(component.versionListComponent.versionsApi, 'listVersionHistory').and.callFake(() =>
            Promise.resolve(new VersionPaging({ list: { entries: [versionEntry] } }))
        );
    });

    it('should load the versions for a given node', () => {
        fixture.detectChanges();
        expect(spyOnListVersionHistory).toHaveBeenCalledWith(node.id, { skipCount: 0, maxItems: 100 });
    });

    it('should toggle new version if given a new file as input', () => {
        component.newFileVersion = new File([], 'New file version');
        fixture.detectChanges();
        expect(component.uploadState).toBe('open');
    });

    it('should be able to view a version', () => {
        spyOn(component.viewVersion, 'emit');
        component.onViewVersion('1.0');
        fixture.detectChanges();
        expect(component.viewVersion.emit).toHaveBeenCalledWith('1.0');
    });

    it('should not display comments for versions when configured not to show them', async () => {
        component.showComments = false;

        fixture.detectChanges();
        await fixture.whenStable();

        const versionCommentEl = fixture.debugElement.query(By.css('.adf-version-list-item-comment'));
        expect(versionCommentEl).toBeNull();
    });

    it('should emit success event upon successful upload of a new version', () => {
        fixture.detectChanges();

        const emittedData = { value: { entry: node } };
        let lastValue: Node;
        component.uploadSuccess.subscribe((event) => (lastValue = event));
        component.onUploadSuccess(emittedData);
        expect(lastValue).toBe(node);
    });

    it('should emit nodeUpdated event upon successful upload of a new version', () => {
        fixture.detectChanges();

        let lastValue: Node;
        nodesApiService.nodeUpdated.subscribe((res) => (lastValue = res));

        const emittedData = { value: { entry: node } };
        component.onUploadSuccess(emittedData);
        expect(lastValue).toEqual(node);
    });

    describe('Animation', () => {
        it('should upload button be hide by default', () => {
            fixture.detectChanges();

            expect(component.uploadState).toEqual('close');
        });

        it('should upload button be visible after click on add new version button', () => {
            fixture.detectChanges();

            const showUploadButton = fixture.debugElement.query(By.css('#adf-show-version-upload-button'));

            showUploadButton.nativeElement.click();

            expect(component.uploadState).toEqual('open');
        });
    });

    describe('Version list', () => {
        it('should have assigned showActions to true by default', () => {
            fixture.detectChanges();

            expect(component.versionListComponent.showActions).toBeTrue();
        });

        it('should have assigned showActions to true if true is passed to showActions for component', () => {
            component.showActions = true;
            fixture.detectChanges();

            expect(component.versionListComponent.showActions).toBeTrue();
        });

        it('should have assigned showActions to false if false is passed to showActions for component', () => {
            component.showActions = false;
            fixture.detectChanges();

            expect(component.versionListComponent.showActions).toBeFalse();
        });

        it('should have assigned allowViewVersions to true by default', () => {
            fixture.detectChanges();

            expect(component.versionListComponent.allowViewVersions).toBeTrue();
        });

        it('should have assigned allowViewVersions to true if true is passed to allowViewVersions for component', () => {
            component.allowViewVersions = true;
            fixture.detectChanges();

            expect(component.versionListComponent.allowViewVersions).toBeTrue();
        });

        it('should have assigned allowViewVersions to false if false is passed to allowViewVersions for component', () => {
            component.allowViewVersions = false;
            fixture.detectChanges();

            expect(component.versionListComponent.allowViewVersions).toBeFalse();
        });

        it('should have assigned allowVersionDelete to true by default', () => {
            fixture.detectChanges();

            expect(component.versionListComponent.allowVersionDelete).toBeTrue();
        });

        it('should have assigned allowVersionDelete to true if true is passed to allowVersionDelete for component', () => {
            component.allowVersionDelete = true;
            fixture.detectChanges();

            expect(component.versionListComponent.allowVersionDelete).toBeTrue();
        });

        it('should have assigned allowVersionDelete to false if false is passed to allowVersionDelete for component', () => {
            component.allowVersionDelete = false;
            fixture.detectChanges();

            expect(component.versionListComponent.allowVersionDelete).toBeFalse();
        });

        it('should have assigned showComments to true by default', () => {
            fixture.detectChanges();

            expect(component.versionListComponent.showComments).toBeTrue();
        });

        it('should have assigned showComments to true if true is passed to showComments for component', () => {
            component.showComments = true;
            fixture.detectChanges();

            expect(component.versionListComponent.showComments).toBeTrue();
        });

        it('should have assigned showComments to false if false is passed to showComments for component', () => {
            component.showComments = false;
            fixture.detectChanges();

            expect(component.versionListComponent.showComments).toBeFalse();
        });

        it('should have assigned allowDownload to true by default', () => {
            fixture.detectChanges();

            expect(component.versionListComponent.showComments).toBeTrue();
        });

        it('should have assigned allowDownload to true if true is passed to allowDownload for component', () => {
            component.allowDownload = true;
            fixture.detectChanges();

            expect(component.versionListComponent.allowDownload).toBeTrue();
        });

        it('should have assigned allowDownload to false if false is passed to allowDownload for component', () => {
            component.allowDownload = false;
            fixture.detectChanges();

            expect(component.versionListComponent.allowDownload).toBeFalse();
        });
    });
});
