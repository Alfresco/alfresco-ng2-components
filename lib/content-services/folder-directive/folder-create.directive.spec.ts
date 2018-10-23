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

import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { By } from '@angular/platform-browser';
import { Subject, of } from 'rxjs';
import { FolderDialogComponent } from '../dialogs/folder.dialog';

import { ContentService, setupTestBed, CoreModule } from '@alfresco/adf-core';
import { FolderCreateDirective } from './folder-create.directive';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';

@Component({
    template: `
        <div
            [adf-create-folder]="parentNode"
            (success)="success($event)"
            title="create-title"
            [nodeType]="'cm:my-little-pony'">
        </div>`
})
class TestTypeComponent {
    parentNode = '';
    public successParameter: MinimalNodeEntryEntity = null;

    success(node: MinimalNodeEntryEntity) {
        this.successParameter = node;
    }
}

@Component({
    template: `<div [adf-create-folder]="parentNode"></div>`
})
class TestComponent {
    parentNode = '';
    public successParameter: MinimalNodeEntryEntity = null;
}

describe('FolderCreateDirective', () => {
    let fixture: ComponentFixture<TestTypeComponent | TestComponent>;
    let element;
    let node: any;
    let dialog: MatDialog;
    let contentService: ContentService;
    let dialogRefMock;

    const event = { type: 'click', preventDefault: () => null };

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        declarations: [
            TestTypeComponent,
            TestComponent,
            FolderDialogComponent,
            FolderCreateDirective
        ],
        providers: [
            ContentService
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        element = fixture.debugElement.query(By.directive(FolderCreateDirective));
        dialog = TestBed.get(MatDialog);
        contentService = TestBed.get(ContentService);
    });

    beforeEach(() => {
        node = { entry: { id: 'nodeId' } };

        dialogRefMock = {
            afterClosed: val =>  of(val),
            componentInstance: {
                error: new Subject<any>(),
                success: new Subject<MinimalNodeEntryEntity>()
            }
        };
    });

    describe('With overrides', () => {

        beforeEach(() => {
            fixture = TestBed.createComponent(TestTypeComponent);
            element = fixture.debugElement.query(By.directive(FolderCreateDirective));
            dialog = TestBed.get(MatDialog);
            contentService = TestBed.get(ContentService);
            spyOn(dialog, 'open').and.returnValue(dialogRefMock);
        });

        xit('should emit folderCreate event when input value is not undefined', (done) => {
            spyOn(dialogRefMock, 'afterClosed').and.returnValue(of(node));
            spyOn(contentService.folderCreate, 'next');

            contentService.folderCreate.subscribe((val) => {
                expect(val).toBe(node);
                done();
            });

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                element.nativeElement.click();
            });
        });

        it('should not emit folderCreate event when input value is undefined', () => {
            spyOn(dialogRefMock, 'afterClosed').and.returnValue(of(null));
            spyOn(contentService.folderCreate, 'next');

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                element.nativeElement.click();
                expect(contentService.folderCreate.next).not.toHaveBeenCalled();
            });
        });

        it('should emit success event with node if the folder creation was successful', async(() => {
            const testNode = <MinimalNodeEntryEntity> {};
            fixture.detectChanges();

            element.triggerEventHandler('click', event);
            dialogRefMock.componentInstance.success.next(testNode);

            fixture.whenStable().then(() => {
                expect(fixture.componentInstance.successParameter).toBe(testNode);
            });
        }));

        it('should open the dialog with the proper title and nodeType', async(() => {
            fixture.detectChanges();
            element.triggerEventHandler('click', event);

            expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
                data: {
                    parentNodeId: jasmine.any(String),
                    createTitle: 'create-title',
                    nodeType: 'cm:my-little-pony'
                },
                width: jasmine.any(String)
            });
        }));
    });

    describe('Without overrides', () => {

        beforeEach(() => {
            fixture = TestBed.createComponent(TestComponent);
            element = fixture.debugElement.query(By.directive(FolderCreateDirective));
            dialog = TestBed.get(MatDialog);
            contentService = TestBed.get(ContentService);
            spyOn(dialog, 'open').and.returnValue(dialogRefMock);
        });

        it('should open the dialog with the default title and nodeType', async(() => {
            fixture.detectChanges();
            element.triggerEventHandler('click', event);

            expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
                data: {
                    parentNodeId: jasmine.any(String),
                    createTitle: null,
                    nodeType: 'cm:folder'
                },
                width: jasmine.any(String)
            });
        }));
    });
});
