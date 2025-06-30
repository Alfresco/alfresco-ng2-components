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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { RoleModel } from '../../models/role.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

export interface RoleModelOption {
    label: string;
    role: string;
}

@Component({
    selector: 'adf-user-role-column',
    imports: [CommonModule, MatFormFieldModule, MatSelectModule, TranslatePipe],
    template: `
        <mat-form-field class="adf-role-selector-field" *ngIf="!readonly" subscriptSizing="dynamic">
            <mat-select
                class="adf-role-selector"
                (click)="$event.stopPropagation()"
                [placeholder]="placeholder | translate"
                [value]="value"
                (selectionChange)="onRoleChanged($event.value)"
                (keyup.arrowdown)="$event.stopPropagation()"
                (keyup.arrowup)="$event.stopPropagation()"
            >
                <mat-option *ngFor="let option of options" [value]="option.role">
                    {{ option.label | translate }}
                </mat-option>
            </mat-select>
        </mat-form-field>

        <span class="adf-datatable-cell-value adf-readonly-role" [title]="i18nValue | translate" *ngIf="readonly">
            {{ i18nValue | translate }}
        </span>
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-user-role-column adf-datatable-content-cell adf-expand-cell-4' },
    styleUrls: ['./user-role-column.component.scss']
})
export class UserRoleColumnComponent implements OnChanges {
    @Input()
    roles: RoleModel[];

    @Input()
    value: string;

    @Input()
    readonly = false;

    @Input()
    placeholder: string = 'PERMISSION_MANAGER.LABELS.SELECT-ROLE';

    @Output()
    roleChanged = new EventEmitter<string>();

    i18nValue: string;

    /* dropdown options, including i18n support */
    options: RoleModelOption[] = [];

    onRoleChanged(newRole: string) {
        this.value = newRole;
        this.roleChanged.emit(newRole);
    }

    private i18nRoleValue(value: string): string {
        if (value) {
            return `ADF.ROLES.${value.toUpperCase()}`;
        }
        return value;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.value) {
            this.i18nValue = this.i18nRoleValue(changes.value.currentValue);
        }

        if (changes.roles) {
            const roles: RoleModel[] = changes.roles.currentValue || [];
            this.options = roles.map((role) => ({ label: this.i18nRoleValue(role.label), role: role.role }));
        }
    }
}
