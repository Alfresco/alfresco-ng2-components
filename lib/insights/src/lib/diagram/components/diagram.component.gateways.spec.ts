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

import * as diagramsGatewaysMock from '../../mock/diagram/diagram-gateways.mock';
import { DiagramComponent } from './diagram.component';
import { InsightsTestingModule } from '../../testing/insights.testing.module';
import { UnitTestingUtils } from '@alfresco/adf-core';
import { RaphaelRhombusDirective } from '@alfresco/adf-insights';
import { DiagramsService } from '../services/diagrams.service';
import { of } from 'rxjs';

describe('Diagrams gateways', () => {
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
        unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
        diagramsService = TestBed.inject(DiagramsService);
        fixture.detectChanges();

        component.processInstanceId = '38399';
        component.processDefinitionId = 'fakeprocess:24:38399';
        component.metricPercentages = { startEvent: 0 };
    });

    afterEach(() => {
        component.success.unsubscribe();
        fixture.destroy();
    });

    describe('Diagrams component Gateways: ', () => {
        it('Should render the Exclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-exclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1 = unitTestingUtils.getByCSS('diagram-exclusive-gateway > raphael-cross');
                    expect(shape1).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.exclusiveGateway] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Inclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-inclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1 = unitTestingUtils.getByCSS('diagram-inclusive-gateway > raphael-circle');
                    expect(shape1).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.inclusiveGateway] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Parallel Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-parallel-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1 = unitTestingUtils.getByCSS('diagram-parallel-gateway > raphael-plus');
                    expect(shape1).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.parallelGateway] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Event Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-event-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1 = unitTestingUtils.getByCSS('diagram-event-gateway');
                    expect(shape1).not.toBeNull();
                    expect(shape1.children.length).toBe(4);

                    const outerCircle = shape1.children[1];
                    expect(outerCircle.nativeElement.localName).toEqual('raphael-circle');

                    const innerCircle = shape1.children[2];
                    expect(innerCircle.nativeElement.localName).toEqual('raphael-circle');

                    const shape2 = unitTestingUtils.getByCSS('diagram-event-gateway > raphael-pentagon');
                    expect(shape2).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.eventGateway] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });
    });

    describe('Diagrams component Gateways with process instance id: ', () => {
        it('Should render the Exclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-exclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1 = unitTestingUtils.getByCSS('diagram-exclusive-gateway > raphael-cross');
                    expect(shape1).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.exclusiveGateway] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Exclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-exclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape.injector.get(RaphaelRhombusDirective).stroke).toBe('#017501');

                    const shape1 = unitTestingUtils.getByCSS('diagram-exclusive-gateway > raphael-cross');
                    expect(shape1).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.exclusiveGatewayActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Exclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-exclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape.injector.get(RaphaelRhombusDirective).stroke).toBe('#2632aa');

                    const shape1 = unitTestingUtils.getByCSS('diagram-exclusive-gateway > raphael-cross');
                    expect(shape1).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.exclusiveGatewayCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Inclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-inclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1 = unitTestingUtils.getByCSS('diagram-inclusive-gateway > raphael-circle');
                    expect(shape1).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.inclusiveGateway] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Inclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-inclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape.injector.get(RaphaelRhombusDirective).stroke).toBe('#017501');

                    const shape1 = unitTestingUtils.getByCSS('diagram-inclusive-gateway > raphael-circle');
                    expect(shape1).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.inclusiveGatewayActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Inclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-inclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape.injector.get(RaphaelRhombusDirective).stroke).toBe('#2632aa');

                    const shape1 = unitTestingUtils.getByCSS('diagram-inclusive-gateway > raphael-circle');
                    expect(shape1).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.inclusiveGatewayCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Parallel Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-parallel-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1 = unitTestingUtils.getByCSS('diagram-parallel-gateway > raphael-plus');
                    expect(shape1).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.parallelGateway] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Parallel Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-parallel-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape.injector.get(RaphaelRhombusDirective).stroke).toBe('#017501');

                    const shape1 = unitTestingUtils.getByCSS('diagram-parallel-gateway > raphael-plus');
                    expect(shape1).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.parallelGatewayActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Parallel Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-parallel-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape.injector.get(RaphaelRhombusDirective).stroke).toBe('#2632aa');

                    const shape1 = unitTestingUtils.getByCSS('diagram-parallel-gateway > raphael-plus');
                    expect(shape1).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.parallelGatewayCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Event Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-event-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1 = unitTestingUtils.getByCSS('diagram-event-gateway');
                    expect(shape1).not.toBeNull();
                    expect(shape1.children.length).toBe(4);

                    const outerCircle = shape1.children[1];
                    expect(outerCircle.nativeElement.localName).toEqual('raphael-circle');

                    const innerCircle = shape1.children[2];
                    expect(innerCircle.nativeElement.localName).toEqual('raphael-circle');

                    const shape2 = unitTestingUtils.getByCSS('diagram-event-gateway > raphael-pentagon');
                    expect(shape2).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.eventGateway] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Event Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-event-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape.injector.get(RaphaelRhombusDirective).stroke).toBe('#017501');

                    const shape1 = unitTestingUtils.getByCSS('diagram-event-gateway');
                    expect(shape1).not.toBeNull();
                    expect(shape1.children.length).toBe(4);

                    const outerCircle = shape1.children[1];
                    expect(outerCircle.nativeElement.localName).toEqual('raphael-circle');

                    const innerCircle = shape1.children[2];
                    expect(innerCircle.nativeElement.localName).toEqual('raphael-circle');

                    const shape2 = unitTestingUtils.getByCSS('diagram-event-gateway > raphael-pentagon');
                    expect(shape2).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.eventGatewayActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Event Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape = unitTestingUtils.getByCSS('diagram-event-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape.injector.get(RaphaelRhombusDirective).stroke).toBe('#2632aa');

                    const shape1 = unitTestingUtils.getByCSS('diagram-event-gateway');
                    expect(shape1).not.toBeNull();
                    expect(shape1.children.length).toBe(4);

                    const outerCircle = shape1.children[1];
                    expect(outerCircle.nativeElement.localName).toEqual('raphael-circle');

                    const innerCircle = shape1.children[2];
                    expect(innerCircle.nativeElement.localName).toEqual('raphael-circle');

                    const shape2 = unitTestingUtils.getByCSS('diagram-event-gateway > raphael-pentagon');
                    expect(shape2).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsGatewaysMock.eventGatewayCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });
    });
});
