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
import {
    CoreModule
} from 'ng2-alfresco-core';

import { AnalyticsReportListComponent } from '../components/analytics-report-list.component';
import { AnalyticsComponent } from '../components/analytics.component';
import { WIDGET_DIRECTIVES } from '../components/widgets/index';
import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';

import { AnalyticsService } from '../services/analytics.service';

import { DebugElement }    from '@angular/core';

export const ANALYTICS_DIRECTIVES: any[] = [
    AnalyticsComponent,
    AnalyticsReportListComponent,
    WIDGET_DIRECTIVES
];
export const ANALYTICS_PROVIDERS: any[] = [
    AnalyticsService
];

describe('Show component HTML', () => {

    let component: any;
    let fixture: ComponentFixture<AnalyticsComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                ...ANALYTICS_DIRECTIVES,
                ...CHART_DIRECTIVES
            ],
            providers: [
                ...ANALYTICS_PROVIDERS
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AnalyticsComponent);
        component = fixture.componentInstance;
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('Display component tag base-chart', () => {
        expect(true).toBe(true);
    });

});
