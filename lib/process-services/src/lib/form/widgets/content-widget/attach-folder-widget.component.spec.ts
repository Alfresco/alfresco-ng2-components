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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AttachFolderWidgetComponent } from './attach-folder-widget.component';
import {
    FormFieldModel,
    FormModel,
    setupTestBed
} from '@alfresco/adf-core';
import { ContentNodeDialogService, NodesApiService } from '@alfresco/adf-content-services';
import { of } from 'rxjs';
import { Node } from '@alfresco/js-api';
import { ProcessTestingModule } from '../../../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';

const fakeMinimalNode: Node = {
    id: 'fake',
    name: 'fake-name'
} as Node;

const definedSourceParams = {
    folderSource : {
        serviceId: 'goofy-sources',
        name: 'pippo-baudo',
        selectedFolder: {
            accountId: 'goku-share-account-id',
            pathId: 'fake-pippo-baudo-id'
        }
    }
};

describe('AttachFolderWidgetComponent', () => {

    let widget: AttachFolderWidgetComponent;
    let fixture: ComponentFixture<AttachFolderWidgetComponent>;
    let element: HTMLInputElement;
    let contentNodeDialogService: ContentNodeDialogService;
    let nodeService: NodesApiService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AttachFolderWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        contentNodeDialogService = TestBed.inject(ContentNodeDialogService);
        nodeService = TestBed.inject(NodesApiService);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should be rendered correctly', () => {
        expect(widget).not.toBeNull();
        widget.field = new FormFieldModel(new FormModel(), {
            type: 'select-folder',
            id: 'fake-widget',
            value: null
        });
        fixture.detectChanges();
        expect(element.querySelector('#folder-fake-widget-button')).toBeDefined();
        expect(element.querySelector('#folder-fake-widget-button')).not.toBeNull();
    });

    it('should show the folder selected by content node', async () => {
        spyOn(contentNodeDialogService, 'openFolderBrowseDialogBySite').and.returnValue(of([fakeMinimalNode]));
        expect(widget).not.toBeNull();
        widget.field = new FormFieldModel(new FormModel(), {
            type: 'select-folder',
            id: 'fake-widget',
            value: null
        });
        fixture.detectChanges();
        await fixture.whenStable();

        fixture.debugElement.query(By.css('#folder-fake-widget-button')).nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#folder-fake-widget')).not.toBeNull();
    });

    it('should show the folder selected by content node opening on a configured folder', async () => {
        spyOn(contentNodeDialogService, 'openFolderBrowseDialogByFolderId').and.returnValue(of([fakeMinimalNode]));
        expect(widget).not.toBeNull();
        widget.field = new FormFieldModel(new FormModel(), {
            type: 'select-folder',
            id: 'fake-widget',
            value: null,
            params: definedSourceParams
        });

        fixture.detectChanges();
        await fixture.whenStable();

        fixture.debugElement.query(By.css('#folder-fake-widget-button')).nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#folder-fake-widget')).not.toBeNull();
    });

    it('should retrieve the node information on init', async () => {
        spyOn(nodeService, 'getNode').and.returnValue(of(fakeMinimalNode));
        expect(widget).not.toBeNull();
        widget.field = new FormFieldModel(new FormModel(), {
            type: 'select-folder',
            id: 'fake-widget',
            value: 'fake-pippo-baudo-id'
        });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#folder-fake-widget')).not.toBeNull();
        expect(element.querySelector('#folder-fake-widget-button')).toBeNull();
    });

    it('should remove the folder via the remove button', async () => {
        spyOn(nodeService, 'getNode').and.returnValue(of(fakeMinimalNode));
        expect(widget).not.toBeNull();
        widget.field = new FormFieldModel(new FormModel(), {
            type: 'select-folder',
            id: 'fake-widget',
            value: 'fake-pippo-baudo-id'
        });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#folder-fake-widget')).not.toBeNull();
        expect(element.querySelector('#folder-fake-widget-button')).toBeNull();
        fixture.debugElement.query(By.css('#folder-fake-widget-remove')).nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#folder-fake-widget')).toBeNull();
    });
});
