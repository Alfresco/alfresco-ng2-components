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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CoreModule, AlfrescoTranslationService } from 'ng2-alfresco-core';

import { DIAGRAM_DIRECTIVES, DIAGRAM_PROVIDERS } from './index';
import { RAPHAEL_DIRECTIVES, RAPHAEL_PROVIDERS } from './raphael/index';
import { DiagramComponent } from './index';
import { DebugElement } from '@angular/core';
import { TranslationMock } from '../assets/translation.service.mock';
import * as diagramsEventsMock from '../assets/diagramEvents.mock';
import * as diagramsActivitiesMock from '../assets/diagramActivities.mock';
import * as diagramsGatewaysMock from '../assets/diagramGateways.mock';
import * as intermediateCatchingMock from '../assets/diagramIntermediate.mock';
import * as boundaryEventMock from '../assets/diagramBoundary.mock';
import * as throwEventMock from '../assets/diagramThrow.mock';
import * as structuralMock from '../assets/diagramStructural.mock';
import * as swimLanesMock from '../assets/diagramSwimlanes.mock';
import * as flowsMock from '../assets/diagramFlows.mock';

declare let jasmine: any;

describe('Test ng2-activiti-diagrams ', () => {

    let component: any;
    let fixture: ComponentFixture<DiagramComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    let componentHandler: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                ...DIAGRAM_DIRECTIVES,
                ...RAPHAEL_DIRECTIVES
            ],
            providers: [
                ...DIAGRAM_PROVIDERS,
                ...RAPHAEL_PROVIDERS,
                {provide: AlfrescoTranslationService, useClass: TranslationMock}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DiagramComponent);
        component = fixture.componentInstance;
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        fixture.detectChanges();
        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);
        window['componentHandler'] = componentHandler;
    });

    describe('Diagrams component Events: ', () => {

        beforeEach(() => {
            jasmine.Ajax.install();
            component.processDefinitionId = 'fakeprocess:24:38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Start Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Start Timer Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startTimeEvent]};

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Start Signal Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startSignalEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Start Message Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startMessageEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Start Error Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startErrorEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the End Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.endEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the End Error Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.endErrorEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });

    describe('Diagrams component Activities: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processDefinitionId = 'fakeprocess:24:38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the User Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.userTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Manual Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.manualTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Service Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.serviceTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Service Mail Task', async(() => {
            component.onSuccess.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(true).toBe(true);
                });
            });
            component.ngOnChanges();
            let resp = {elements: [diagramsActivitiesMock.mailTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Service Camel Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.camelTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Service Mule Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.muleTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Service Alfresco Publish Task', async(() => {
            component.onSuccess.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-alfresco-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-alfresco-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Alfresco Publish task');

                    let iconTask: any = element.querySelector('diagram-alfresco-publish-task > diagram-icon-alfresco-publish-task >' +
                        ' raphael-icon-alfresco-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = {elements: [diagramsActivitiesMock.alfrescoPublishTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Service Google Drive Publish Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.googleDrivePublishTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Rest Call Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.restCallTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Service Box Publish Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.boxPublishTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Receive Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.receiveTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Script Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.scriptTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Business Rule Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.businessRuleTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

    });

    describe('Diagrams component Gateways: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processDefinitionId = 'fakeprocess:24:38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Exclusive Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.exclusiveGatway]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Inclusive Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.inclusiveGatway]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Parallel Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.parallelGatway]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Event Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.eventGatway]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });

    describe('Diagrams component Intermediate Catching events: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processDefinitionId = 'fakeprocess:24:38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Intermediate catching time event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingTimeEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Intermediate catching error event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingErrorEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Intermediate catching signal event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingSignalEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Intermediate catching signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingMessageEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });

    describe('Diagrams component Boundary events: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processDefinitionId = 'fakeprocess:24:38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Boundary time event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryTimeEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Boundary error event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryErrorEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Boundary signal event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundarySignalEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Boundary signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryMessageEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Boundary signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryMessageEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });

    describe('Diagrams component Throw events: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processDefinitionId = 'fakeprocess:24:38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Throw time event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwTimeEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Throw error event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwErrorEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Throw signal event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwSignalEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Throw signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwMessageEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Throw signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwMessageEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });

    describe('Diagrams component Structural: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processDefinitionId = 'fakeprocess:24:38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Subprocess', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [structuralMock.subProcess]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Event Subprocess', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [structuralMock.eventSubProcess]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });

    describe('Diagrams component Swim lane: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processDefinitionId = 'fakeprocess:24:38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Pool', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {pools: [swimLanesMock.pool]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Pool with Lanes', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {pools: [swimLanesMock.poolLanes]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });

    describe('Diagrams component Flows: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processDefinitionId = 'fakeprocess:24:38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the flow', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {flows: [flowsMock.flow]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });

    describe('Diagrams component Events with process instance id: ', () => {

        beforeEach(() => {
            jasmine.Ajax.install();
            component.processInstanceId = '38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Start Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Start Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Start Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Start Timer Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startTimeEvent]};

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Start Timer Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startTimeEventActive]};

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Start Timer Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startTimeEventCompleted]};

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Start Signal Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startSignalEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Start Signal Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startSignalEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Start Signal Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startSignalEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));


        it('Should render the Start Message Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startMessageEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Start Message Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startMessageEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Start Message Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startMessageEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Start Error Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startErrorEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Start Error Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startErrorEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Start Error Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.startErrorEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the End Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.endEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active End Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.endEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed End Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.endEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the End Error Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.endErrorEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active End Error Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.endErrorEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed End Error Event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsEventsMock.endErrorEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });

    describe('Diagrams component Activities with process instance id: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processInstanceId = '38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the User Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.userTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active User Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.userTaskActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed User Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.userTaskCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Manual Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.manualTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Manual Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.manualTaskActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Manual Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.manualTaskCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Service Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.serviceTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Service Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.serviceTaskActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Service Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.serviceTaskCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Service Mail Task', async(() => {
            component.onSuccess.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(true).toBe(true);
                });
            });
            component.ngOnChanges();
            let resp = {elements: [diagramsActivitiesMock.mailTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Service Camel Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.camelTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Service Camel Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.camelTaskActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Service Camel Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.camelTaskCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Service Mule Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.muleTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Service Mule Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.muleTaskActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Service Mule Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.muleTaskCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Service Alfresco Publish Task', async(() => {
            component.onSuccess.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-alfresco-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-alfresco-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Alfresco Publish task');

                    let iconTask: any = element.querySelector('diagram-alfresco-publish-task > diagram-icon-alfresco-publish-task >' +
                        ' raphael-icon-alfresco-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = {elements: [diagramsActivitiesMock.alfrescoPublishTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Service Alfresco Publish Task', async(() => {
            component.onSuccess.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-alfresco-publish-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-alfresco-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Alfresco Publish task');

                    let iconTask: any = element.querySelector('diagram-alfresco-publish-task > diagram-icon-alfresco-publish-task >' +
                        ' raphael-icon-alfresco-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = {elements: [diagramsActivitiesMock.alfrescoPublishTaskActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Service Alfresco Publish Task', async(() => {
            component.onSuccess.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let task: any = element.querySelector('diagram-alfresco-publish-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    let taskText: any = element.querySelector('diagram-alfresco-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes[1].value).toEqual('Fake Alfresco Publish task');

                    let iconTask: any = element.querySelector('diagram-alfresco-publish-task > diagram-icon-alfresco-publish-task >' +
                        ' raphael-icon-alfresco-publish');
                    expect(iconTask).not.toBeNull();

                    let tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                });
            });
            component.ngOnChanges();
            let resp = {elements: [diagramsActivitiesMock.alfrescoPublishTaskCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Service Google Drive Publish Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.googleDrivePublishTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Service Google Drive Publish Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.googleDrivePublishTaskActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Service Google Drive Publish Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.googleDrivePublishTaskCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Rest Call Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.restCallTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Rest Call Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.restCallTaskActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Rest Call Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.restCallTaskCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Service Box Publish Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.boxPublishTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Service Box Publish Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.boxPublishTaskActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Service Box Publish Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.boxPublishTaskCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Receive Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.receiveTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Receive Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.receiveTaskActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Receive Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.receiveTaskCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Script Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.scriptTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Script Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.scriptTaskActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Script Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.scriptTaskCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Business Rule Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.businessRuleTask]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Business Rule Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.businessRuleTaskActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Business Rule Task', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsActivitiesMock.businessRuleTaskCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

    });

    describe('Diagrams component Gateways with process instance id: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processInstanceId = '38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Exclusive Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.exclusiveGatway]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Exclusive Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.exclusiveGatwayActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Exclusive Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.exclusiveGatwayCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Inclusive Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.inclusiveGatway]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Inclusive Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.inclusiveGatwayActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Inclusive Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.inclusiveGatwayCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Parallel Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.parallelGatway]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Parallel Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.parallelGatwayActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Parallel Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.parallelGatwayCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Event Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.eventGatway]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Event Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.eventGatwayActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Event Gateway', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [diagramsGatewaysMock.eventGatwayCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });

    describe('Diagrams component Intermediate Catching events with process instance id: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processInstanceId = '38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Intermediate catching time event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingTimeEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Intermediate catching time event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingTimeEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Intermediate catching time event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingTimeEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Intermediate catching error event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingErrorEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Intermediate catching error event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingErrorEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Intermediate catching error event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingErrorEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Intermediate catching signal event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingSignalEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Intermediate Active catching signal event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingSignalEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Intermediate catching signal event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingSignalEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Intermediate catching signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingMessageEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Intermediate catching signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingMessageEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Intermediate catching signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [intermediateCatchingMock.intermediateCatchingMessageEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });

    describe('Diagrams component Boundary events with process instance id: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processInstanceId = '38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Boundary time event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryTimeEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Boundary time event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryTimeEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Boundary time event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryTimeEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Boundary error event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryErrorEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Boundary error event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryErrorEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Boundary error event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryErrorEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Boundary signal event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundarySignalEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Boundary signal event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundarySignalEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Boundary signal event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundarySignalEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Boundary signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryMessageEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Boundary signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryMessageEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Boundary signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryMessageEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Boundary signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryMessageEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Boundary signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryMessageEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Boundary signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [boundaryEventMock.boundaryMessageEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });

    describe('Diagrams component Throw events with process instance id: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processInstanceId = '38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Throw time event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwTimeEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Throw time event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwTimeEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Throw time event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwTimeEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Throw error event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwErrorEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Throw error event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwErrorEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Throw error event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwErrorEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Throw signal event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwSignalEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Throw signal event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwSignalEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Throw signal event', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwSignalEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Throw signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwMessageEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Throw signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwMessageEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Throw signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwMessageEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Throw signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwMessageEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Throw signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwMessageEventActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Throw signal message', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [throwEventMock.throwMessageEventCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });

    describe('Diagrams component Structural with process instance id: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processInstanceId = '38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Subprocess', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [structuralMock.subProcess]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Subprocess', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [structuralMock.subProcessActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Subprocess', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [structuralMock.subProcessCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Event Subprocess', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [structuralMock.eventSubProcess]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Active Event Subprocess', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [structuralMock.eventSubProcessActive]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Completed Event Subprocess', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {elements: [structuralMock.eventSubProcessCompleted]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });

    describe('Diagrams component Swim lane with process instance id: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processInstanceId = '38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Pool', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {pools: [swimLanesMock.pool]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Pool with Lanes', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {pools: [swimLanesMock.poolLanes]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });

    describe('Diagrams component Flows with process instance id: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processInstanceId = '38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the flow', async(() => {
            component.onSuccess.subscribe((res) => {
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
            let resp = {flows: [flowsMock.flow]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });
});
