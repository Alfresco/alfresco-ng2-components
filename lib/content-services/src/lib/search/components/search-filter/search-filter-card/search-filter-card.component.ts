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

import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { SearchWidgetContainerComponent } from '../../search-widget-container/search-widget-container.component';
import { SearchCategory } from '../../../models/search-category.interface';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'adf-search-filter-card',
    standalone: true,
    imports: [CommonModule, SearchWidgetContainerComponent, TranslatePipe, MatButtonModule],
    templateUrl: './search-filter-card.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SearchFilterCardComponent {
    @Input({ required: true })
    category: SearchCategory;

    @ViewChild(SearchWidgetContainerComponent, { static: false })
    widgetContainerComponent: SearchWidgetContainerComponent;

    clear() {
        this.widgetContainerComponent.resetInnerWidget();
    }

    apply() {
        this.widgetContainerComponent.applyInnerWidget();
    }
}
