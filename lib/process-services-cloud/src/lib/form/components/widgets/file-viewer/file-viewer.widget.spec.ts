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

import { TranslateModule } from '@ngx-translate/core';
import { FileViewerWidgetComponent } from './file-viewer.widget';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormModel, FormService, FormFieldModel } from '@alfresco/adf-core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FileViewerWidgetComponent', () => {
    const fakeForm = new FormModel();
    let widget: FileViewerWidgetComponent;
    let formServiceStub: Partial<FormService>;
    let fixture: ComponentFixture<FileViewerWidgetComponent>;

    const fakePngAnswer: any = {
        id: '1933',
        link: false,
        isExternal: false,
        relatedContent: false,
        contentAvailable: true,
        name: 'a_png_file.png',
        simpleType: 'image',
        mimeType: 'image/png',
        previewStatus: 'queued',
        thumbnailStatus: 'queued',
        created: '2022-10-14T17:17:37.099Z',
        createdBy: { id: 1001, firstName: 'Admin', lastName: 'admin', email: 'admin@example.com' }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot()
            ],
            declarations: [ FileViewerWidgetComponent ],
            providers: [ { provide: FormService, useValue: formServiceStub } ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
          });

        formServiceStub = TestBed.inject(FormService);
        fixture = TestBed.createComponent(FileViewerWidgetComponent);
        widget = fixture.componentInstance;
    });

    it('should set the file id corretly when the field value is an array', (done) => {
        const fakeField = new FormFieldModel(fakeForm, { id: 'fakeField', value: [fakePngAnswer] });
        widget.field = fakeField;

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(widget.field.value).toBe('1933');
            done();
        });
    });

    it('should set the file id corretly when the field value is a string', (done) => {
        const fakeField = new FormFieldModel(fakeForm, { id: 'fakeField', value: 'fakeValue' });
        widget.field = fakeField;

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(widget.field.value).toBe('fakeValue');
            done();
        });
    });
});
