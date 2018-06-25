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

import * as boundaryEventMock from '../../mock/diagram/diagramBoundary.mock';
import { DiagramComponent } from './diagram.component';
import { setupTestBed } from '@alfresco/adf-core';
import { InsightsTestingModule } from '../../testing/insights.testing.module';

declare let jasmine: any;

describe('Diagrams boundary', () => {

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

    describe('Diagrams component Boundary events with process instance id: ', () => {

        it('Should render the Boundary time event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryTimeEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Boundary time event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-boundary-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryTimeEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Boundary time event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-boundary-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryTimeEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Boundary error event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryErrorEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Boundary error event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-boundary-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryErrorEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Boundary error event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-boundary-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryErrorEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Boundary signal event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundarySignalEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Boundary signal event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-boundary-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundarySignalEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Boundary signal event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-boundary-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundarySignalEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Boundary signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryMessageEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Boundary signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-boundary-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryMessageEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Boundary signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-boundary-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryMessageEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Boundary signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryMessageEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Boundary signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-boundary-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryMessageEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Boundary signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-boundary-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryMessageEventCompleted] };
            ajaxReply(resp);
        }));
    });

    describe('Diagrams component Boundary events: ', () => {

        it('Should render the Boundary time event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryTimeEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Boundary error event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryErrorEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Boundary signal event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundarySignalEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Boundary signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryMessageEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Boundary signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-boundary-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-boundary-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [boundaryEventMock.boundaryMessageEvent] };
            ajaxReply(resp);
        }));
    });

});
