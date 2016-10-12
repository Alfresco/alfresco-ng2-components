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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FileUploadingDialogComponent } from './file-uploading-dialog.component';
import { FileUploadingListComponent } from './file-uploading-list.component';
import { DebugElement, ReflectiveInjector }    from '@angular/core';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    AlfrescoApiService,
    CoreModule
} from 'ng2-alfresco-core';
import { UploadService } from '../services/upload.service';
import { FileModel } from '../models/file.model';

describe('Test ng2-alfresco-upload FileUploadDialog', () => {

    let injector;
    let component: any;
    let fixture: ComponentFixture<FileUploadingDialogComponent>;
    let debug: DebugElement;
    let element: any;
    let file: FileModel;

    beforeEach(async(() => {
        injector = ReflectiveInjector.resolveAndCreate([
            UploadService
        ]);

        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [FileUploadingDialogComponent, FileUploadingListComponent],
            providers: [
                AlfrescoSettingsService,
                AlfrescoAuthenticationService,
                AlfrescoApiService,
                UploadService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        window['componentHandler'] = null;

        let fileFake = {
            id: 'fake-id',
            name: 'fake-name'
        };
        file = new FileModel(fileFake);

        fixture = TestBed.createComponent(FileUploadingDialogComponent);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;

        component.filesUploadingList = [file];
        fixture.detectChanges();
    });

    it('should render completed upload 1 when an element is added to Observer', () => {
        component._uploaderService.updateFileCounterStream(1);
        fixture.detectChanges();

        expect(element.querySelector('#total-upload-completed').innerText).toEqual('1');
    });

    it('should render dialog box with css class show when an element is added to Observer', () => {
        component._uploaderService.addToQueue([file]);
        component.filesUploadingList = [file];

        fixture.detectChanges();

        expect(element.querySelector('.file-dialog').getAttribute('class')).toEqual('file-dialog show');
    });

    it('should render dialog box with css class show when the toggleShowDialog is called', () => {
        component.toggleShowDialog();
        fixture.detectChanges();

        expect(element.querySelector('.file-dialog').getAttribute('class')).toEqual('file-dialog show');
    });

    it('should render dialog box with css class hide', () => {
        component.isDialogActive = true;

        component.toggleShowDialog();
        fixture.detectChanges();

        expect(element.querySelector('.file-dialog').getAttribute('class')).toEqual('file-dialog');
    });

    it('should render minimize dialog as default', () => {
        component.isDialogActive = true;

        component.toggleDialogMinimize();
        fixture.detectChanges();

        expect(element.querySelector('.minimize-button').getAttribute('class')).toEqual('minimize-button active');
    });
});
