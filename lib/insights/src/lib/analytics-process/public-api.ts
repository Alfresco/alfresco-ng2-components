/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { WIDGET_DIRECTIVES } from './components/widgets';
import { AnalyticsComponent } from './components/analytics.component';
import { AnalyticsReportListComponent } from './components/analytics-report-list.component';
import { AnalyticsReportParametersComponent } from './components/analytics-report-parameters.component';
import { AnalyticsGeneratorComponent } from './components/analytics-generator.component';
import { AnalyticsReportHeatMapComponent } from './components/analytics-report-heat-map.component';
import { ButtonsMenuComponent } from './components/buttons-menu/buttons-menu.component';

export * from './components/analytics.component';
export * from './components/analytics-report-heat-map.component';
export * from './components/analytics-generator.component';
export * from './components/analytics-report-list.component';
export * from './components/analytics-report-parameters.component';
export * from './components/analytics.component';
export * from './components/buttons-menu/buttons-menu.component';

export * from './services/analytics.service';
export * from './components/widgets';

export const ANALYTICS_PROCESS_DIRECTIVES = [
    ...WIDGET_DIRECTIVES,
    ButtonsMenuComponent,
    AnalyticsComponent,
    AnalyticsReportListComponent,
    AnalyticsReportParametersComponent,
    AnalyticsGeneratorComponent,
    AnalyticsReportHeatMapComponent
] as const;
