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
import { FormRenderingService } from '@alfresco/adf-core';
import { AttachFileCloudWidgetComponent } from './widgets/attach-file/attach-file-cloud-widget.component';
import { DropdownCloudWidgetComponent } from './widgets/dropdown/dropdown-cloud.widget';
import { DateCloudWidgetComponent } from './widgets/date/date-cloud.widget';
import { PeopleCloudWidgetComponent } from './widgets/people/people-cloud.widget';
import { GroupCloudWidgetComponent } from './widgets/group/group-cloud.widget';
import { PropertiesViewerWidgetComponent } from './widgets/properties-viewer/properties-viewer.widget';
import { RadioButtonsCloudWidgetComponent } from './widgets/radio-buttons/radio-buttons-cloud.widget';

@Injectable({
    providedIn: 'root'
})
export class CloudFormRenderingService extends FormRenderingService {
    constructor() {
        super();

        this.register({
            upload: () => AttachFileCloudWidgetComponent,
            dropdown: () => DropdownCloudWidgetComponent,
            date: () => DateCloudWidgetComponent,
            people: () => PeopleCloudWidgetComponent,
            'functional-group': () => GroupCloudWidgetComponent,
            'properties-viewer': () => PropertiesViewerWidgetComponent,
            'radio-buttons': () => RadioButtonsCloudWidgetComponent
        }, true);
    }
}
