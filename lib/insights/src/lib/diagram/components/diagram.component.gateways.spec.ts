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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import * as diagramsGatewaysMock from '../../mock/diagram/diagram-gateways.mock';
import { DiagramComponent } from './diagram.component';
import { setupTestBed } from '@alfresco/adf-core';
import { InsightsTestingModule } from '../../testing/insights.testing.module';
import { TranslateModule } from '@ngx-translate/core';

declare let jasmine: any;

describe('Diagrams gateways', () => {

    let component: any;
    let fixture: ComponentFixture<DiagramComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            InsightsTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DiagramComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    beforeEach(() => {
        jasmine.Ajax.install();
        component.processInstanceId = '38399';
        component.processDefinitionId = 'fakeprocess:24:38399';
        component.metricPercentages = { startEvent: 0 };
    });

    afterEach(() => {
        component.success.unsubscribe();
        fixture.destroy();
        jasmine.Ajax.uninstall();
    });

    const ajaxReply =  (resp: any) => {
        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: resp
        });
    };

    describe('Diagrams component Gateways: ', () => {

        it('Should render the Exclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-exclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-exclusive-gateway > raphael-cross');
                    expect(shape1).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.exclusiveGateway] };
            ajaxReply(resp);
        });

        it('Should render the Inclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-inclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-inclusive-gateway > raphael-circle');
                    expect(shape1).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.inclusiveGateway] };
            ajaxReply(resp);
        });

        it('Should render the Parallel Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-parallel-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-parallel-gateway > raphael-plus');
                    expect(shape1).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.parallelGateway] };
            ajaxReply(resp);
        });

        it('Should render the Event Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-event-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-event-gateway');
                    expect(shape1).not.toBeNull();
                    expect(shape1.children.length).toBe(4);

                    const outerCircle = shape1.children[1];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape1.children[2];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const shape2: any = element.querySelector('diagram-event-gateway > raphael-pentagon');
                    expect(shape2).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.eventGateway] };
            ajaxReply(resp);
        });
    });

    describe('Diagrams component Gateways with process instance id: ', () => {

        it('Should render the Exclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-exclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-exclusive-gateway > raphael-cross');
                    expect(shape1).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.exclusiveGateway] };
            ajaxReply(resp);
        });

        it('Should render the Active Exclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-exclusive-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#017501"]');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-exclusive-gateway > raphael-cross');
                    expect(shape1).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.exclusiveGatewayActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Exclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-exclusive-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#2632aa"]');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-exclusive-gateway > raphael-cross');
                    expect(shape1).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.exclusiveGatewayCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Inclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-inclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-inclusive-gateway > raphael-circle');
                    expect(shape1).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.inclusiveGateway] };
            ajaxReply(resp);
        });

        it('Should render the Active Inclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-inclusive-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#017501"]');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-inclusive-gateway > raphael-circle');
                    expect(shape1).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.inclusiveGatewayActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Inclusive Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-inclusive-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#2632aa"]');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-inclusive-gateway > raphael-circle');
                    expect(shape1).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.inclusiveGatewayCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Parallel Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-parallel-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-parallel-gateway > raphael-plus');
                    expect(shape1).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.parallelGateway] };
            ajaxReply(resp);
        });

        it('Should render the Active Parallel Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-parallel-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#017501"]');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-parallel-gateway > raphael-plus');
                    expect(shape1).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.parallelGatewayActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Parallel Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-parallel-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#2632aa"]');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-parallel-gateway > raphael-plus');
                    expect(shape1).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.parallelGatewayCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Event Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-event-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-event-gateway');
                    expect(shape1).not.toBeNull();
                    expect(shape1.children.length).toBe(4);

                    const outerCircle = shape1.children[1];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape1.children[2];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const shape2: any = element.querySelector('diagram-event-gateway > raphael-pentagon');
                    expect(shape2).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.eventGateway] };
            ajaxReply(resp);
        });

        it('Should render the Active Event Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-event-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#017501"]');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-event-gateway');
                    expect(shape1).not.toBeNull();
                    expect(shape1.children.length).toBe(4);

                    const outerCircle = shape1.children[1];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape1.children[2];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const shape2: any = element.querySelector('diagram-event-gateway > raphael-pentagon');
                    expect(shape2).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.eventGatewayActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Event Gateway', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-event-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#2632aa"]');
                    expect(shape).not.toBeNull();

                    const shape1: any = element.querySelector('diagram-event-gateway');
                    expect(shape1).not.toBeNull();
                    expect(shape1.children.length).toBe(4);

                    const outerCircle = shape1.children[1];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape1.children[2];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const shape2: any = element.querySelector('diagram-event-gateway > raphael-pentagon');
                    expect(shape2).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsGatewaysMock.eventGatewayCompleted] };
            ajaxReply(resp);
        });
    });
});
