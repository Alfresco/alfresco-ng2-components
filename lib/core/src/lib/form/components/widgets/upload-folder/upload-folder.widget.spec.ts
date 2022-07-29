/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { setupTestBed } from '../../../../testing/setup-test-bed';
import { CoreTestingModule } from '../../../../testing';
import { UploadFolderWidgetComponent } from './upload-folder.widget';
import { FormFieldModel } from '../core/form-field.model';
import { FormModel } from '../core/form.model';
import { FormFieldTypes } from '../core/form-field-types';

describe('UploadFolderWidgetComponent', () => {

    let widget: UploadFolderWidgetComponent;
    let fixture: ComponentFixture<UploadFolderWidgetComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadFolderWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    describe('when is required', () => {

        it('should be able to display label with asterisk', async () => {
            widget.field = new FormFieldModel( new FormModel({ taskId: '<id>' }), {
                type: FormFieldTypes.UPLOAD,
                required: true
            });

            fixture.detectChanges();
            await fixture.whenStable();

            const asterisk: HTMLElement = element.querySelector('.adf-asterisk');

            expect(asterisk).toBeTruthy();
            expect(asterisk.textContent).toEqual('*');
        });
    });
});
