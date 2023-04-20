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

import { Component } from '@angular/core';
import { FormRenderingService } from '@alfresco/adf-core';
import { CloudFormRenderingService } from '@alfresco/adf-process-services-cloud';
import { CustomEditorComponent, CustomWidgetComponent } from './custom-form-components/custom-editor.component';

@Component({
    template: `<router-outlet></router-outlet>`,
    providers: [
        { provide: FormRenderingService, useClass: CloudFormRenderingService }
    ]
})
export class ProcessCloudLayoutComponent {

    constructor(private formRenderingService: FormRenderingService) {
        this.formRenderingService.register({
            'custom-editor': () => CustomEditorComponent,
            'demo-widget': () => CustomEditorComponent,
            'custom-string': () => CustomWidgetComponent,
            'custom-datetime': () => CustomWidgetComponent,
            'custom-file': () => CustomWidgetComponent,
            'custom-number': () => CustomWidgetComponent,
            'custom-something': () => CustomWidgetComponent,
            'custom-boolean': () => CustomWidgetComponent,
            'custom-date': () => CustomWidgetComponent,
            custom: () => CustomWidgetComponent
        });
    }
}
