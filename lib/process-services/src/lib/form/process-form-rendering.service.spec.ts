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

import { ProcessFormRenderingService } from './process-form-rendering.service';
import { FormFieldModel, FormFieldTypes } from '@alfresco/adf-core';
import { AttachFolderWidgetComponent } from './widgets/content-widget/attach-folder-widget.component';
import { DropdownWidgetComponent } from './widgets/dropdown/dropdown.widget';
import { DynamicTableWidgetComponent } from './widgets/dynamic-table/dynamic-table.widget';
import { FunctionalGroupWidgetComponent } from './widgets/functional-group/functional-group.widget';
import { PeopleWidgetComponent } from './widgets/people/people.widget';
import { RadioButtonsWidgetComponent } from './widgets/radio-buttons/radio-buttons.widget';
import { TypeaheadWidgetComponent } from './widgets/typeahead/typeahead.widget';
import { DocumentWidgetComponent } from './widgets/document/document.widget';
import { AttachFileWidgetComponent } from './widgets/content-widget/attach-file-widget.component';
import { FileViewerWidgetComponent } from './widgets/file-viewer/file-viewer.widget';

describe('ProcessFormRenderingService', () => {

    let service: ProcessFormRenderingService;

    beforeEach(() => {
        service = new ProcessFormRenderingService();
    });

    it('should resolve Upload field as Upload widget', () => {
        const field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD,
            params: {
                link: null
            }
        });
        const type = service.resolveComponentType(field);
        expect(type).toBe(AttachFileWidgetComponent);
    });

    it('should resolve Upload widget for Upload', () => {
        const resolver = service.getComponentTypeResolver(FormFieldTypes.UPLOAD);
        const type = resolver(null);
        expect(type).toBe(AttachFileWidgetComponent);
    });

    it('should resolve Upload widget for dropdown', () => {
        const resolver = service.getComponentTypeResolver(FormFieldTypes.DROPDOWN);
        const type = resolver(null);
        expect(type).toBe(DropdownWidgetComponent);
    });

    it('should resolve Upload widget for typeahead', () => {
        const resolver = service.getComponentTypeResolver(FormFieldTypes.TYPEAHEAD);
        const type = resolver(null);
        expect(type).toBe(TypeaheadWidgetComponent);
    });

    it('should resolve Upload widget for radio button', () => {
        const resolver = service.getComponentTypeResolver(FormFieldTypes.RADIO_BUTTONS);
        const type = resolver(null);
        expect(type).toBe(RadioButtonsWidgetComponent);
    });

    it('should resolve Upload widget for select folder', () => {
        const resolver = service.getComponentTypeResolver(FormFieldTypes.ATTACH_FOLDER);
        const type = resolver(null);
        expect(type).toBe(AttachFolderWidgetComponent);
    });

    it('should resolve Upload widget for document', () => {
        const resolver = service.getComponentTypeResolver(FormFieldTypes.DOCUMENT);
        const type = resolver(null);
        expect(type).toBe(DocumentWidgetComponent);
    });

    it('should resolve Upload widget for people', () => {
        const resolver = service.getComponentTypeResolver(FormFieldTypes.PEOPLE);
        const type = resolver(null);
        expect(type).toBe(PeopleWidgetComponent);
    });

    it('should resolve Upload widget for group', () => {
        const resolver = service.getComponentTypeResolver(FormFieldTypes.FUNCTIONAL_GROUP);
        const type = resolver(null);
        expect(type).toBe(FunctionalGroupWidgetComponent);
    });

    it('should resolve Upload widget for dynamic table', () => {
        const resolver = service.getComponentTypeResolver(FormFieldTypes.DYNAMIC_TABLE);
        const type = resolver(null);
        expect(type).toBe(DynamicTableWidgetComponent);
    });

    it('should resolve File Viewer widget for file viewer', () => {
        const resolver = service.getComponentTypeResolver(FormFieldTypes.ALFRESCO_FILE_VIEWER);
        const type = resolver(null);
        expect(type).toBe(FileViewerWidgetComponent);
    });

});
