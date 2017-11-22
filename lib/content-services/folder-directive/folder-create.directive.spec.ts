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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { AppConfigService, DirectiveModule, ContentService, TranslateLoaderService } from '@alfresco/adf-core';
import { FolderCreateDirective } from './folder-create.directive';

@Component({
    template: '<div [adf-create-folder]="parentNode"></div>'
})
class TestComponent {
    parentNode = '';
}

describe('FolderCreateDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let element;
    let node: any;
    let dialog: MatDialog;
    let contentService: ContentService;
    let dialogRefMock;

    const event: any = {
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
                FolderCreateDirective
            ],
            providers: [
                ContentService,
                AppConfigService
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
            afterClosed: val =>  Observable.of(val)
        };

        spyOn(dialog, 'open').and.returnValue(dialogRefMock);
    });

    it('should emit folderCreate event when input value is not undefined', () => {
        spyOn(dialogRefMock, 'afterClosed').and.returnValue(Observable.of(node));

        contentService.folderCreate.subscribe((val) => {
            expect(val).toBe(node);
        });

        element.triggerEventHandler('click', event);
        fixture.detectChanges();
    });

    it('should not emit folderCreate event when input value is undefined', () => {
        spyOn(dialogRefMock, 'afterClosed').and.returnValue(Observable.of(null));
        spyOn(contentService.folderCreate, 'next');

        element.triggerEventHandler('click', event);
        fixture.detectChanges();

        expect(contentService.folderCreate.next).not.toHaveBeenCalled();
    });
});
