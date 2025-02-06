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

import { UploadWidgetComponent } from './upload/upload.widget';
import { DocumentWidgetComponent } from './document/document.widget';
import { ContentWidgetComponent } from './document/content.widget';
import { PeopleWidgetComponent } from './people/people.widget';
import { FunctionalGroupWidgetComponent } from './functional-group/functional-group.widget';
import { RadioButtonsWidgetComponent } from './radio-buttons/radio-buttons.widget';
import { DropdownWidgetComponent } from './dropdown/dropdown.widget';
import { TypeaheadWidgetComponent } from './typeahead/typeahead.widget';
import { FileViewerWidgetComponent } from './file-viewer/file-viewer.widget';
import { DYNAMIC_TABLE_WIDGET_DIRECTIVES } from './dynamic-table';
import { AttachFileWidgetComponent, AttachFileWidgetDialogComponent, AttachFolderWidgetComponent } from './content-widget';

export * from './content-widget/public-api';
export * from './document/content.widget';
export * from './document/document.widget';
export * from './people/people.widget';
export * from './radio-buttons/radio-buttons.widget';
export * from './functional-group/functional-group.widget';
export * from './typeahead/typeahead.widget';
export * from './dropdown/dropdown.widget';
export * from './file-viewer/file-viewer.widget';
export * from './dynamic-table/index';
export * from './upload/upload.widget';

export const WIDGET_DIRECTIVES = [
    AttachFileWidgetComponent,
    AttachFolderWidgetComponent,
    AttachFileWidgetDialogComponent,
    ContentWidgetComponent,
    DocumentWidgetComponent,
    DropdownWidgetComponent,
    ...DYNAMIC_TABLE_WIDGET_DIRECTIVES,
    FileViewerWidgetComponent,
    FunctionalGroupWidgetComponent,
    PeopleWidgetComponent,
    RadioButtonsWidgetComponent,
    TypeaheadWidgetComponent,
    UploadWidgetComponent
];
