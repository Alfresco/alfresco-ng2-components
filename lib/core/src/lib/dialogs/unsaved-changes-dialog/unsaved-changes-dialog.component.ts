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

import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { UnsavedChangesDialogData } from './unsaved-changes-dialog.model';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserPreferencesService } from '../../common';
import { AppConfigValues } from '../../app-config';

/**
 * Dialog which informs about unsaved changes. Allows discard them and proceed or close dialog and stop proceeding.
 * Can be customized with data object - UnsavedChangesDialogData.
 * If data.checkboxText is provided, checkbox will be displayed with the checkbox description.
 * If data.confirmButtonText is provided, it will be displayed on the confirm button.
 * If data.headerText is provided, it will be displayed as the header.
 * If data.descriptionText is provided, it will be displayed as dialog content.
 */
@Component({
    standalone: true,
    selector: 'adf-unsaved-changes-dialog',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './unsaved-changes-dialog.component.html',
    styleUrls: ['./unsaved-changes-dialog.component.scss'],
    host: { class: 'adf-unsaved-changes-dialog' },
    imports: [MatDialogModule, TranslateModule, MatButtonModule, MatIconModule, CommonModule, MatCheckboxModule, ReactiveFormsModule]
})
export class UnsavedChangesDialogComponent implements OnInit {
    dialogData: UnsavedChangesDialogData;

    constructor(@Inject(MAT_DIALOG_DATA) public data: UnsavedChangesDialogData, private userPreferencesService: UserPreferencesService) {}

    ngOnInit() {
        this.dialogData = {
            headerText: this.data?.headerText ?? 'CORE.DIALOG.UNSAVED_CHANGES.TITLE',
            descriptionText: this.data?.descriptionText ?? 'CORE.DIALOG.UNSAVED_CHANGES.DESCRIPTION',
            confirmButtonText: this.data?.confirmButtonText ?? 'CORE.DIALOG.UNSAVED_CHANGES.DISCARD_CHANGES_BUTTON',
            checkboxText: this.data?.checkboxText ?? ''
        };
    }

    /**
     * Sets 'unsaved_changes__modal_visible' checked state (true or false string) as new item in local storage.
     * @param savePreferences - MatCheckboxChange object with information about checkbox state.
     */
    onToggleCheckboxPreferences(savePreferences: MatCheckboxChange) {
        this.userPreferencesService.set(AppConfigValues.UNSAVED_CHANGES_MODAL_HIDDEN, savePreferences.checked.toString());
    }
}
