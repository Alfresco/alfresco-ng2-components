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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as structuralMock from '../../mock/diagram/diagram-structural.mock';
import { DiagramComponent } from './diagram.component';
import { InsightsTestingModule } from '../../testing/insights.testing.module';
import { UnitTestingUtils } from '@alfresco/adf-core';
import { RaphaelRectDirective } from '@alfresco/adf-insights';
import { DiagramsService } from '../services/diagrams.service';
import { of } from 'rxjs';

describe('Diagrams structural', () => {
    let component: any;
    let fixture: ComponentFixture<DiagramComponent>;
    let unitTestingUtils: UnitTestingUtils;
    let diagramsService: DiagramsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [InsightsTestingModule]
        });
        fixture = TestBed.createComponent(DiagramComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
        diagramsService = TestBed.inject(DiagramsService);

        component.processInstanceId = '38399';
        component.processDefinitionId = 'fakeprocess:24:38399';
        component.metricPercentages = { startEvent: 0 };
    });

    afterEach(() => {
        component.success.unsubscribe();
        fixture.destroy();
    });

    describe('Diagrams component Structural: ', () => {
        it('Should render the Subprocess', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-subprocess > raphael-rect');
                    expect(shape).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [structuralMock.subProcess] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Event Subprocess', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-event-subprocess > raphael-rect');
                    expect(shape).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [structuralMock.eventSubProcess] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });
    });

    describe('Diagrams component Structural with process instance id: ', () => {
        it('Should render the Subprocess', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-subprocess > raphael-rect');
                    expect(shape).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [structuralMock.subProcess] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Subprocess', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-subprocess > raphael-rect');
                    expect(shape.injector.get(RaphaelRectDirective).stroke).toBe('#017501');

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [structuralMock.subProcessActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Subprocess', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-subprocess > raphael-rect');
                    expect(shape.injector.get(RaphaelRectDirective).stroke).toBe('#2632aa');

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [structuralMock.subProcessCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Event Subprocess', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-event-subprocess > raphael-rect');
                    expect(shape).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [structuralMock.eventSubProcess] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Event Subprocess', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-event-subprocess > raphael-rect');
                    expect(shape.injector.get(RaphaelRectDirective).stroke).toBe('#017501');

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [structuralMock.eventSubProcessActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Event Subprocess', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-event-subprocess > raphael-rect');
                    expect(shape.injector.get(RaphaelRectDirective).stroke).toBe('#2632aa');

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [structuralMock.eventSubProcessCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });
    });
});
