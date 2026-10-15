/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { EditJsonDialogComponent, EditJsonDialogSettings } from '@alfresco/adf-core';
import { SignalFormWidget } from '../signal-form-widget';

/**
 * Shows a JSON value in ADF's read-only JSON dialog.
 */
@Component({
    selector: 'adf-signal-json-widget',
    templateUrl: './json-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, TranslatePipe]
})
export class SignalJsonWidgetComponent extends SignalFormWidget<unknown> {
    private readonly dialog = inject(MatDialog);

    protected view(): void {
        const value = this.field()().value();
        const data: EditJsonDialogSettings = {
            title: this.definition().name,
            editable: false,
            value: typeof value === 'object' ? JSON.stringify(value || {}, null, 2) : (value as string)
        };
        this.dialog.open(EditJsonDialogComponent, { data, minWidth: '50%', minHeight: '50%' });
    }
}
