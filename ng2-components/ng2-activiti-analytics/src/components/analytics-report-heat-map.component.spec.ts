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

import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DiagramsModule } from 'ng2-activiti-diagrams';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { AnalyticsReportHeatMapComponent } from '../components/analytics-report-heat-map.component';
import { WIDGET_DIRECTIVES } from '../components/widgets/index';
import { MaterialModule } from '../material.module';
import { AnalyticsService } from '../services/analytics.service';

declare let jasmine: any;

describe('AnalyticsReportHeatMapComponent', () => {

    let componentHandler: any;
    let component: AnalyticsReportHeatMapComponent;
    let fixture: ComponentFixture<AnalyticsReportHeatMapComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    let totalCountPerc = { 'sid-fake-id': 0, 'fake-start-event': 100 };
    let totalTimePerc = { 'sid-fake-id': 10, 'fake-start-event': 30 };
    let avgTimePercentages = { 'sid-fake-id': 5, 'fake-start-event': 50 };

    let totalCountValues = { 'sid-fake-id': 2, 'fake-start-event': 3 };
    let totalTimeValues = { 'sid-fake-id': 1, 'fake-start-event': 4 };
    let avgTimeValues = { 'sid-fake-id': 4, 'fake-start-event': 5 };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                DiagramsModule.forRoot(),
                MaterialModule
            ],
            declarations: [
                AnalyticsReportHeatMapComponent,
                ...WIDGET_DIRECTIVES
            ],
            providers: [
                AnalyticsService
            ]
        }).compileComponents();

        let translateService = TestBed.get(AlfrescoTranslationService);
        spyOn(translateService, 'addTranslationFolder').and.stub();
        spyOn(translateService, 'get').and.callFake((key) => { return Observable.of(key); });

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AnalyticsReportHeatMapComponent);
        component = fixture.componentInstance;
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);
        window['componentHandler'] = componentHandler;

        component.report = {
            totalCountsPercentages: totalCountPerc,
            totalCountValues: totalCountValues,
            totalTimePercentages: totalTimePerc,
            totalTimeValues: totalTimeValues,
            avgTimeValues: avgTimeValues,
            avgTimePercentages: avgTimePercentages
        };
    });

    describe('Rendering tests: Heat Map', () => {

        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should render the dropdown with the metric options', async(() => {
            component.report = { totalCountsPercentages: { 'sid-fake-id': 10, 'fake-start-event': 30 } };

            component.onSuccess.subscribe(() => {
                fixture.whenStable().then(() => {
                    let dropDown: any = element.querySelector('#select-metrics');
                    expect(dropDown).toBeDefined();
                    expect(dropDown.length).toEqual(3);
                    expect(dropDown[0].innerHTML).toEqual('Number of times a step is executed');
                    expect(dropDown[1].innerHTML).toEqual('Total time spent in a process step');
                    expect(dropDown[2].innerHTML).toEqual('Average time spent in a process step');
                });
            });
            fixture.detectChanges();
        }));

        it('should return false when no metrics are defined in the report', async(() => {
            component.report = {};
            expect(component.hasMetric()).toBeFalsy();
        }));

        it('should return true when the metrics are defined in the report', async(() => {
            expect(component.hasMetric()).toBeTruthy();
        }));

        it('should change the currentmetric width totalCount', async(() => {
            let field = { value: 'totalCount' };
            component.onMetricChanges(field);
            expect(component.currentMetric).toEqual(totalCountValues);
            expect(component.currentMetricColors).toEqual(totalCountPerc);
        }));

        it('should change the currentmetric width totalTime', async(() => {
            let field = { value: 'totalTime' };
            component.onMetricChanges(field);
            expect(component.currentMetric).toEqual(totalTimeValues);
            expect(component.currentMetricColors).toEqual(totalTimePerc);
        }));

        it('should change the currentmetric width avgTime', async(() => {
            let field = { value: 'avgTime' };
            component.onMetricChanges(field);
            expect(component.currentMetric).toEqual(avgTimeValues);
            expect(component.currentMetricColors).toEqual(avgTimePercentages);
        }));

    });

});
