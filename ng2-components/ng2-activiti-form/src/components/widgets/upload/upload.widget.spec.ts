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

import { UploadWidget } from './upload.widget';
import { AlfrescoSettingsService, AlfrescoAuthenticationService, AlfrescoApiService } from 'ng2-alfresco-core';
import { FormFieldModel } from './../core/form-field.model';
import { FormFieldTypes } from '../core/form-field-types';

describe('UploadWidget', () => {

    let widget: UploadWidget;
    let settingsService: AlfrescoSettingsService;
    let authService: AlfrescoAuthenticationService;

    beforeEach(() => {
        settingsService = new AlfrescoSettingsService();
        authService = new AlfrescoAuthenticationService(settingsService, new AlfrescoApiService());
        widget = new UploadWidget(settingsService, authService);
    });

    it('should setup with field data', () => {
        const fileName = 'hello world';
        const encodedFileName = encodeURI(fileName);

        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD,
            value: [
                { name: encodedFileName }
            ]
        });

        widget.ngOnInit();
        expect(widget.hasFile).toBeTruthy();
        expect(widget.fileName).toBe(encodeURI(fileName));
        expect(widget.displayText).toBe(fileName);
    });

    it('should require form field to setup', () => {
        widget.field = null;
        widget.ngOnInit();

        expect(widget.hasFile).toBeFalsy();
        expect(widget.fileName).toBeUndefined();
        expect(widget.displayText).toBeUndefined();
    });

    it('should reset local properties', () => {
        widget.hasFile = true;
        widget.fileName = '<fileName>';
        widget.displayText = '<displayText>';

        widget.reset();
        expect(widget.hasFile).toBeFalsy();
        expect(widget.fileName).toBeNull();
        expect(widget.displayText).toBeNull();
    });

    it('should reset field value', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD,
            value: [
                { name: 'filename' }
            ]
        });
        widget.reset();
        expect(widget.field.value).toBeNull();
        expect(widget.field.json.value).toBeNull();
    });

});
