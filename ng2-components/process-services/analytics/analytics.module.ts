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

import { TRANSLATION_PROVIDER } from '@alfresco/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DiagramsModule } from '../diagram';
import { MaterialModule } from '../material.module';

import { ChartsModule } from 'ng2-charts';

import { ToolbarModule } from '@alfresco/core/toolbar';
import { AnalyticsGeneratorComponent } from './components/analytics-generator.component';
import { AnalyticsReportHeatMapComponent } from './components/analytics-report-heat-map.component';
import { AnalyticsReportListComponent } from './components/analytics-report-list.component';
import { AnalyticsReportParametersComponent } from './components/analytics-report-parameters.component';
import { AnalyticsComponent } from './components/analytics.component';
import { WIDGET_ANALYTICS_DIRECTIVES } from './components/widgets/index';
import { AnalyticsService } from './services/analytics.service';

export const ANALYTICS_DIRECTIVES: any[] = [
    AnalyticsComponent,
    AnalyticsReportListComponent,
    AnalyticsReportParametersComponent,
    AnalyticsGeneratorComponent,
    AnalyticsReportHeatMapComponent,
    WIDGET_ANALYTICS_DIRECTIVES
];

export const ANALYTICS_PROVIDERS: any[] = [
    AnalyticsService
];

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        ChartsModule,
        DiagramsModule,
        MaterialModule,
        TranslateModule,
        ToolbarModule
    ],
    declarations: [
        ...ANALYTICS_DIRECTIVES
    ],
    providers: [
        ...ANALYTICS_PROVIDERS,
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'ng2-activiti-analytics',
                source: 'assets/ng2-activiti-analytics'
            }
        }
    ],
    exports: [
        ...ANALYTICS_DIRECTIVES,
        MaterialModule
    ]
})
export class AnalyticsModule {}
