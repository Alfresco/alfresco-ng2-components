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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Subject, of } from 'rxjs';

import { setupTestBed } from '@alfresco/adf-core';
import { FolderEditDirective } from './folder-edit.directive';
import { Node } from '@alfresco/js-api';
import { ContentTestingModule } from '../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ContentService } from '../common/services/content.service';

@Component({
    template: '<div [adf-edit-folder]="folder" (success)="success($event)" title="edit-title"></div>'
})
class TestComponent {
    folder = {};
    public successParameter: Node = null;

    success(node: Node) {
        this.successParameter = node;
    }
}

describe('FolderEditDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let element;
    let dialog: MatDialog;
    let contentService: ContentService;
    let dialogRefMock;

    const event = {
        type: 'click',
        preventDefault: () => null
    };

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
        element = fixture.debugElement.query(By.directive(FolderEditDirective));
        dialog = TestBed.inject(MatDialog);
        contentService = TestBed.inject(ContentService);
    });

    beforeEach(() => {
        dialogRefMock = {
            afterClosed: (val) =>  of(val),
            componentInstance: {
                error: new Subject<any>(),
                success: new Subject<Node>()
            }
        };

        spyOn(dialog, 'open').and.returnValue(dialogRefMock);
    });

    it('should not emit folderEdit event when input value is undefined', async () => {
        spyOn(dialogRefMock, 'afterClosed').and.returnValue(of(null));
        spyOn(contentService.folderEdit, 'next');

        fixture.detectChanges();
        await fixture.whenStable();

        element.nativeElement.click();
        expect(contentService.folderEdit.next).not.toHaveBeenCalled();
    });

    it('should emit success event with node if the folder creation was successful', async () => {
        fixture.detectChanges();
        const testNode: any = {};

        element.triggerEventHandler('click', event);
        dialogRefMock.componentInstance.success.next(testNode);

        fixture.detectChanges();
        await fixture.whenStable();
        expect(fixture.componentInstance.successParameter).toBe(testNode);
    });

    it('should open the dialog with the proper title', async () => {
        fixture.detectChanges();
        element.triggerEventHandler('click', event);

        await fixture.whenStable();

        expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
            data: {
                folder: jasmine.any(Object),
                editTitle: 'edit-title'
            },
            width: jasmine.any(String)
        });
    });
});
