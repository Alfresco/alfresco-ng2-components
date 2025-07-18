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

/* eslint-disable @angular-eslint/component-selector */

import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormService } from '../../../services/form.service';
import { WidgetComponent } from '../widget.component';

@Component({
    selector: 'unknown-widget',
    template: `
        <mat-list class="adf-unknown-widget">
            <mat-list-item>
                <mat-icon class="mat-24">error_outline</mat-icon>
                <span class="adf-unknown-text">Unknown type: {{ field.type }}</span>
            </mat-list-item>
        </mat-list>
    `,
    styleUrls: ['./unknown.widget.scss'],
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
    imports: [MatListModule, MatIconModule],
    encapsulation: ViewEncapsulation.None
})
export class UnknownWidgetComponent extends WidgetComponent {
    constructor(public formService: FormService) {
        super(formService);
    }
}
