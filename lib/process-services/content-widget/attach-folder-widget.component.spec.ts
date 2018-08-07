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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AttachFolderWidgetComponent } from './attach-folder-widget.component';
import {
    FormFieldModel,
    FormModel,
    NodesApiService,
    setupTestBed
} from '@alfresco/adf-core';
import { ContentNodeDialogService } from '@alfresco/adf-content-services';
import { of } from 'rxjs';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { ProcessTestingModule } from '../testing/process.testing.module';

const fakeMinimalNode: MinimalNodeEntryEntity = <MinimalNodeEntryEntity> {
    id: 'fake',
    name: 'fake-name'
};

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

/* tslint:disable */
// TODO: crashes because of LogService problem
xdescribe('AttachFolderWidgetComponent', () => {

    let widget: AttachFolderWidgetComponent;
    let fixture: ComponentFixture<AttachFolderWidgetComponent>;
    let element: HTMLInputElement;
    let contentNodeDialogService: ContentNodeDialogService;
    let nodeService: NodesApiService;

    setupTestBed({
        imports: [ProcessTestingModule]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(AttachFolderWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        contentNodeDialogService = TestBed.get(ContentNodeDialogService);
        nodeService = TestBed.get(NodesApiService);
    }));

    afterEach(() => {
        fixture.destroy();
    });

    it('should be able to create the widget', () => {
        expect(widget).not.toBeNull();
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

    it('should show the folder selected by content node', async(() => {
        spyOn(contentNodeDialogService, 'openFolderBrowseDialogBySite').and.returnValue(of([fakeMinimalNode]));
        expect(widget).not.toBeNull();
        widget.field = new FormFieldModel(new FormModel(), {
            type: 'select-folder',
            id: 'fake-widget',
            value: null
        });
        fixture.detectChanges();
        fixture.debugElement.query(By.css('#folder-fake-widget-button')).nativeElement.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(element.querySelector('#folder-fake-widget')).not.toBeNull();
        });
    }));

    it('should show the folder selected by content node opening on a configured folder', async(() => {
        spyOn(contentNodeDialogService, 'openFolderBrowseDialogByFolderId').and.returnValue(of([fakeMinimalNode]));
        expect(widget).not.toBeNull();
        widget.field = new FormFieldModel(new FormModel(), {
            type: 'select-folder',
            id: 'fake-widget',
            value: null,
            params: definedSourceParams
        });
        fixture.detectChanges();
        fixture.debugElement.query(By.css('#folder-fake-widget-button')).nativeElement.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(element.querySelector('#folder-fake-widget')).not.toBeNull();
        });
    }));

    it('should retrieve the node information on init', async(() => {
        spyOn(nodeService, 'getNode').and.returnValue(of(fakeMinimalNode));
        expect(widget).not.toBeNull();
        widget.field = new FormFieldModel(new FormModel(), {
            type: 'select-folder',
            id: 'fake-widget',
            value: 'fake-pippo-baudo-id'
        });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(element.querySelector('#folder-fake-widget')).not.toBeNull();
            expect(element.querySelector('#folder-fake-widget-button')).toBeNull();
        });
    }));

    it('should remove the folder via the remove button', async(() => {
        spyOn(nodeService, 'getNode').and.returnValue(of(fakeMinimalNode));
        expect(widget).not.toBeNull();
        widget.field = new FormFieldModel(new FormModel(), {
            type: 'select-folder',
            id: 'fake-widget',
            value: 'fake-pippo-baudo-id'
        });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(element.querySelector('#folder-fake-widget')).not.toBeNull();
            expect(element.querySelector('#folder-fake-widget-button')).toBeNull();
            fixture.debugElement.query(By.css('#folder-fake-widget-remove')).nativeElement.click();
            fixture.detectChanges();
            expect(element.querySelector('#folder-fake-widget')).toBeNull();
        });
    }));

});
