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

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ContainerModel } from '../core/container.model';
import { FieldStylePipe } from './../../../pipes/field-style.pipe';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'adf-header-widget',
    templateUrl: './header.widget.html',
    styleUrls: ['./header.widget.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [FieldStylePipe, MatIconModule, MatButtonModule, TranslateModule, NgIf, NgTemplateOutlet]
})
export class HeaderWidgetComponent {
    @Input() element: ContainerModel;

    onExpanderClicked(content: ContainerModel) {
        if (content?.isCollapsible) {
            content.isExpanded = !content.isExpanded;
        }
    }
}
