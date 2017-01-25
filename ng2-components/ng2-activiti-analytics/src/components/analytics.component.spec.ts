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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';
import { CoreModule, AlfrescoTranslationService } from 'ng2-alfresco-core';
import { DiagramsModule } from 'ng2-activiti-diagrams';

import { AnalyticsReportListComponent } from '../components/analytics-report-list.component';
import { AnalyticsComponent } from '../components/analytics.component';
import { AnalyticsGeneratorComponent } from '../components/analytics-generator.component';
import { AnalyticsReportParametersComponent } from '../components/analytics-report-parameters.component';
import { AnalyticsReportHeatMapComponent } from '../components/analytics-report-heat-map.component';
import { WIDGET_DIRECTIVES } from '../components/widgets/index';
import { AnalyticsService } from '../services/analytics.service';

export const ANALYTICS_DIRECTIVES: any[] = [
    AnalyticsComponent,
    AnalyticsGeneratorComponent,
    AnalyticsReportParametersComponent,
    AnalyticsReportListComponent,
    AnalyticsReportHeatMapComponent,
    WIDGET_DIRECTIVES
];
export const ANALYTICS_PROVIDERS: any[] = [
    AnalyticsService
];

declare let jasmine: any;
declare let mdDateTimePicker: any;

describe('AnalyticsComponent', () => {

    let component: any;
    let fixture: ComponentFixture<AnalyticsComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    let componentHandler: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                DiagramsModule.forRoot()
            ],
            declarations: [
                ...ANALYTICS_DIRECTIVES,
                ...CHART_DIRECTIVES
            ],
            providers: [
                ...ANALYTICS_PROVIDERS
            ]
        }).compileComponents();

        let translateService = TestBed.get(AlfrescoTranslationService);
        spyOn(translateService, 'addTranslationFolder').and.stub();
        spyOn(translateService, 'get').and.callFake((key) => { return Observable.of(key); });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AnalyticsComponent);
        component = fixture.componentInstance;
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        fixture.detectChanges();
        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);
        window['componentHandler'] = componentHandler;
    });

    describe('Rendering tests', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

    });
});
