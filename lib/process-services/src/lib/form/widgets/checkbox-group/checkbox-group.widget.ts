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

/* eslint-disable @angular-eslint/component-selector */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslatePipe } from '@ngx-translate/core';
import { ErrorWidgetComponent, FormFieldEvent, FormFieldOption, WidgetComponent } from '@alfresco/adf-core';
import { filter, finalize } from 'rxjs/operators';
import { TaskFormService } from '../../services/task-form.service';
import { ProcessDefinitionService } from '../../services/process-definition.service';

@Component({
    selector: 'checkbox-group-widget',
    imports: [MatCheckboxModule, TranslatePipe, ErrorWidgetComponent],
    templateUrl: './checkbox-group.widget.html',
    styleUrls: ['./checkbox-group.widget.scss'],
    host: { '(click)': 'event($event)' },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxGroupWidgetComponent extends WidgetComponent implements OnInit {
    private readonly taskFormService = inject(TaskFormService);
    private readonly processDefinitionService = inject(ProcessDefinitionService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    readonly loading = signal(false);

    // isSelected runs for every option on every change detection pass, so the ids are only rebuilt when the value changes
    private selectedIds = new Set<string>();
    private selectedIdsField: unknown;
    private selectedIdsValue: unknown;

    get disabled(): boolean {
        return this.readOnly || this.field.readOnly || !!this.field.form?.readOnly || this.loading();
    }

    ngOnInit(): void {
        this.listenForExternalChanges();
        if (this.field?.optionType !== 'rest' || !this.field.restUrl || this.field.form?.readOnly) {
            return;
        }
        const form = this.field.form;
        if (!form?.taskId && !form?.processDefinitionId) {
            return;
        }
        this.loading.set(true);
        const options$ = form.taskId
            ? this.taskFormService.getRestFieldValues(form.taskId, this.field.id)
            : this.processDefinitionService.getRestFieldValuesByProcessId(form.processDefinitionId, this.field.id);
        options$
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.loading.set(false))
            )
            .subscribe({
                next: (options) => {
                    this.field.options = options || [];
                    const saved: FormFieldOption[] = this.field.getFormValue();
                    const available = saved.filter((selected) => this.field.options.some((option) => option.id === selected.id));
                    if (available.length !== saved.length) {
                        // the server is authoritative for REST options, so selections it no longer offers are dropped and rules/dirty-state are notified
                        this.field.value = available;
                        this.onFieldChanged(this.field);
                    }
                    this.changeDetectorRef.markForCheck();
                },
                error: (error) => this.widgetError.emit(error)
            });
    }

    isSelected(option: FormFieldOption): boolean {
        return this.getSelectedIds().has(option.id);
    }

    override isInvalidFieldRequired(): boolean {
        return this.isRequired() && !this.field.isValid && this.field.getFormValue().length === 0 && !this.field.validationSummary?.isActive();
    }

    override markAsTouched(): void {
        super.markAsTouched();
        this.changeDetectorRef.markForCheck();
    }

    onSelectionChange(option: FormFieldOption, checked: boolean): void {
        if (this.disabled) {
            return;
        }
        const selected: FormFieldOption[] = this.field.getFormValue();
        const remaining = selected.filter((entry) => entry.id !== option.id);
        this.field.value = checked ? this.sortByOptionOrder([...remaining, option]) : remaining;
        this.markAsTouched();
        this.onFieldChanged(this.field);
    }

    // the field model is mutated outside the template (rules, form reset, validation), so OnPush needs an explicit notification
    private listenForExternalChanges(): void {
        if (!this.field) {
            return;
        }
        const refresh = () => this.changeDetectorRef.markForCheck();
        this.formService.formFieldValueChanged
            .pipe(
                filter((event: FormFieldEvent) => event.field === this.field),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(refresh);
        this.formService.formState.commits
            .pipe(
                filter(({ field }) => field === this.field),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(refresh);
        this.field.validationSummaryChanges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(refresh);
    }

    private getSelectedIds(): Set<string> {
        const value = this.field.value;
        if (this.selectedIdsField !== this.field || this.selectedIdsValue !== value) {
            this.selectedIdsField = this.field;
            this.selectedIdsValue = value;
            this.selectedIds = new Set((this.field.getFormValue() as FormFieldOption[]).map((entry) => entry.id));
        }
        return this.selectedIds;
    }

    // keeps the value stable regardless of click order; selections missing from the options stay last
    private sortByOptionOrder(selection: FormFieldOption[]): FormFieldOption[] {
        const position = (entry: FormFieldOption): number => {
            const index = this.field.options.findIndex((candidate) => candidate.id === entry.id);
            return index === -1 ? this.field.options.length : index;
        };
        return [...selection].sort((a, b) => position(a) - position(b));
    }
}
