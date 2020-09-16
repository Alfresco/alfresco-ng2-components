/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, ViewEncapsulation, OnInit, Input, Inject } from '@angular/core';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../../search-query-service.token';
import { SearchPanelQueryBuilderService } from '../../search-panel-query-builder.service';

@Component({
    selector: 'adf-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-panel' }

})
export class SearchPanelComponent implements OnInit {

    @Input()
    customModels: any [] = [];

    constructor(@Inject(SEARCH_QUERY_SERVICE_TOKEN)
        private queryBuilderService: SearchPanelQueryBuilderService) {
    }

    ngOnInit(): void {
        this.queryBuilderService.customModels = this.customModels;
        const currentConfig = this.queryBuilderService.loadConfiguration();
        this.queryBuilderService.categories = [...currentConfig.categories];
    }
}
