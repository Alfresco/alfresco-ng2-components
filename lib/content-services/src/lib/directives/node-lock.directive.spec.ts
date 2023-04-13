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

import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';

import { NodeLockDirective } from './node-lock.directive';
import { Node } from '@alfresco/js-api';
import { ContentNodeDialogService } from '../content-node-selector/content-node-dialog.service';
import { setupTestBed } from '@alfresco/adf-core';
import { ContentTestingModule } from '../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

const fakeNode = {
    id: 'fake',
    isFile: true,
    isLocked: false
} as Node;

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
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        declarations: [
            TestComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.query(By.directive(NodeLockDirective));
        contentNodeDialogService = TestBed.inject(ContentNodeDialogService);
    });

    it('should call openLockNodeDialog method on click', () => {
        spyOn(contentNodeDialogService, 'openLockNodeDialog');
        component.node = fakeNode;

        fixture.detectChanges();
        element = fixture.debugElement.query(By.directive(NodeLockDirective));
        element.nativeElement.dispatchEvent(new MouseEvent('click'));

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
