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

import { Component, OnInit, Input, ViewEncapsulation, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardService } from '../../clipboard';

export interface EditJsonDialogSettings {
    title?: string;
    editable?: boolean;
    value?: string;
}

@Component({
    standalone: true,
    imports: [MatDialogModule, FormsModule, MatButtonModule, MatIconModule, TranslatePipe],
    templateUrl: './edit-json.dialog.html',
    styleUrls: ['./edit-json.dialog.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-edit-json-dialog' }
})
export class EditJsonDialogComponent implements OnInit {
    private readonly settings = inject<EditJsonDialogSettings>(MAT_DIALOG_DATA);
    private readonly clipboardService = inject(ClipboardService);
    private readonly translateService = inject(TranslateService);

    editable: boolean = false;
    title: string = 'JSON';

    @Input()
    value: string = '';

    ngOnInit() {
        if (this.settings) {
            this.editable = this.settings.editable;
            this.value = this.settings.value || '';
            this.title = this.settings.title || 'JSON';
        }
    }

    protected copyToClipboard(): void {
        const key = 'CORE.DIALOG.EDIT_JSON.COPIED';
        const message = this.translateService.instant(key);
        this.clipboardService.copyContentToClipboard(this.value, message);
    }
}
