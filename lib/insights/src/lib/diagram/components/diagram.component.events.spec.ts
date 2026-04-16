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

import * as diagramsEventsMock from '../../mock/diagram/diagram-events.mock';
import { DiagramComponent } from './diagram.component';
import { InsightsTestingModule } from '../../testing/insights.testing.module';
import { UnitTestingUtils } from '@alfresco/adf-core';
import { RaphaelCircleDirective } from '@alfresco/adf-insights';
import { DiagramsService } from '../services/diagrams.service';
import { of } from 'rxjs';

describe('Diagrams events', () => {
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

    describe('Diagrams component Events: ', () => {
        it('Should render the Start Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startEvent] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Start Timer Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-timer > raphael-icon-timer'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startTimeEvent] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Start Signal Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event');
                    expect(event).not.toBeNull();

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-signal > raphael-icon-signal'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startSignalEvent] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Start Message Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-message > raphael-icon-message'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startMessageEvent] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Start Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startErrorEvent] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the End Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-end-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.endEvent] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the End Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-end-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-end-event > diagram-event >' + ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.endErrorEvent] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });
    });

    describe('Diagrams component Events with process instance id: ', () => {
        it('Should render the Start Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startEvent] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Start Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event?.injector.get(RaphaelCircleDirective).stroke).toBe('#017501');
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startEventActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Start Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event?.injector.get(RaphaelCircleDirective).stroke).toBe('#2632aa');
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startEventCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Start Timer Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-timer > raphael-icon-timer'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startTimeEvent] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Start Timer Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event?.injector.get(RaphaelCircleDirective).stroke).toBe('#017501');

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-timer > raphael-icon-timer'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startTimeEventActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Start Timer Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event?.injector.get(RaphaelCircleDirective).stroke).toBe('#2632aa');

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-timer > raphael-icon-timer'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startTimeEventCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Start Signal Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-signal > raphael-icon-signal'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startSignalEvent] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Start Signal Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event?.injector.get(RaphaelCircleDirective).stroke).toBe('#017501');

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-signal > raphael-icon-signal'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startSignalEventActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Start Signal Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event?.injector.get(RaphaelCircleDirective).stroke).toBe('#2632aa');

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-signal > raphael-icon-signal'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startSignalEventCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Start Message Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-message > raphael-icon-message'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startMessageEvent] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Start Message Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event?.injector.get(RaphaelCircleDirective).stroke).toBe('#017501');

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-message > raphael-icon-message'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startMessageEventActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Start Message Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event?.injector.get(RaphaelCircleDirective).stroke).toBe('#2632aa');

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-message > raphael-icon-message'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startMessageEventCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Start Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startErrorEvent] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Start Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event?.injector.get(RaphaelCircleDirective).stroke).toBe('#017501');

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startErrorEventActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Start Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-start-event > diagram-event > raphael-circle');
                    expect(event?.injector.get(RaphaelCircleDirective).stroke).toBe('#2632aa');

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-start-event > diagram-event >' +
                            ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.startErrorEventCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the End Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-end-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.endEvent] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active End Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-end-event > diagram-event > raphael-circle');
                    expect(event?.injector.get(RaphaelCircleDirective).stroke).toBe('#017501');
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.endEventActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed End Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-end-event > diagram-event > raphael-circle');
                    expect(event?.injector.get(RaphaelCircleDirective).stroke).toBe('#2632aa');
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.endEventCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the End Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-end-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-end-event > diagram-event >' + ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.endErrorEvent] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active End Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-end-event > diagram-event > raphael-circle');
                    expect(event?.injector.get(RaphaelCircleDirective).stroke).toBe('#017501');

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-end-event > diagram-event >' + ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.endErrorEventActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed End Error Event', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    const event = unitTestingUtils.getByCSS('diagram-end-event > diagram-event > raphael-circle');
                    expect(event?.injector.get(RaphaelCircleDirective).stroke).toBe('#2632aa');

                    const iconEvent = unitTestingUtils.getByCSS(
                        'diagram-end-event > diagram-event >' + ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error'
                    );
                    expect(iconEvent).not.toBeNull();
                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].id);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsEventsMock.endErrorEventCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });
    });
});
