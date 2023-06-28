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

import { SearchWidgetSettings } from './search-widget-settings.interface';
import { SearchQueryBuilderService } from '../services/search-query-builder.service';
import { Subject } from 'rxjs';

export interface SearchWidget {
    id: string;
    /* optional field control options */
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    isActive?: boolean;
    startValue: any;
    /* stream emit value on changes */
    displayValue$: Subject<string>;
    /* reset the value and update the search */
    reset(): void;
    /* update the search with field value */
    submitValues(): void;
    hasValidValue(): boolean;
    getCurrentValue(): any;
    setValue(value: any);
}
