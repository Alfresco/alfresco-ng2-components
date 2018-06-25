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

import * as throwEventMock from '../../mock/diagram/diagramThrow.mock';
import { DiagramComponent } from './diagram.component';
import { setupTestBed } from '@alfresco/adf-core';
import { InsightsTestingModule } from '../../testing/insights.testing.module';

declare let jasmine: any;

describe('Diagrams throw', () => {

    let component: any;
    let fixture: ComponentFixture<DiagramComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [InsightsTestingModule]
    });

    beforeEach(async(() => {
        jasmine.Ajax.install();

        fixture = TestBed.createComponent(DiagramComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        component.processInstanceId = '38399';
        component.processDefinitionId = 'fakeprocess:24:38399';
        component.metricPercentages = { startEvent: 0 };

        fixture.detectChanges();
    }));

    afterEach(() => {
        component.success.unsubscribe();
        fixture.destroy();
        jasmine.Ajax.uninstall();
    });

    let ajaxReply = (resp: any) => {
        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: resp
        });
    };

    describe('Diagrams component Throw events with process instance id: ', () => {

        it('Should render the Throw time event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwTimeEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Throw time event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-throw-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwTimeEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Throw time event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-throw-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwTimeEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Throw error event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwErrorEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Throw error event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-throw-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwErrorEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Throw error event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-throw-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwErrorEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Throw signal event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwSignalEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Throw signal event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-throw-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwSignalEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Throw signal event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-throw-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwSignalEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Throw signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwMessageEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Throw signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-throw-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwMessageEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Throw signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-throw-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwMessageEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Throw signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwMessageEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Throw signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-throw-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwMessageEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Throw signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-throw-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwMessageEventCompleted] };
            ajaxReply(resp);
        }));
    });

    describe('Diagrams component Throw events: ', () => {

        it('Should render the Throw time event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwTimeEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Throw error event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwErrorEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Throw signal event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwSignalEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Throw signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwMessageEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Throw signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-throw-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-throw-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [throwEventMock.throwMessageEvent] };
            ajaxReply(resp);
        }));
    });

});
