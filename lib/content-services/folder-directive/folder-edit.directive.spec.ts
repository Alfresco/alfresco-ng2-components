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

import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material';
import { By } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { ContentService, TranslateLoaderService, DirectiveModule } from '@alfresco/adf-core';
import { FolderEditDirective } from './folder-edit.directive';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { Subject } from 'rxjs/Subject';

@Component({
    template: '<div [adf-edit-folder]="folder" (success)="success($event)" title="edit-title"></div>'
})
class TestComponent {
    folder = {};
    public successParameter: MinimalNodeEntryEntity = null;

    success(node: MinimalNodeEntryEntity) {
        this.successParameter = node;
    }
}

describe('FolderEditDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let element;
    let node: any;
    let dialog: MatDialog;
    let contentService: ContentService;
    let dialogRefMock;

    const event = {
        type: 'click',
        preventDefault: () => null
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                MatDialogModule,
                FormsModule,
                ReactiveFormsModule,
                DirectiveModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateLoaderService
                    }
                })
            ],
            declarations: [
                TestComponent,
                FolderEditDirective
            ]
            ,
            providers: [
                ContentService
            ]
        });

        TestBed.compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        element = fixture.debugElement.query(By.directive(FolderEditDirective));
        dialog = TestBed.get(MatDialog);
        contentService = TestBed.get(ContentService);
    });

    beforeEach(() => {
        node = { entry: { id: 'folderId' } };

        dialogRefMock = {
            afterClosed: val =>  Observable.of(val),
            componentInstance: {
                error: new Subject<any>(),
                success: new Subject<MinimalNodeEntryEntity>()
            }
        };

        spyOn(dialog, 'open').and.returnValue(dialogRefMock);
    });

    xit('should emit folderEdit event when input value is not undefined', (done) => {
        spyOn(dialogRefMock, 'afterClosed').and.returnValue(Observable.of(node));

        contentService.folderEdit.subscribe((val) => {
            expect(val).toBe(node);
            done();
        });

        element.triggerEventHandler('click', event);
        fixture.detectChanges();
    });

    it('should not emit folderEdit event when input value is undefined', () => {
        spyOn(dialogRefMock, 'afterClosed').and.returnValue(Observable.of(null));
        spyOn(contentService.folderEdit, 'next');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            element.nativeElement.click();
            expect(contentService.folderEdit.next).not.toHaveBeenCalled();
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

    it('should open the dialog with the proper title', async(() => {
        fixture.detectChanges();
        element.triggerEventHandler('click', event);

        expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
            data: {
                folder: jasmine.any(Object),
                editTitle: 'edit-title'
            },
            width: jasmine.any(String)
        });
    }));
});
