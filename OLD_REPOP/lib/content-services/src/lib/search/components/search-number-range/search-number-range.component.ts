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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { LiveErrorStateMatcher } from '../../forms/live-error-state-matcher';
import { ReplaySubject } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'adf-search-number-range',
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, TranslatePipe, MatButtonModule],
    templateUrl: './search-number-range.component.html',
    styleUrls: ['./search-number-range.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-number-range' }
})
export class SearchNumberRangeComponent implements SearchWidget, OnInit {
    from: UntypedFormControl;
    to: UntypedFormControl;

    form: UntypedFormGroup;
    matcher = new LiveErrorStateMatcher();

    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;

    field: string;
    format = '[{FROM} TO {TO}]';

    isActive = false;
    startValue: any;

    validators: Validators;
    enableChangeUpdate: boolean;
    displayValue$ = new ReplaySubject<string>(1);

    ngOnInit(): void {
        if (this.settings) {
            this.field = this.settings.field;
            this.format = this.settings.format || '[{FROM} TO {TO}]';
        }

        this.validators = Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.min(0)]);

        if (this.startValue) {
            this.from = new UntypedFormControl(this.startValue['from'], this.validators);
            this.to = new UntypedFormControl(this.startValue['to'], this.validators);
        } else {
            this.from = new UntypedFormControl('', this.validators);
            this.to = new UntypedFormControl('', this.validators);
        }

        this.form = new UntypedFormGroup(
            {
                from: this.from,
                to: this.to
            },
            this.formValidator
        );

        this.enableChangeUpdate = this.settings?.allowUpdateOnChange ?? true;
        this.updateDisplayValue();
        this.context.populateFilters
            .asObservable()
            .pipe(
                map((filtersQueries) => filtersQueries[this.id]),
                first()
            )
            .subscribe((filterQuery) => {
                if (filterQuery) {
                    this.form.patchValue({ from: filterQuery.from, to: filterQuery.to });
                    this.form.markAsDirty();
                    this.apply({ from: filterQuery.from, to: filterQuery.to }, true, false);
                } else {
                    this.reset(false);
                }
                this.context.filterLoaded.next();
            });
    }

    formValidator(formGroup: UntypedFormGroup) {
        return parseInt(formGroup.get('from').value, 10) < parseInt(formGroup.get('to').value, 10) ? null : { mismatch: true };
    }

    apply(model: { from: string; to: string }, isValid: boolean, updateContext = true) {
        if (isValid && this.id && this.context && this.field) {
            this.updateDisplayValue();
            this.isActive = true;

            const destinationObject = new Map<string, string>();
            destinationObject.set('FROM', model.from);
            destinationObject.set('TO', model.to);

            const value = this.formatString(this.format, destinationObject);

            this.context.queryFragments[this.id] = `${this.field}:${value}`;
            const filterParam = this.context.filterRawParams[this.id] ?? {};
            this.context.filterRawParams[this.id] = filterParam;
            filterParam.from = model.from;
            filterParam.to = model.to;
            if (updateContext) {
                this.context.update();
            }
        }
    }

    private formatString(str: string, destinationObject: Map<string, string>): string {
        let result = str;

        destinationObject.forEach((value, key) => {
            const expr = new RegExp('{' + key + '}', 'gm');
            result = result.replace(expr, value);
        });

        return result;
    }

    submitValues() {
        this.apply(this.form.value, this.form.valid);
    }

    hasValidValue() {
        return this.form.valid;
    }

    getCurrentValue() {
        return this.form.value;
    }

    updateDisplayValue(): void {
        if (this.form.invalid || this.form.pristine) {
            this.displayValue$.next('');
        } else {
            this.displayValue$.next(`${this.form.value.from} - ${this.form.value.to} ${this.settings.unit ?? ''}`);
        }
    }

    setValue(value: any) {
        this.form['from'].setValue(value);
        this.form['to'].setValue(value);
        this.updateDisplayValue();
    }

    clear(updateContext = true) {
        this.isActive = false;

        this.form.reset({
            from: '',
            to: ''
        });

        if (this.id && this.context) {
            this.context.queryFragments[this.id] = '';
            this.context.filterRawParams[this.id] = undefined;
            this.updateDisplayValue();
            if (this.enableChangeUpdate && updateContext) {
                this.context.update();
            }
        }
    }

    reset(updateContext = true) {
        this.clear();
        if (this.id && this.context && updateContext) {
            this.context.update();
        }
    }
}
