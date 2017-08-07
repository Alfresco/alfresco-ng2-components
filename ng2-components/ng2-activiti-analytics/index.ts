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

import { ModuleWithProviders, NgModule } from '@angular/core';
import { MdButtonModule, MdIconModule, MdTooltipModule } from '@angular/material';
import { DiagramsModule } from 'ng2-activiti-diagrams';
import { CoreModule } from 'ng2-alfresco-core';

import { ChartsModule } from 'ng2-charts';
import { AnalyticsGeneratorComponent } from './src/components/analytics-generator.component';
import { AnalyticsReportHeatMapComponent } from './src/components/analytics-report-heat-map.component';
import { AnalyticsReportListComponent } from './src/components/analytics-report-list.component';
import { AnalyticsReportParametersComponent } from './src/components/analytics-report-parameters.component';
import { AnalyticsComponent } from './src/components/analytics.component';
import { AnalyticsService } from './src/services/analytics.service';

import { WIDGET_DIRECTIVES } from './src/components/widgets/index';

export * from './src/components/analytics.component';
export * from './src/components/analytics-generator.component';
export * from './src/components/analytics-report-list.component';
export * from './src/components/analytics-report-parameters.component';
export * from './src/services/analytics.service';
export * from './src/components/widgets/index';

export const ANALYTICS_DIRECTIVES: any[] = [
    AnalyticsComponent,
    AnalyticsReportListComponent,
    AnalyticsReportParametersComponent,
    AnalyticsGeneratorComponent,
    AnalyticsReportHeatMapComponent,
    WIDGET_DIRECTIVES
];

export const ANALYTICS_PROVIDERS: any[] = [
    AnalyticsService
];

@NgModule({
    imports: [
        CoreModule,
        ChartsModule,
        DiagramsModule,
        MdTooltipModule,
        MdButtonModule,
        MdIconModule
    ],
    declarations: [
        ...ANALYTICS_DIRECTIVES
    ],
    providers: [
        ...ANALYTICS_PROVIDERS
    ],
    exports: [
        ...ANALYTICS_DIRECTIVES,
        MdTooltipModule,
        MdButtonModule,
        MdIconModule
    ]
})
export class AnalyticsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AnalyticsModule,
            providers: [
                ...ANALYTICS_PROVIDERS
            ]
        };
    }
}
