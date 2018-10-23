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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import * as diagramsGatewaysMock from '../../mock/diagram/diagramGateways.mock';
import { DiagramComponent } from './diagram.component';
import { setupTestBed } from '@alfresco/adf-core';
import { InsightsTestingModule } from '../../testing/insights.testing.module';

declare let jasmine: any;

describe('Diagrams gateways', () => {

    let component: any;
    let fixture: ComponentFixture<DiagramComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [InsightsTestingModule]
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

    let ajaxReply =  (resp: any) => {
        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: resp
        });
    };

    describe('Diagrams component Gateways: ', () => {

        it('Should render the Exclusive Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-exclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-exclusive-gateway > raphael-cross');
                    expect(shape1).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.exclusiveGateway] };
            ajaxReply(resp);
        }));

        it('Should render the Inclusive Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-inclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-inclusive-gateway > raphael-circle');
                    expect(shape1).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.inclusiveGateway] };
            ajaxReply(resp);
        }));

        it('Should render the Parallel Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-parallel-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-parallel-gateway > raphael-plus');
                    expect(shape1).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.parallelGateway] };
            ajaxReply(resp);
        }));

        it('Should render the Event Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-event-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-event-gateway');
                    expect(shape1).not.toBeNull();
                    expect(shape1.children.length).toBe(4);

                    let outerCircle = shape1.children[1];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape1.children[2];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let shape2: any = element.querySelector('diagram-event-gateway > raphael-pentagon');
                    expect(shape2).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.eventGateway] };
            ajaxReply(resp);
        }));
    });

    describe('Diagrams component Gateways with process instance id: ', () => {

        it('Should render the Exclusive Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-exclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-exclusive-gateway > raphael-cross');
                    expect(shape1).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.exclusiveGateway] };
            ajaxReply(resp);
        }));

        it('Should render the Active Exclusive Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-exclusive-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#017501"]');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-exclusive-gateway > raphael-cross');
                    expect(shape1).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.exclusiveGatewayActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Exclusive Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-exclusive-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#2632aa"]');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-exclusive-gateway > raphael-cross');
                    expect(shape1).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.exclusiveGatewayCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Inclusive Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-inclusive-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-inclusive-gateway > raphael-circle');
                    expect(shape1).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.inclusiveGateway] };
            ajaxReply(resp);
        }));

        it('Should render the Active Inclusive Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-inclusive-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#017501"]');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-inclusive-gateway > raphael-circle');
                    expect(shape1).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.inclusiveGatewayActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Inclusive Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-inclusive-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#2632aa"]');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-inclusive-gateway > raphael-circle');
                    expect(shape1).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.inclusiveGatewayCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Parallel Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-parallel-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-parallel-gateway > raphael-plus');
                    expect(shape1).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.parallelGateway] };
            ajaxReply(resp);
        }));

        it('Should render the Active Parallel Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-parallel-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#017501"]');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-parallel-gateway > raphael-plus');
                    expect(shape1).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.parallelGatewayActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Parallel Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-parallel-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#2632aa"]');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-parallel-gateway > raphael-plus');
                    expect(shape1).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.parallelGatewayCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Event Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-event-gateway > diagram-gateway > raphael-rhombus');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-event-gateway');
                    expect(shape1).not.toBeNull();
                    expect(shape1.children.length).toBe(4);

                    let outerCircle = shape1.children[1];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape1.children[2];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let shape2: any = element.querySelector('diagram-event-gateway > raphael-pentagon');
                    expect(shape2).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.eventGateway] };
            ajaxReply(resp);
        }));

        it('Should render the Active Event Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-event-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#017501"]');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-event-gateway');
                    expect(shape1).not.toBeNull();
                    expect(shape1.children.length).toBe(4);

                    let outerCircle = shape1.children[1];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape1.children[2];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let shape2: any = element.querySelector('diagram-event-gateway > raphael-pentagon');
                    expect(shape2).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.eventGatewayActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Event Gateway', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-event-gateway > diagram-gateway > raphael-rhombus[ng-reflect-stroke="#2632aa"]');
                    expect(shape).not.toBeNull();

                    let shape1: any = element.querySelector('diagram-event-gateway');
                    expect(shape1).not.toBeNull();
                    expect(shape1.children.length).toBe(4);

                    let outerCircle = shape1.children[1];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape1.children[2];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let shape2: any = element.querySelector('diagram-event-gateway > raphael-pentagon');
                    expect(shape2).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsGatewaysMock.eventGatewayCompleted] };
            ajaxReply(resp);
        }));
    });

});
