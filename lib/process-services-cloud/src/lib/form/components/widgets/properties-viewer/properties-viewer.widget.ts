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

import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { BaseViewerWidgetComponent, ErrorWidgetComponent, FormService } from '@alfresco/adf-core';
import { Node } from '@alfresco/js-api';
import { PropertiesViewerWrapperComponent } from './properties-viewer-wrapper/properties-viewer-wrapper.component';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

/* eslint-disable @angular-eslint/component-selector */

@Component({
    selector: 'adf-properties-viewer-widget',
    imports: [CommonModule, ErrorWidgetComponent, PropertiesViewerWrapperComponent, TranslatePipe],
    templateUrl: './properties-viewer.widget.html',
    styleUrls: ['./properties-viewer.widget.scss'],
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
export class PropertiesViewerWidgetComponent extends BaseViewerWidgetComponent {
    @Output()
    nodeContentLoaded: EventEmitter<Node> = new EventEmitter();

    constructor(formService: FormService) {
        super(formService);
    }

    onNodeContentLoaded(node: Node) {
        this.nodeContentLoaded.emit(node);
    }
}
