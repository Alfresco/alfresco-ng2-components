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

import * as diagramsEventsMock from '../../mock/diagram/diagram-events.mock';
import { DiagramComponent } from './diagram.component';
import { setupTestBed } from '@alfresco/adf-core';
import { InsightsTestingModule } from '../../testing/insights.testing.module';
import { TranslateModule } from '@ngx-translate/core';

declare let jasmine: any;

describe('Diagrams events', () => {

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

    describe('Diagrams component Events: ', () => {

        it('Should render the Start Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startEvent] };
            ajaxReply(resp);
        });

        it('Should render the Start Timer Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-timer > raphael-icon-timer');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();

            const resp = { elements: [diagramsEventsMock.startTimeEvent] };
            ajaxReply(resp);
        });

        it('Should render the Start Signal Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-signal > raphael-icon-signal');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startSignalEvent] };
            ajaxReply(resp);
        });

        it('Should render the Start Message Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-message > raphael-icon-message');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startMessageEvent] };
            ajaxReply(resp);
        });

        it('Should render the Start Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startErrorEvent] };
            ajaxReply(resp);
        });

        it('Should render the End Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.endEvent] };
            ajaxReply(resp);
        });

        it('Should render the End Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-end-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.endErrorEvent] };
            ajaxReply(resp);
        });
    });

    describe('Diagrams component Events with process instance id: ', () => {

        it('Should render the Start Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startEvent] };
            ajaxReply(resp);
        });

        it('Should render the Active Start Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(event).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startEventActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Start Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(event).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startEventCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Start Timer Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-timer > raphael-icon-timer');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startTimeEvent] };

            ajaxReply(resp);
        });

        it('Should render the Active Start Timer Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-timer > raphael-icon-timer');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startTimeEventActive] };

            ajaxReply(resp);
        });

        it('Should render the Completed Start Timer Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-timer > raphael-icon-timer');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startTimeEventCompleted] };

            ajaxReply(resp);
        });

        it('Should render the Start Signal Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-signal > raphael-icon-signal');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startSignalEvent] };
            ajaxReply(resp);
        });

        it('Should render the Active Start Signal Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-signal > raphael-icon-signal');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startSignalEventActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Start Signal Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-signal > raphael-icon-signal');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startSignalEventCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Start Message Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-message > raphael-icon-message');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startMessageEvent] };
            ajaxReply(resp);
        });

        it('Should render the Active Start Message Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-message > raphael-icon-message');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startMessageEventActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Start Message Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-message > raphael-icon-message');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startMessageEventCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Start Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startErrorEvent] };
            ajaxReply(resp);
        });

        it('Should render the Active Start Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startErrorEventActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Start Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.startErrorEventCompleted] };
            ajaxReply(resp);
        });

        it('Should render the End Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.endEvent] };
            ajaxReply(resp);
        });

        it('Should render the Active End Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(event).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.endEventActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed End Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(event).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.endEventCompleted] };
            ajaxReply(resp);
        });

        it('Should render the End Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-end-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.endErrorEvent] };
            ajaxReply(resp);
        });

        it('Should render the Active End Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-end-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.endErrorEventActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed End Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(event).not.toBeNull();

                    const iconEvent: any = element.querySelector('diagram-end-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsEventsMock.endErrorEventCompleted] };
            ajaxReply(resp);
        });
    });
});
