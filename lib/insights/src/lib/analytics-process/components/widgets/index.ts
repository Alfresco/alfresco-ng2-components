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

import { CheckboxWidgetAnalyticsComponent } from './checkbox/checkbox.widget';
import { DateRangeWidgetComponent } from './date-range/date-range.widget';
import { DropdownWidgetAnalyticsComponent } from './dropdown/dropdown.widget';
import { DurationWidgetComponent } from './duration/duration.widget';
import { NumberWidgetAnalyticsComponent } from './number/number.widget';

export * from './checkbox/checkbox.widget';
export * from './date-range/date-range.widget';
export * from './dropdown/dropdown.widget';
export * from './duration/duration.widget';
export * from './number/number.widget';

export const WIDGET_DIRECTIVES = [
    CheckboxWidgetAnalyticsComponent,
    DateRangeWidgetComponent,
    DropdownWidgetAnalyticsComponent,
    DurationWidgetComponent,
    NumberWidgetAnalyticsComponent
] as const;
