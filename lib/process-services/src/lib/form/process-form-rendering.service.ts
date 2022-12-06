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

import { Injectable } from '@angular/core';
import {
    FormRenderingService,
} from '@alfresco/adf-core';
import { AttachFileWidgetComponent } from './widgets/content-widget/attach-file-widget.component';
import { AttachFolderWidgetComponent } from './widgets/content-widget/attach-folder-widget.component';
import { DocumentWidgetComponent } from './widgets/document/document.widget';
import { PeopleWidgetComponent } from './widgets/people/people.widget';
import { FunctionalGroupWidgetComponent } from './widgets/functional-group/functional-group.widget';
import { RadioButtonsWidgetComponent } from './widgets/radio-buttons/radio-buttons.widget';
import { TypeaheadWidgetComponent } from './widgets/typeahead/typeahead.widget';
import { DynamicTableWidgetComponent } from './widgets/dynamic-table/dynamic-table.widget';
import { DropdownWidgetComponent } from './widgets/dropdown/dropdown.widget';

@Injectable({
    providedIn: 'root'
})
export class ProcessFormRenderingService extends FormRenderingService {
    constructor() {
        super();

        this.register({
            dropdown: () => DropdownWidgetComponent,
            typeahead: () =>  TypeaheadWidgetComponent,
            'radio-buttons': () =>  RadioButtonsWidgetComponent,
            upload: () => AttachFileWidgetComponent,
            'select-folder': () => AttachFolderWidgetComponent,
            document: () => DocumentWidgetComponent,
            people: () =>  PeopleWidgetComponent,
            'functional-group':  () => FunctionalGroupWidgetComponent,
            'dynamic-table':  () => DynamicTableWidgetComponent,

        }, true);
    }
}
