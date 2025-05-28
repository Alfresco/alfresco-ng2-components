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

import { Component, ViewEncapsulation } from '@angular/core';
import { FormService, ErrorWidgetComponent } from '@alfresco/adf-core';
import { BaseViewerWidgetComponent } from '@alfresco/adf-core/viewer';
import { AlfrescoViewerComponent } from '@alfresco/adf-content-services';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

/* eslint-disable @angular-eslint/component-selector */

@Component({
    selector: 'file-viewer-widget',
    standalone: true,
    imports: [NgIf, ErrorWidgetComponent, AlfrescoViewerComponent, TranslateModule],
    templateUrl: './file-viewer.widget.html',
    styleUrls: ['./file-viewer.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class FileViewerWidgetComponent extends BaseViewerWidgetComponent {
    constructor(formService: FormService) {
        super(formService);
    }
}
