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

import { Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ErrorWidgetComponent, FormService, WidgetComponent } from '@alfresco/adf-core';
import { UntypedFormControl } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { ComponentSelectionMode } from '../../../../types';
import { IdentityGroupModel } from '../../../../group/models/identity-group.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { GroupCloudComponent } from '../../../../group/components/group-cloud.component';

/* eslint-disable @angular-eslint/component-selector */

@Component({
    selector: 'group-cloud-widget',
    imports: [CommonModule, TranslatePipe, ErrorWidgetComponent, GroupCloudComponent],
    templateUrl: './group-cloud.widget.html',
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
export class GroupCloudWidgetComponent extends WidgetComponent implements OnInit {
    typeId = 'GroupCloudWidgetComponent';
    roles: string[];
    mode: ComponentSelectionMode;
    title: string;
    preSelectGroup: IdentityGroupModel[];
    search: UntypedFormControl;
    validate = false;

    private readonly destroyRef = inject(DestroyRef);

    constructor(formService: FormService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field) {
            this.roles = this.field.roles;
            this.mode = this.field.optionType as ComponentSelectionMode;
            this.title = this.field.placeholder;
            this.preSelectGroup = this.field.value ? this.field.value : [];
            this.validate = this.field.readOnly ? false : true;
        }
        this.search = new UntypedFormControl({ value: '', disabled: this.field.readOnly }, []);
        this.search.statusChanges
            .pipe(
                filter((value: string) => value === 'INVALID'),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.field.markAsInvalid();
                this.field.form.markAsInvalid();
            });

        this.search.statusChanges
            .pipe(
                filter((value: string) => value === 'VALID'),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.field.validate();
                this.field.form.validateForm();
            });
    }
    onChangedGroup(groups: IdentityGroupModel[]): void {
        this.field.value = groups?.length ? [...groups] : null;
        this.onFieldChanged(this.field);
    }

    isMultipleMode(): boolean {
        return this.mode === 'multiple';
    }
}
