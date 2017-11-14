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

import { DebugElement } from '@angular/core';
import * as diagramsActivitiesMock from '../../mock/diagram/diagramActivities.mock';
import * as boundaryEventMock from '../../mock/diagram/diagramBoundary.mock';
import * as diagramsEventsMock from '../../mock/diagram/diagramEvents.mock';
import * as flowsMock from '../../mock/diagram/diagramFlows.mock';
import * as diagramsGatewaysMock from '../../mock/diagram/diagramGateways.mock';
import * as intermediateCatchingMock from '../../mock/diagram/diagramIntermediate.mock';
import * as structuralMock from '../../mock/diagram/diagramStructural.mock';
import * as swimLanesMock from '../../mock/diagram/diagramSwimlanes.mock';
import * as throwEventMock from '../../mock/diagram/diagramThrow.mock';
import { DiagramComponent } from './index';
import { DIAGRAM_DIRECTIVES, DIAGRAM_PROVIDERS } from './index';
import { RAPHAEL_DIRECTIVES, RAPHAEL_PROVIDERS } from './raphael/index';

declare let jasmine: any;

describe('Diagrams ', () => {

    let component: any;
    let fixture: ComponentFixture<DiagramComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [
                ...DIAGRAM_DIRECTIVES,
                ...RAPHAEL_DIRECTIVES
            ],
            providers: [
                ...DIAGRAM_PROVIDERS,
                ...RAPHAEL_PROVIDERS
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DiagramComponent);
        component = fixture.componentInstance;
        debug = fixture.debugElement;
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
        jasmine.Ajax.uninstall();
    });

    let ajaxReply =  (resp: any) => {
        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: resp
        });
    };

    describe('Diagrams component Events: ', () => {

        it('Should render the Start Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Start Timer Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-timer > raphael-icon-timer');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();

            let resp = { elements: [diagramsEventsMock.startTimeEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Start Signal Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-signal > raphael-icon-signal');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startSignalEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Start Message Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-message > raphael-icon-message');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startMessageEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Start Error Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startErrorEvent] };
            ajaxReply(resp);
        }));

        it('Should render the End Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.endEvent] };
            ajaxReply(resp);
        }));

        it('Should render the End Error Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-end-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.endErrorEvent] };
            ajaxReply(resp);
        }));
    });

    describe('Diagrams component Activities: ', () => {

        it('Should render the User Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-user-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-user-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake User task');

                    let iconTask: any = element.querySelector('diagram-user-task > diagram-icon-user-task > raphael-icon-user');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.userTask] };
            ajaxReply(resp);
        }));

        it('Should render the Manual Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-manual-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-manual-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Manual task');

                    let iconTask: any = element.querySelector('diagram-manual-task > diagram-icon-manual-task > raphael-icon-manual');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.manualTask] };
            ajaxReply(resp);
        }));

        it('Should render the Service Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-service-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-service-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Service task');

                    let iconTask: any = element.querySelector('diagram-service-task > diagram-icon-service-task > raphael-icon-service');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.serviceTask] };
            ajaxReply(resp);
        }));

        it('Should render the Service Camel Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-camel-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-camel-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Camel task');

                    let iconTask: any = element.querySelector('diagram-camel-task > diagram-icon-camel-task > raphael-icon-camel');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.camelTask] };
            ajaxReply(resp);
        }));

        it('Should render the Service Mule Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-mule-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-mule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Mule task');

                    let iconTask: any = element.querySelector('diagram-mule-task > diagram-icon-mule-task > raphael-icon-mule');
                    expect(iconTask).not.toBeNull();
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.muleTask] };
            ajaxReply(resp);
        }));

        it('Should render the Service Alfresco Publish Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Alfresco Publish task');

                    let iconTask: any = element.querySelector('adf-diagram-publish-task > diagram-icon-alfresco-publish-task >' +
                        ' raphael-icon-alfresco-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.alfrescoPublishTask] };
            ajaxReply(resp);
        }));

        it('Should render the Service Google Drive Publish Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Google Drive Publish task');

                    let iconTask: any = element.querySelector('diagram-google-drive-publish-task >' +
                        ' diagram-icon-google-drive-publish-task > raphael-icon-google-drive-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.googleDrivePublishTask] };
            ajaxReply(resp);
        }));

        it('Should render the Rest Call Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Rest Call task');

                    let iconTask: any = element.querySelector('diagram-rest-call-task > diagram-icon-rest-call-task >' +
                        ' raphael-icon-rest-call');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.restCallTask] };
            ajaxReply(resp);
        }));

        it('Should render the Service Box Publish Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Box Publish task');

                    let iconTask: any = element.querySelector('diagram-box-publish-task >' +
                        ' diagram-icon-box-publish-task > raphael-icon-box-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.boxPublishTask] };
            ajaxReply(resp);
        }));

        it('Should render the Receive Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-receive-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-receive-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Receive task');

                    let iconTask: any = element.querySelector('diagram-receive-task > diagram-icon-receive-task > raphael-icon-receive');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.receiveTask] };
            ajaxReply(resp);
        }));

        it('Should render the Script Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-script-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-script-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Script task');

                    let iconTask: any = element.querySelector('diagram-script-task > diagram-icon-script-task > raphael-icon-script');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.scriptTask] };
            ajaxReply(resp);
        }));

        it('Should render the Business Rule Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake BusinessRule task');

                    let iconTask: any = element.querySelector('diagram-business-rule-task > diagram-icon-business-rule-task > raphael-icon-business-rule');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.businessRuleTask] };
            ajaxReply(resp);
        }));

    });

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
            let resp = { elements: [diagramsGatewaysMock.exclusiveGatway] };
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
            let resp = { elements: [diagramsGatewaysMock.inclusiveGatway] };
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
            let resp = { elements: [diagramsGatewaysMock.parallelGatway] };
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
            let resp = { elements: [diagramsGatewaysMock.eventGatway] };
            ajaxReply(resp);
        }));
    });

    describe('Diagrams component Intermediate Catching events: ', () => {

        it('Should render the Intermediate catching time event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingTimeEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Intermediate catching error event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingErrorEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Intermediate catching signal event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingSignalEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Intermediate catching signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingMessageEvent] };
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

    describe('Diagrams component Structural: ', () => {

        it('Should render the Subprocess', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-subprocess > raphael-rect');
                    expect(shape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [structuralMock.subProcess] };
            ajaxReply(resp);
        }));

        it('Should render the Event Subprocess', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-event-subprocess > raphael-rect');
                    expect(shape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [structuralMock.eventSubProcess] };
            ajaxReply(resp);
        }));
    });

    describe('Diagrams component Swim lane: ', () => {

        it('Should render the Pool', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-pool > raphael-rect');
                    expect(shape).not.toBeNull();

                    let shapeText: any = element.querySelector('diagram-pool > raphael-text');
                    expect(shapeText).not.toBeNull();
                    expect(shapeText.attributes[2].value).toEqual('Activiti');
                });
            });
            component.ngOnChanges();
            let resp = { pools: [swimLanesMock.pool] };
            ajaxReply(resp);
        }));

        it('Should render the Pool with Lanes', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shapeLane: any = element.querySelector('diagram-lanes > div > div > diagram-lane');
                    expect(shapeLane).not.toBeNull();

                    let shapeRect: any = element.querySelector('diagram-lanes > div > div > diagram-lane > raphael-rect');
                    expect(shapeRect).not.toBeNull();

                    let shapeText: any = element.querySelector('diagram-lanes > div > div > diagram-lane > raphael-text');
                    expect(shapeText).not.toBeNull();
                    expect(shapeText.attributes[2].value).toEqual('Beckend');
                });
            });
            component.ngOnChanges();
            let resp = { pools: [swimLanesMock.poolLanes] };
            ajaxReply(resp);
        }));
    });

    describe('Diagrams component Flows: ', () => {

        it('Should render the flow', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-sequence-flow > raphael-flow-arrow');
                    expect(shape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.flows[0].id);
                    expect(tooltip.textContent).toContain(res.flows[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { flows: [flowsMock.flow] };
            ajaxReply(resp);
        }));
    });

    describe('Diagrams component Events with process instance id: ', () => {

        it('Should render the Start Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Start Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(event).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Start Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(event).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Start Timer Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-timer > raphael-icon-timer');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startTimeEvent] };

            ajaxReply(resp);
        }));

        it('Should render the Active Start Timer Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-timer > raphael-icon-timer');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startTimeEventActive] };

            ajaxReply(resp);
        }));

        it('Should render the Completed Start Timer Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-timer > raphael-icon-timer');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startTimeEventCompleted] };

            ajaxReply(resp);
        }));

        it('Should render the Start Signal Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-signal > raphael-icon-signal');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startSignalEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Start Signal Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-signal > raphael-icon-signal');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startSignalEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Start Signal Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-signal > raphael-icon-signal');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startSignalEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Start Message Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-message > raphael-icon-message');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startMessageEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Start Message Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-message > raphael-icon-message');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startMessageEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Start Message Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-message > raphael-icon-message');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startMessageEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Start Error Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startErrorEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Start Error Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startErrorEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Start Error Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.startErrorEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the End Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.endEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active End Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(event).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.endEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed End Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(event).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.endEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the End Error Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-end-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.endErrorEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active End Error Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-end-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.endErrorEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed End Error Event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-end-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsEventsMock.endErrorEventCompleted] };
            ajaxReply(resp);
        }));
    });

    describe('Diagrams component Activities with process instance id: ', () => {

        it('Should render the User Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-user-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-user-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake User task');

                    let iconTask: any = element.querySelector('diagram-user-task > diagram-icon-user-task > raphael-icon-user');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.userTask] };
            ajaxReply(resp);
        }));

        it('Should render the Active User Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-user-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-user-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake User task');

                    let iconTask: any = element.querySelector('diagram-user-task > diagram-icon-user-task > raphael-icon-user');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.userTaskActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed User Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-user-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-user-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake User task');

                    let iconTask: any = element.querySelector('diagram-user-task > diagram-icon-user-task > raphael-icon-user');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.userTaskCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Manual Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-manual-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-manual-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Manual task');

                    let iconTask: any = element.querySelector('diagram-manual-task > diagram-icon-manual-task > raphael-icon-manual');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.manualTask] };
            ajaxReply(resp);
        }));

        it('Should render the Active Manual Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-manual-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-manual-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Manual task');

                    let iconTask: any = element.querySelector('diagram-manual-task > diagram-icon-manual-task > raphael-icon-manual');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.manualTaskActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Manual Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-manual-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-manual-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Manual task');

                    let iconTask: any = element.querySelector('diagram-manual-task > diagram-icon-manual-task > raphael-icon-manual');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.manualTaskCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Service Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-service-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-service-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Service task');

                    let iconTask: any = element.querySelector('diagram-service-task > diagram-icon-service-task > raphael-icon-service');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.serviceTask] };
            ajaxReply(resp);
        }));

        it('Should render the Active Service Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-service-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-service-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Service task');

                    let iconTask: any = element.querySelector('diagram-service-task > diagram-icon-service-task > raphael-icon-service');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.serviceTaskActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Service Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-service-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-service-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Service task');

                    let iconTask: any = element.querySelector('diagram-service-task > diagram-icon-service-task > raphael-icon-service');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.serviceTaskCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Service Camel Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-camel-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-camel-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Camel task');

                    let iconTask: any = element.querySelector('diagram-camel-task > diagram-icon-camel-task > raphael-icon-camel');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.camelTask] };
            ajaxReply(resp);
        }));

        it('Should render the Active Service Camel Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-camel-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-camel-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Camel task');

                    let iconTask: any = element.querySelector('diagram-camel-task > diagram-icon-camel-task > raphael-icon-camel');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.camelTaskActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Service Camel Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-camel-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-camel-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Camel task');

                    let iconTask: any = element.querySelector('diagram-camel-task > diagram-icon-camel-task > raphael-icon-camel');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.camelTaskCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Service Mule Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-mule-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-mule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Mule task');

                    let iconTask: any = element.querySelector('diagram-mule-task > diagram-icon-mule-task > raphael-icon-mule');
                    expect(iconTask).not.toBeNull();
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.muleTask] };
            ajaxReply(resp);
        }));

        it('Should render the Active Service Mule Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-mule-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-mule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Mule task');

                    let iconTask: any = element.querySelector('diagram-mule-task > diagram-icon-mule-task > raphael-icon-mule');
                    expect(iconTask).not.toBeNull();
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.muleTaskActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Service Mule Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-mule-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-mule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Mule task');

                    let iconTask: any = element.querySelector('diagram-mule-task > diagram-icon-mule-task > raphael-icon-mule');
                    expect(iconTask).not.toBeNull();
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.muleTaskCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Service Alfresco Publish Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Alfresco Publish task');

                    let iconTask: any = element.querySelector('adf-diagram-publish-task > diagram-icon-alfresco-publish-task >' +
                        ' raphael-icon-alfresco-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.alfrescoPublishTask] };
            ajaxReply(resp);
        }));

        it('Should render the Active Service Alfresco Publish Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Alfresco Publish task');

                    let iconTask: any = element.querySelector('adf-diagram-publish-task > diagram-icon-alfresco-publish-task >' +
                        ' raphael-icon-alfresco-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.alfrescoPublishTaskActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Service Alfresco Publish Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Alfresco Publish task');

                    let iconTask: any = element.querySelector('adf-diagram-publish-task > diagram-icon-alfresco-publish-task >' +
                        ' raphael-icon-alfresco-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.alfrescoPublishTaskCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Service Google Drive Publish Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Google Drive Publish task');

                    let iconTask: any = element.querySelector('diagram-google-drive-publish-task >' +
                        ' diagram-icon-google-drive-publish-task > raphael-icon-google-drive-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.googleDrivePublishTask] };
            ajaxReply(resp);
        }));

        it('Should render the Active Service Google Drive Publish Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Google Drive Publish task');

                    let iconTask: any = element.querySelector('diagram-google-drive-publish-task >' +
                        ' diagram-icon-google-drive-publish-task > raphael-icon-google-drive-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.googleDrivePublishTaskActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Service Google Drive Publish Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Google Drive Publish task');

                    let iconTask: any = element.querySelector('diagram-google-drive-publish-task >' +
                        ' diagram-icon-google-drive-publish-task > raphael-icon-google-drive-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.googleDrivePublishTaskCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Rest Call Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Rest Call task');

                    let iconTask: any = element.querySelector('diagram-rest-call-task > diagram-icon-rest-call-task >' +
                        ' raphael-icon-rest-call');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.restCallTask] };
            ajaxReply(resp);
        }));

        it('Should render the Active Rest Call Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Rest Call task');

                    let iconTask: any = element.querySelector('diagram-rest-call-task > diagram-icon-rest-call-task >' +
                        ' raphael-icon-rest-call');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.restCallTaskActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Rest Call Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Rest Call task');

                    let iconTask: any = element.querySelector('diagram-rest-call-task > diagram-icon-rest-call-task >' +
                        ' raphael-icon-rest-call');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.restCallTaskCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Service Box Publish Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Box Publish task');

                    let iconTask: any = element.querySelector('diagram-box-publish-task >' +
                        ' diagram-icon-box-publish-task > raphael-icon-box-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.boxPublishTask] };
            ajaxReply(resp);
        }));

        it('Should render the Active Service Box Publish Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Box Publish task');

                    let iconTask: any = element.querySelector('diagram-box-publish-task >' +
                        ' diagram-icon-box-publish-task > raphael-icon-box-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.boxPublishTaskActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Service Box Publish Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Box Publish task');

                    let iconTask: any = element.querySelector('diagram-box-publish-task >' +
                        ' diagram-icon-box-publish-task > raphael-icon-box-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.boxPublishTaskCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Receive Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-receive-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-receive-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Receive task');

                    let iconTask: any = element.querySelector('diagram-receive-task > diagram-icon-receive-task > raphael-icon-receive');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.receiveTask] };
            ajaxReply(resp);
        }));

        it('Should render the Active Receive Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-receive-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-receive-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Receive task');

                    let iconTask: any = element.querySelector('diagram-receive-task > diagram-icon-receive-task > raphael-icon-receive');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.receiveTaskActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Receive Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-receive-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-receive-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Receive task');

                    let iconTask: any = element.querySelector('diagram-receive-task > diagram-icon-receive-task > raphael-icon-receive');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.receiveTaskCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Script Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-script-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-script-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Script task');

                    let iconTask: any = element.querySelector('diagram-script-task > diagram-icon-script-task > raphael-icon-script');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.scriptTask] };
            ajaxReply(resp);
        }));

        it('Should render the Active Script Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-script-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-script-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Script task');

                    let iconTask: any = element.querySelector('diagram-script-task > diagram-icon-script-task > raphael-icon-script');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.scriptTaskActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Script Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-script-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-script-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Script task');

                    let iconTask: any = element.querySelector('diagram-script-task > diagram-icon-script-task > raphael-icon-script');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.scriptTaskCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Business Rule Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake BusinessRule task');

                    let iconTask: any = element.querySelector('diagram-business-rule-task > diagram-icon-business-rule-task > raphael-icon-business-rule');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.businessRuleTask] };
            ajaxReply(resp);
        }));

        it('Should render the Active Business Rule Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake BusinessRule task');

                    let iconTask: any = element.querySelector('diagram-business-rule-task > diagram-icon-business-rule-task > raphael-icon-business-rule');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.businessRuleTaskActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Business Rule Task', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake BusinessRule task');

                    let iconTask: any = element.querySelector('diagram-business-rule-task > diagram-icon-business-rule-task > raphael-icon-business-rule');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [diagramsActivitiesMock.businessRuleTaskCompleted] };
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
            let resp = { elements: [diagramsGatewaysMock.exclusiveGatway] };
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
            let resp = { elements: [diagramsGatewaysMock.exclusiveGatwayActive] };
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
            let resp = { elements: [diagramsGatewaysMock.exclusiveGatwayCompleted] };
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
            let resp = { elements: [diagramsGatewaysMock.inclusiveGatway] };
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
            let resp = { elements: [diagramsGatewaysMock.inclusiveGatwayActive] };
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
            let resp = { elements: [diagramsGatewaysMock.inclusiveGatwayCompleted] };
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
            let resp = { elements: [diagramsGatewaysMock.parallelGatway] };
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
            let resp = { elements: [diagramsGatewaysMock.parallelGatwayActive] };
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
            let resp = { elements: [diagramsGatewaysMock.parallelGatwayCompleted] };
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
            let resp = { elements: [diagramsGatewaysMock.eventGatway] };
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
            let resp = { elements: [diagramsGatewaysMock.eventGatwayActive] };
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
            let resp = { elements: [diagramsGatewaysMock.eventGatwayCompleted] };
            ajaxReply(resp);
        }));
    });

    describe('Diagrams component Intermediate Catching events with process instance id: ', () => {

        it('Should render the Intermediate catching time event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingTimeEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Intermediate catching time event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingTimeEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Intermediate catching time event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-timer');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingTimeEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Intermediate catching error event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingErrorEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Intermediate catching error event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingErrorEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Intermediate catching error event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-error');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingErrorEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Intermediate catching signal event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingSignalEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Intermediate Active catching signal event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingSignalEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Intermediate catching signal event', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-signal');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingSignalEventCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Intermediate catching signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingMessageEvent] };
            ajaxReply(resp);
        }));

        it('Should render the Active Intermediate catching signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#017501"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingMessageEventActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Intermediate catching signal message', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();

                    let coloredShape: any = element.querySelector('diagram-intermediate-catching-event>raphael-circle[ng-reflect-stroke="#2632aa"]');
                    expect(coloredShape).not.toBeNull();

                    let shape: any = element.querySelector('diagram-intermediate-catching-event');
                    expect(shape).not.toBeNull();
                    expect(shape.children.length).toBe(4);

                    let outerCircle = shape.children[0];
                    expect(outerCircle.localName).toEqual('raphael-circle');

                    let innerCircle = shape.children[1];
                    expect(innerCircle.localName).toEqual('raphael-circle');

                    let iconShape: any = element.querySelector('diagram-intermediate-catching-event > diagram-container-icon-event >' +
                        ' div > div > diagram-icon-message');
                    expect(iconShape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [intermediateCatchingMock.intermediateCatchingMessageEventCompleted] };
            ajaxReply(resp);
        }));
    });

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

    describe('Diagrams component Structural with process instance id: ', () => {

        it('Should render the Subprocess', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-subprocess > raphael-rect');
                    expect(shape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [structuralMock.subProcess] };
            ajaxReply(resp);
        }));

        it('Should render the Active Subprocess', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-subprocess > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(shape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [structuralMock.subProcessActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Subprocess', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-subprocess > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(shape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [structuralMock.subProcessCompleted] };
            ajaxReply(resp);
        }));

        it('Should render the Event Subprocess', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-event-subprocess > raphael-rect');
                    expect(shape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [structuralMock.eventSubProcess] };
            ajaxReply(resp);
        }));

        it('Should render the Active Event Subprocess', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-event-subprocess > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(shape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [structuralMock.eventSubProcessActive] };
            ajaxReply(resp);
        }));

        it('Should render the Completed Event Subprocess', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-event-subprocess > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(shape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].id);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { elements: [structuralMock.eventSubProcessCompleted] };
            ajaxReply(resp);
        }));
    });

    describe('Diagrams component Swim lane with process instance id: ', () => {

        it('Should render the Pool', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-pool > raphael-rect');
                    expect(shape).not.toBeNull();

                    let shapeText: any = element.querySelector('diagram-pool > raphael-text');
                    expect(shapeText).not.toBeNull();
                    expect(shapeText.attributes[2].value).toEqual('Activiti');
                });
            });
            component.ngOnChanges();
            let resp = { pools: [swimLanesMock.pool] };
            ajaxReply(resp);
        }));

        it('Should render the Pool with Lanes', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shapeLane: any = element.querySelector('diagram-lanes > div > div > diagram-lane');
                    expect(shapeLane).not.toBeNull();

                    let shapeRect: any = element.querySelector('diagram-lanes > div > div > diagram-lane > raphael-rect');
                    expect(shapeRect).not.toBeNull();

                    let shapeText: any = element.querySelector('diagram-lanes > div > div > diagram-lane > raphael-text');
                    expect(shapeText).not.toBeNull();
                    expect(shapeText.attributes[2].value).toEqual('Beckend');
                });
            });
            component.ngOnChanges();
            let resp = { pools: [swimLanesMock.poolLanes] };
            ajaxReply(resp);
        }));
    });

    describe('Diagrams component Flows with process instance id: ', () => {

        it('Should render the flow', async(() => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let shape: any = element.querySelector('diagram-sequence-flow > raphael-flow-arrow');
                    expect(shape).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.flows[0].id);
                    expect(tooltip.textContent).toContain(res.flows[0].type);
                });
            });
            component.ngOnChanges();
            let resp = { flows: [flowsMock.flow] };
            ajaxReply(resp);
        }));
    });
});
