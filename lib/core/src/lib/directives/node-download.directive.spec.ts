/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { Component, DebugElement } from '@angular/core';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreModule } from '../core.module';
import { DialogModule } from '../dialogs/dialog.module';
import { AlfrescoApiServiceMock } from '../mock/alfresco-api.service.mock';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { NodeDownloadDirective } from './node-download.directive';

@Component({
    template: '<div [adfNodeDownload]="selection"></div>'
})
class TestComponent {
    selection;
}

describe('NodeDownloadDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let dialog: MatDialog;
    let apiService: AlfrescoApiService;
    let contentService;
    let dialogSpy;

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            DialogModule
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ],
        declarations: [
            TestComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.query(By.directive(NodeDownloadDirective));
        dialog = TestBed.get(MatDialog);
        apiService = TestBed.get(AlfrescoApiService);
        contentService = apiService.getInstance().content;
        dialogSpy = spyOn(dialog, 'open');
    });

    it('should not download node when selection is empty', () => {
        spyOn(apiService, 'getInstance');
        component.selection = [];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(apiService.getInstance).not.toHaveBeenCalled();
    });

    it('should not download zip when selection has no nodes', () => {
        component.selection = [];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(dialogSpy).not.toHaveBeenCalled();
    });

    it('should download selected node as file', () => {
        spyOn(contentService, 'getContentUrl');
        const node = { entry: { id: 'node-id', isFile: true } };
        component.selection = [node];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(contentService.getContentUrl).toHaveBeenCalledWith(node.entry.id, true);
    });

    it('should download selected shared node as file', () => {
        spyOn(contentService, 'getContentUrl');
        const node = { entry: { nodeId: 'shared-node-id', isFile: true } };
        component.selection = [node];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(contentService.getContentUrl).toHaveBeenCalledWith(node.entry.nodeId, true);
    });

    it('should download selected files nodes as zip', () => {
        const node1 = { entry: { id: 'node-1' } };
        const node2 = { entry: { id: 'node-2' } };
        component.selection = [node1, node2];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(dialogSpy.calls.argsFor(0)[1].data).toEqual({ nodeIds: [ 'node-1', 'node-2' ] });
    });

    it('should download selected shared files nodes as zip', () => {
        const node1 = { entry: { nodeId: 'shared-node-1' } };
        const node2 = { entry: { nodeId: 'shared-node-2' } };
        component.selection = [node1, node2];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(dialogSpy.calls.argsFor(0)[1].data).toEqual({ nodeIds: [ 'shared-node-1', 'shared-node-2' ] });
    });

    it('should download selected folder node as zip', () => {
        const node = { entry: { isFolder: true, id: 'node-id' } };
        component.selection = [node];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(dialogSpy.calls.argsFor(0)[1].data).toEqual({ nodeIds: [ 'node-id' ] });
    });

    it('should create link element to download file node', () => {
        const dummyLinkElement = {
            download: null,
            href: null,
            click: () => null,
            style: {
                display: null
            }
        };

        const node = { entry: { name: 'dummy', isFile: true, id: 'node-id' } };

        spyOn(contentService, 'getContentUrl').and.returnValue('somewhere-over-the-rainbow');
        spyOn(document, 'createElement').and.returnValue(dummyLinkElement);
        spyOn(document.body, 'appendChild').and.stub();
        spyOn(document.body, 'removeChild').and.stub();

        component.selection = [node];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(document.createElement).toHaveBeenCalled();
        expect(dummyLinkElement.download).toBe('dummy');
        expect(dummyLinkElement.href).toContain('somewhere-over-the-rainbow');
    });
});
