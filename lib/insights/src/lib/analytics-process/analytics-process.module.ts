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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DiagramsModule } from '../diagram/diagram.module';
import { MaterialModule } from '../material.module';

import { ChartsModule } from 'ng2-charts';

import { CoreModule } from '@alfresco/adf-core';
import { AnalyticsGeneratorComponent } from './components/analytics-generator.component';
import { AnalyticsReportHeatMapComponent } from './components/analytics-report-heat-map.component';
import { AnalyticsReportListComponent } from './components/analytics-report-list.component';
import { AnalyticsReportParametersComponent } from './components/analytics-report-parameters.component';
import { AnalyticsComponent } from './components/analytics.component';

import { CheckboxWidgetAnalyticsComponent } from './components/widgets/checkbox/checkbox.widget';
import { DateRangeWidgetComponent } from './components/widgets/date-range/date-range.widget';
import { DropdownWidgetAnalyticsComponent } from './components/widgets/dropdown/dropdown.widget';
import { DurationWidgetComponent } from './components/widgets/duration/duration.widget';
import { NumberWidgetAnalyticsComponent } from './components/widgets/number/number.widget';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        ChartsModule,
        DiagramsModule,
        MaterialModule,
        CoreModule
    ],
    declarations: [
        AnalyticsComponent,
        AnalyticsReportListComponent,
        AnalyticsReportParametersComponent,
        AnalyticsGeneratorComponent,
        AnalyticsReportHeatMapComponent,
        DropdownWidgetAnalyticsComponent,
        NumberWidgetAnalyticsComponent,
        DurationWidgetComponent,
        CheckboxWidgetAnalyticsComponent,
        DateRangeWidgetComponent
    ],
    exports: [
        AnalyticsComponent,
        AnalyticsReportListComponent,
        AnalyticsReportParametersComponent,
        AnalyticsGeneratorComponent,
        AnalyticsReportHeatMapComponent,
        DropdownWidgetAnalyticsComponent,
        NumberWidgetAnalyticsComponent,
        DurationWidgetComponent,
        CheckboxWidgetAnalyticsComponent,
        DateRangeWidgetComponent
    ]
})
export class AnalyticsProcessModule {}
