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
import moment from 'moment-es6';


@Component({
    selector: 'adf-search-date-range',
    templateUrl: './search-date-range.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-date-range' }
})
export class SearchDateRangeComponent implements SearchWidget, OnInit {

    from: FormControl;
    to: FormControl;

    form: FormGroup;
    matcher = new LiveErrorStateMatcher();

    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;

    ngOnInit(): void {
        const validators = Validators.compose([
            Validators.required
        ]);

        this.from = new FormControl('', validators);
        this.to = new FormControl('', validators);

        this.form = new FormGroup({
            from: this.from,
            to: this.to
        });
    }

    apply(model: { from: string, to: string }, isValid: boolean) {
        if (isValid && this.isSelectionValid(model, isValid)) {
            const from = moment(model.from).startOf('day').format();
            const to = moment(model.to).endOf('day').format();
            this.context.queryFragments[this.id] = `${this.settings.field}:['${from}' TO '${to}']`;
            this.context.update();
        }
    }

    reset() {
        this.form.reset({
            from: '',
            to: ''
        });

        this.context.queryFragments[this.id] = '';
        this.context.update();
    }

    isSelectionValid(model: { from: string, to: string }, isValid: boolean) {
        if (isValid) {
            const from = moment(model.from).startOf('day');
            const to = moment(model.to).endOf('day');

            return from.isBefore(to);
        }
        return true;
    }
}

