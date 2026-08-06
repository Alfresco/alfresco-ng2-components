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

import { AfterViewInit, Component, ViewEncapsulation, inject, model, viewChild, ViewContainerRef, inputBinding, twoWayBinding } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardService } from '../../clipboard';
import { EDIT_JSON_EDITOR } from './edit-json-editor.token';

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
export class EditJsonDialogComponent implements AfterViewInit {
    private readonly settings = inject<EditJsonDialogSettings | null>(MAT_DIALOG_DATA);
    private readonly clipboardService = inject(ClipboardService);
    private readonly translateService = inject(TranslateService);
    private readonly editorHost = viewChild('editorHost', { read: ViewContainerRef });

    protected readonly customEditor = inject(EDIT_JSON_EDITOR);
    protected title = this.settings?.title ?? 'JSON';

    editable = this.settings?.editable ?? false;
    readonly value = model(this.settings?.value ?? '');

    ngAfterViewInit(): void {
        this.renderCustomEditor();
    }

    protected copyToClipboard(): void {
        const key = 'CORE.DIALOG.EDIT_JSON.COPIED';
        const message = this.translateService.instant(key);
        this.clipboardService.copyContentToClipboard(this.value(), message);
    }

    private renderCustomEditor(): void {
        const host = this.editorHost();

        if (!this.customEditor || !host) return;

        host.clear();
        host.createComponent(this.customEditor, { bindings: [twoWayBinding('value', this.value), inputBinding('readOnly', () => !this.editable)] });
    }
}
