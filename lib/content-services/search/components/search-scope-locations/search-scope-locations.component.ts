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
import { MatSelectChange } from '@angular/material';

import { SearchWidget } from '../../search-widget.interface';
import { SearchWidgetSettings } from '../../search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../search-query-builder.service';

@Component({
    selector: 'adf-search-scope-locations',
    templateUrl: './search-scope-locations.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-scope-locations' }
})
export class SearchScopeLocationsComponent implements SearchWidget, OnInit {

    @Input()
    value: string;

    id: string;
    settings: SearchWidgetSettings;
    context: SearchQueryBuilderService;

    ngOnInit() {

        const defaultSelection = (this.settings.options || []).find(opt => opt.default);
        if (defaultSelection) {
            this.flush(defaultSelection.value);
        }
    }

    changeHandler(event: MatSelectChange) {
        this.flush(event.value);
    }

    flush(value: string) {
        this.value = value;
        this.context.scope.locations = value;
        this.context.update();
    }
}
