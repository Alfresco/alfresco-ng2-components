/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { LiveErrorStateMatcher } from '../../forms/live-error-state-matcher';
import { Subject } from 'rxjs';

@Component({
    selector: 'adf-search-number-range',
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
    displayValue$: Subject<string> = new Subject<string>();

    ngOnInit(): void {

        if (this.settings) {
            this.field = this.settings.field;
            this.format = this.settings.format || '[{FROM} TO {TO}]';
        }

        this.validators = Validators.compose([
            Validators.required,
            Validators.pattern(/^-?(0|[1-9]\d*)?$/),
            Validators.min(0)
        ]);

        if (this.startValue) {
            this.from = new UntypedFormControl(this.startValue['from'], this.validators);
            this.to = new UntypedFormControl(this.startValue['to'], this.validators);
        } else {
            this.from = new UntypedFormControl('', this.validators);
            this.to = new UntypedFormControl('', this.validators);
        }

        this.form = new UntypedFormGroup({
            from: this.from,
            to: this.to
        }, this.formValidator);

        this.enableChangeUpdate = this.settings?.allowUpdateOnChange ?? true;
        this.updateDisplayValue();
    }

    formValidator(formGroup: UntypedFormGroup) {
        return parseInt(formGroup.get('from').value, 10) < parseInt(formGroup.get('to').value, 10) ? null : {mismatch: true};
    }

    apply(model: { from: string; to: string }, isValid: boolean) {
        if (isValid && this.id && this.context && this.field) {
            this.updateDisplayValue();
            this.isActive = true;

            const map = new Map<string, string>();
            map.set('FROM', model.from);
            map.set('TO', model.to);

            const value = this.formatString(this.format, map);

            this.context.queryFragments[this.id] = `${this.field}:${value}`;
            this.context.update();
        }
    }

    private formatString(str: string, map: Map<string, string>): string {
        let result = str;

        map.forEach((value, key) => {
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

    clear() {
        this.isActive = false;

        this.form.reset({
            from: '',
            to: ''
        });

        if (this.id && this.context) {
            this.context.queryFragments[this.id] = '';
            this.updateDisplayValue();
            if (this.enableChangeUpdate) {
                this.context.update();
            }
        }
    }

    reset() {
        this.clear();
        if (this.id && this.context) {
            this.context.update();
        }
    }
}
