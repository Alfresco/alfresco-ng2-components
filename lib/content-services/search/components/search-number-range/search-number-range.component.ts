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

    ngOnInit(): void {
        const validators = Validators.compose([
            Validators.required,
            Validators.pattern(/^-?(0|[1-9]\d*)?$/)
        ]);

        this.from = new FormControl('', validators);
        this.to = new FormControl('', validators);

        this.form = new FormGroup({
            from: this.from,
            to: this.to
        });
    }

    apply(model: { from: string, to: string }, isValid: boolean) {
        if (isValid && this.id && this.context && this.settings && this.settings.field) {
            this.context.queryFragments[this.id] = `${this.settings.field}:[${model.from} TO ${model.to}]`;
            this.context.update();
        }
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
