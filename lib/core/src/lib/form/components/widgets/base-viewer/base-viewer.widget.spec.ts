/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '../../../../testing';
import { FormService } from '../../../services/form.service';
import { FormFieldModel, FormModel } from '../core';
import { BaseViewerWidgetComponent } from './base-viewer.widget';

describe('BaseViewerWidgetComponent', () => {
    const fakeForm = new FormModel();
    let widget: BaseViewerWidgetComponent;
    let formServiceStub: Partial<FormService>;
    let fixture: ComponentFixture<BaseViewerWidgetComponent>;

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
            imports: [CoreTestingModule, BaseViewerWidgetComponent],
            providers: [{ provide: FormService, useValue: formServiceStub }]
        });

        formServiceStub = TestBed.inject(FormService);
        fixture = TestBed.createComponent(BaseViewerWidgetComponent);
        widget = fixture.componentInstance;
    });

    it('should set the file id corretly when the field value is an array', (done) => {
        assertFileId([fakePngAnswer], '1933', fakeForm, widget, fixture, done);
    });

    it('should set the file id corretly when the field value is an object', (done) => {
        assertFileId(fakePngAnswer, '1933', fakeForm, widget, fixture, done);
    });

    it('should set the file id corretly when the field value is a string', (done) => {
        assertFileId('fakeValue', 'fakeValue', fakeForm, widget, fixture, done);
    });
});

/**
 * Assert the field value
 * @param value field value
 * @param expectedFileId field id
 * @param fakeForm form model
 * @param widget form widget
 * @param fixture test fixture
 * @param done callback
 */
function assertFileId(
    value: any,
    expectedFileId: string,
    fakeForm: FormModel,
    widget: BaseViewerWidgetComponent,
    fixture: ComponentFixture<BaseViewerWidgetComponent>,
    done: DoneFn
) {
    const fakeField = new FormFieldModel(fakeForm, { id: 'fakeField', value });
    widget.field = fakeField;

    fixture.detectChanges();

    fixture.whenStable().then(() => {
        expect(widget.field.value).toBe(expectedFileId);
        done();
    });
}
