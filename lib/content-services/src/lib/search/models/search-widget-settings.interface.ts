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

import { AutocompleteOption } from './autocomplete-option.interface';

export interface SearchWidgetSettings {
    field: string;
    /* allow the user to update search in every change */
    allowUpdateOnChange?: boolean;
    /* allow the user hide default search actions. So widget can have custom actions */
    hideDefaultAction?: boolean;
    /* describes the unit of the value i.e byte for better display message */
    unit?: string;
    /* describes query format */
    format?: string;
    /* allow the user to search only within predefined options */
    allowOnlyPredefinedValues?: boolean;
    /* allow the user to predefine autocomplete options */
    autocompleteOptions?: AutocompleteOption[];

    [indexer: string]: any;
}
