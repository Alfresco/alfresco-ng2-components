/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { OnInit, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { SearchWidget } from '../../search-widget.interface';
import { SearchWidgetSettings } from '../../search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../search-query-builder.service';
import { LiveErrorStateMatcher } from '../../forms/live-error-state-matcher';

@Component({
    selector: 'adf-search-number-range',
    templateUrl: './search-number-range.component.html',
    styleUrls: ['./search-number-range.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-number-range' }
})
export class SearchNumberRangeComponent implements SearchWidget, OnInit {

    from: FormControl;
    to: FormControl;

    form: FormGroup;
    matcher = new LiveErrorStateMatcher();

    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;

    field: string;
    format = '[{FROM} TO {TO}]';

    validators: Validators;

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

        this.from = new FormControl('', this.validators);
        this.to = new FormControl('', this.validators);

        this.form = new FormGroup({
            from: this.from,
            to: this.to
        }, this.formValidator);
    }

    formValidator(formGroup: FormGroup) {
        return parseInt(formGroup.get('from').value, 10) < parseInt(formGroup.get('to').value, 10) ? null : {'mismatch': true};
    }

    apply(model: { from: string, to: string }, isValid: boolean) {
        if (isValid && this.id && this.context && this.field) {
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

    reset() {
        this.form.reset({
            from: '',
            to: ''
        });

        if (this.id && this.context) {
            this.context.queryFragments[this.id] = '';
            this.context.update();
        }
    }
}
