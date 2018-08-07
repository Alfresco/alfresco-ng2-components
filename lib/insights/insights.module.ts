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

import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, TRANSLATION_PROVIDER } from '@alfresco/adf-core';

import { DiagramsModule } from './diagram/diagram.module';
import { AnalyticsProcessModule } from './analytics-process/analytics-process.module';

import { MaterialModule } from './material.module';
import { DiagramsService } from './diagram/services/diagrams.service';
import { DiagramColorService } from './diagram/services/diagram-color.service';
import { RaphaelService } from './diagram/components/raphael/raphael.service';
import { AnalyticsService } from './analytics-process/services/analytics.service';

export function providers() {
    return [
        AnalyticsService,
        DiagramsService,
        DiagramColorService,
        RaphaelService
    ];
}

@NgModule({
    imports: [
        CoreModule.forChild(),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        DiagramsModule,
        AnalyticsProcessModule
    ],
    providers: [
        ...providers(),
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'adf-insights',
                source: 'assets/adf-insights'
            }
        }
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        DiagramsModule,
        AnalyticsProcessModule
    ]
})
export class InsightsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: InsightsModule,
            providers: [
                ...providers(),
                {
                    provide: TRANSLATION_PROVIDER,
                    multi: true,
                    useValue: {
                        name: 'adf-insights',
                        source: 'assets/adf-insights'
                    }
                }
            ]
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: InsightsModuleLazy
        };
    }
}

@NgModule({
    imports: [
        CoreModule.forChild(),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        DiagramsModule,
        AnalyticsProcessModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        DiagramsModule,
        AnalyticsProcessModule
    ]
})
export class InsightsModuleLazy {}
