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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { FolderDialogComponent } from '../dialogs/folder.dialog';

import { DirectiveModule, ContentService, TranslateLoaderService } from '@alfresco/adf-core';
import { FolderCreateDirective } from './folder-create.directive';
import { Subject } from 'rxjs/Subject';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';

@Component({
    template: '<div [adf-create-folder]="parentNode" (success)="success($event)" title="create-title"></div>'
})
class TestComponent {
    parentNode = '';
    public successParameter: MinimalNodeEntryEntity = null;

    success(node: MinimalNodeEntryEntity) {
        this.successParameter = node;
    }
}

describe('FolderCreateDirective', () => {
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
                DirectiveModule,
                ReactiveFormsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateLoaderService
                    }
                })
            ],
            declarations: [
                TestComponent,
                FolderDialogComponent,
                FolderCreateDirective
            ],
            providers: [
                ContentService
            ]
        });

        TestBed.compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        element = fixture.debugElement.query(By.directive(FolderCreateDirective));
        dialog = TestBed.get(MatDialog);
        contentService = TestBed.get(ContentService);
    });

    beforeEach(() => {
        node = { entry: { id: 'nodeId' } };

        dialogRefMock = {
            afterClosed: val =>  Observable.of(val),
            componentInstance: {
                error: new Subject<any>(),
                success: new Subject<MinimalNodeEntryEntity>()
            }
        };

        spyOn(dialog, 'open').and.returnValue(dialogRefMock);
    });

    xit('should emit folderCreate event when input value is not undefined', (done) => {
        spyOn(dialogRefMock, 'afterClosed').and.returnValue(Observable.of(node));
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
        spyOn(dialogRefMock, 'afterClosed').and.returnValue(Observable.of(null));
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

    it('should open the dialog with the proper title', async(() => {
        fixture.detectChanges();
        element.triggerEventHandler('click', event);

        expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
            data: {
                parentNodeId: jasmine.any(String),
                createTitle: 'create-title'
            },
            width: jasmine.any(String)
        });
    }));
});
