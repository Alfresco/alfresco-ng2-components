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

import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import { NodeLockDirective } from './node-lock.directive';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { NodeActionsService } from '../document-list/services/node-actions.service';
import { ContentNodeDialogService } from '../content-node-selector/content-node-dialog.service';
import { DocumentListService } from '../document-list/services/document-list.service';
import { setupTestBed } from '../../core/testing';
import { CoreModule } from '@alfresco/adf-core';

const fakeNode: MinimalNodeEntryEntity = <MinimalNodeEntryEntity> {
    id: 'fake',
    isFile: true,
    isLocked: false
};

@Component({
    template: '<div [adf-node-lock]="node"></div>'
})
class TestComponent {
    node = null;
}

describe('NodeLock Directive', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let contentNodeDialogService: ContentNodeDialogService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        providers: [
            NodeActionsService,
            ContentNodeDialogService,
            DocumentListService
        ],
        declarations: [
            TestComponent,
            NodeLockDirective
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.query(By.directive(NodeLockDirective));
        contentNodeDialogService = TestBed.get(ContentNodeDialogService);
    });

    it('should call openLockNodeDialog method on click', () => {
        spyOn(contentNodeDialogService, 'openLockNodeDialog');
        component.node = fakeNode;

        fixture.detectChanges();
        element = fixture.debugElement.query(By.directive(NodeLockDirective));
        element.triggerEventHandler('click', {
            preventDefault: () => {}
        });

        expect(contentNodeDialogService.openLockNodeDialog).toHaveBeenCalledWith(fakeNode);
    });

    it('should disable the button if node is a folder', fakeAsync(() => {
        component.node = { isFile: false, isFolder: true };

        fixture.detectChanges();

        expect(element.nativeElement.disabled).toEqual(true);
    }));

    it('should enable the button if node is a file', fakeAsync(() => {
        component.node = { isFile: true, isFolder: false };

        fixture.detectChanges();

        expect(element.nativeElement.disabled).toEqual(false);
    }));
});
