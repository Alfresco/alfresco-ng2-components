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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { MatDialog, MatDialogModule } from '@angular/material';
import { By } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Rx';

import { AppConfigService, providers } from '../../index';
import { AlfrescoContentService } from '../services/alfresco-content.service';
import { AlfrescoTranslateLoader } from '../services/translate-loader.service';
import { FolderEditDirective } from './folder-edit.directive';

@Component({
    template: '<div [adf-edit-folder]="folder"></div>'
})
class TestComponent {
    folder = {};
}

describe('FolderEditDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let element;
    let node: any;
    let dialog: MatDialog;
    let contentService: AlfrescoContentService;
    let dialogRefMock;

    const event = {
        type: 'click',
        preventDefault: () => null
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule,
                MatDialogModule,
                FormsModule,
                ReactiveFormsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: AlfrescoTranslateLoader
                    }
                })
            ],
            declarations: [
                TestComponent,
                FolderEditDirective
            ]
            ,
            providers: [
                AlfrescoContentService,
                AppConfigService,
                ...providers()
            ]
        });

        TestBed.compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        element = fixture.debugElement.query(By.directive(FolderEditDirective));
        dialog = TestBed.get(MatDialog);
        contentService = TestBed.get(AlfrescoContentService);
    });

    beforeEach(() => {
        node = { entry: { id: 'folderId' } };

        dialogRefMock = {
            afterClosed: val =>  Observable.of(val)
        };

        spyOn(dialog, 'open').and.returnValue(dialogRefMock);
    });

    it('should emit folderEdit event when input value is not undefined', () => {
        spyOn(dialogRefMock, 'afterClosed').and.returnValue(Observable.of(node));

        contentService.folderEdit.subscribe((val) => {
            expect(val).toBe(node);
        });

        element.triggerEventHandler('click', event);
        fixture.detectChanges();
    });

    it('should not emit folderEdit event when input value is undefined', () => {
        spyOn(dialogRefMock, 'afterClosed').and.returnValue(Observable.of(null));
        spyOn(contentService.folderEdit, 'next');

        element.triggerEventHandler('click', event);
        fixture.detectChanges();

        expect(contentService.folderEdit.next).not.toHaveBeenCalled();
    });
});
