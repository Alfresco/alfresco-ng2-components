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

import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DownloadPromptDialogComponent } from './download-prompt-dialog.component';
import { DownloadPromptActions } from '../../models/download-prompt.actions';

@Component({
    selector: 'adf-download-prompt-dialog-storybook',
    template: `<button mat-raised-button color="primary" (click)="openDialog()">Open download prompt</button>`,
    imports: [MatButtonModule]
})
export class DownloadPromptDialogStorybookComponent {
    @Output()
    closed = new EventEmitter<DownloadPromptActions>();

    private readonly dialog = inject(MatDialog);

    openDialog(): void {
        this.dialog
            .open(DownloadPromptDialogComponent, { disableClose: false })
            .afterClosed()
            .subscribe((result: DownloadPromptActions) => this.closed.emit(result));
    }
}
