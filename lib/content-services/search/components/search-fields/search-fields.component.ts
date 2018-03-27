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

import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';

import { SearchWidget } from '../../search-widget.interface';
import { SearchWidgetSettings } from '../../search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../search-query-builder.service';

@Component({
    selector: 'adf-search-fields',
    templateUrl: './search-fields.component.html',
    styleUrls: ['./search-fields.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-fields' }
})
export class SearchFieldsComponent implements SearchWidget, OnInit {

    @Input()
    value: string;

    id: string;
    settings: SearchWidgetSettings;
    context: SearchQueryBuilderService;

    ngOnInit() {
        const defaultOptions = (this.settings.options || [])
            .filter(opt => opt.default)
            .map(opt => {
                opt.checked = true;
                return opt;
            });

        if (defaultOptions.length > 0) {
            this.flush(defaultOptions);
        }
    }

    changeHandler(event: MatCheckboxChange, option: any) {
        option.checked = event.checked;
        this.flush(this.settings.options);
    }

    flush(opts: any[] = []) {
        const checkedValues = opts
            .filter(v => v.checked)
            .map(v => v.fields)
            .reduce((prev, curr) => {
                return prev.concat(curr);
            }, []);

        this.context.fields[this.id] = checkedValues;
        this.context.update();
    }
}
