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

import * as intermediateCatchingMock from '../../mock/diagram/diagram-intermediate.mock';
import { DiagramComponent } from './diagram.component';
import { setupTestBed } from '@alfresco/adf-core';
import { InsightsTestingModule } from '../../testing/insights.testing.module';
import { TranslateModule } from '@ngx-translate/core';

declare let jasmine: any;

describe('Diagrams Catching', () => {

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

    describe('Diagrams component Intermediate Catching events: ', () => {

        it('Should render the Intermediate catching time event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingTimeEvent] };
            ajaxReply(resp);
        });

        it('Should render the Intermediate catching error event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingErrorEvent] };
            ajaxReply(resp);
        });

        it('Should render the Intermediate catching signal event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingSignalEvent] };
            ajaxReply(resp);
        });

        it('Should render the Intermediate catching signal message', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingMessageEvent] };
            ajaxReply(resp);
        });
    });

    describe('Diagrams component Intermediate Catching events with process instance id: ', () => {

        it('Should render the Intermediate catching time event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingTimeEvent] };
            ajaxReply(resp);
        });

        it('Should render the Active Intermediate catching time event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    const coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingTimeEventActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Intermediate catching time event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    const coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingTimeEventCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Intermediate catching error event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingErrorEvent] };
            ajaxReply(resp);
        });

        it('Should render the Active Intermediate catching error event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    const coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingErrorEventActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Intermediate catching error event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    const coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingErrorEventCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Intermediate catching signal event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingSignalEvent] };
            ajaxReply(resp);
        });

        it('Should render the Intermediate Active catching signal event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    const coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingSignalEventActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Intermediate catching signal event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    const coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingSignalEventCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Intermediate catching signal message', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingMessageEvent] };
            ajaxReply(resp);
        });

        it('Should render the Active Intermediate catching signal message', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    const coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingMessageEventActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Intermediate catching signal message', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    const coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    const shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    const outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    const innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    const iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [intermediateCatchingMock.intermediateCatchingMessageEventCompleted] };
            ajaxReply(resp);
        });
    });
});
