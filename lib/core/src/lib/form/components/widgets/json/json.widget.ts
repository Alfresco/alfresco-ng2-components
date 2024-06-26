/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditJsonDialogComponent, EditJsonDialogSettings } from '../../../../dialogs';
import { FormService } from '../../../services/form.service';
import { WidgetComponent } from '../widget.component';

@Component({
    standalone: true,
    template: ` <button mat-raised-button color="primary" (click)="view()">json</button> `,
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
    imports: [MatButtonModule],
    encapsulation: ViewEncapsulation.None
})
export class JsonWidgetComponent extends WidgetComponent {
    constructor(public formService: FormService, private dialog: MatDialog) {
        super(formService);
    }

    view() {
        const rawValue = this.field.value;
        const value = typeof rawValue === 'object' ? JSON.stringify(rawValue || {}, null, 2) : rawValue;

        const settings: EditJsonDialogSettings = {
            title: this.field.name,
            editable: false,
            value
        };

        this.dialog.open(EditJsonDialogComponent, {
            data: settings,
            minWidth: '50%',
            minHeight: '50%'
        });
    }
}
