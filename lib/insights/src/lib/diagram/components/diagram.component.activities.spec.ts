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

import * as diagramsActivitiesMock from '../../mock/diagram/diagram-activities.mock';
import { DiagramComponent } from './diagram.component';
import { setupTestBed } from '@alfresco/adf-core';
import { InsightsTestingModule } from '../../testing/insights.testing.module';
import { TranslateModule } from '@ngx-translate/core';

declare let jasmine: any;

describe('Diagrams activities', () => {

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
        // cspell: disable-next
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

    describe('Diagrams component Activities: ', () => {

        it('Should render the User Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-user-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-user-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake User task');

                    const iconTask: any = element.querySelector('diagram-user-task > diagram-icon-user-task > raphael-icon-user');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.userTask] };
            ajaxReply(resp);
        });

        it('Should render the Manual Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-manual-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-manual-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Manual task');

                    const iconTask: any = element.querySelector('diagram-manual-task > diagram-icon-manual-task > raphael-icon-manual');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.manualTask] };
            ajaxReply(resp);
        });

        it('Should render the Service Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const task = element.querySelector('diagram-service-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = element.querySelector('diagram-service-task > diagram-task > raphael-multiline-text');
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Service task');

                    const iconTask: any = element.querySelector('diagram-service-task > diagram-icon-service-task > raphael-icon-service');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.serviceTask] };
            ajaxReply(resp);
        });

        it('Should render the Service Camel Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-camel-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-camel-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Camel task');

                    const iconTask: any = element.querySelector('diagram-camel-task > diagram-icon-camel-task > raphael-icon-camel');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.camelTask] };
            ajaxReply(resp);
        });

        it('Should render the Service Mule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-mule-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-mule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Mule task');

                    const iconTask: any = element.querySelector('diagram-mule-task > diagram-icon-mule-task > raphael-icon-mule');
                    expect(iconTask).not.toBeNull();
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.muleTask] };
            ajaxReply(resp);
        });

        it('Should render the Service Alfresco Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Alfresco Publish task');

                    const iconTask: any = element.querySelector('adf-diagram-publish-task > diagram-icon-alfresco-publish-task >' +
                        ' raphael-icon-alfresco-publish');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.alfrescoPublishTask] };
            ajaxReply(resp);
        });

        it('Should render the Service Google Drive Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Google Drive Publish task');

                    const iconTask: any = element.querySelector('diagram-google-drive-publish-task >' +
                        ' diagram-icon-google-drive-publish-task > raphael-icon-google-drive-publish');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.googleDrivePublishTask] };
            ajaxReply(resp);
        });

        it('Should render the Rest Call Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Rest Call task');

                    const iconTask: any = element.querySelector('diagram-rest-call-task > diagram-icon-rest-call-task >' +
                        ' raphael-icon-rest-call');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.restCallTask] };
            ajaxReply(resp);
        });

        it('Should render the Service Box Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Box Publish task');

                    const iconTask: any = element.querySelector('diagram-box-publish-task >' +
                        ' diagram-icon-box-publish-task > raphael-icon-box-publish');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.boxPublishTask] };
            ajaxReply(resp);
        });

        it('Should render the Receive Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-receive-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-receive-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Receive task');

                    const iconTask: any = element.querySelector('diagram-receive-task > diagram-icon-receive-task > raphael-icon-receive');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.receiveTask] };
            ajaxReply(resp);
        });

        it('Should render the Script Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-script-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-script-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Script task');

                    const iconTask: any = element.querySelector('diagram-script-task > diagram-icon-script-task > raphael-icon-script');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.scriptTask] };
            ajaxReply(resp);
        });

        it('Should render the Business Rule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake BusinessRule task');

                    const iconTask: any = element.querySelector('diagram-business-rule-task > diagram-icon-business-rule-task > raphael-icon-business-rule');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.businessRuleTask] };
            ajaxReply(resp);
        });
   });

    describe('Diagrams component Activities with process instance id: ', () => {

        it('Should render the User Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-user-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-user-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake User task');

                    const iconTask: any = element.querySelector('diagram-user-task > diagram-icon-user-task > raphael-icon-user');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.userTask] };
            ajaxReply(resp);
        });

        it('Should render the Active User Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-user-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-user-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake User task');

                    const iconTask: any = element.querySelector('diagram-user-task > diagram-icon-user-task > raphael-icon-user');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.userTaskActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed User Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-user-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-user-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake User task');

                    const iconTask: any = element.querySelector('diagram-user-task > diagram-icon-user-task > raphael-icon-user');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.userTaskCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Manual Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-manual-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-manual-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Manual task');

                    const iconTask: any = element.querySelector('diagram-manual-task > diagram-icon-manual-task > raphael-icon-manual');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.manualTask] };
            ajaxReply(resp);
        });

        it('Should render the Active Manual Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-manual-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-manual-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Manual task');

                    const iconTask: any = element.querySelector('diagram-manual-task > diagram-icon-manual-task > raphael-icon-manual');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.manualTaskActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Manual Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-manual-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-manual-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Manual task');

                    const iconTask: any = element.querySelector('diagram-manual-task > diagram-icon-manual-task > raphael-icon-manual');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.manualTaskCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Service Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-service-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-service-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Service task');

                    const iconTask: any = element.querySelector('diagram-service-task > diagram-icon-service-task > raphael-icon-service');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.serviceTask] };
            ajaxReply(resp);
        });

        it('Should render the Active Service Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-service-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-service-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Service task');

                    const iconTask: any = element.querySelector('diagram-service-task > diagram-icon-service-task > raphael-icon-service');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.serviceTaskActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Service Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-service-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-service-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Service task');

                    const iconTask: any = element.querySelector('diagram-service-task > diagram-icon-service-task > raphael-icon-service');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.serviceTaskCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Service Camel Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-camel-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-camel-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Camel task');

                    const iconTask: any = element.querySelector('diagram-camel-task > diagram-icon-camel-task > raphael-icon-camel');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.camelTask] };
            ajaxReply(resp);
        });

        it('Should render the Active Service Camel Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-camel-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-camel-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Camel task');

                    const iconTask: any = element.querySelector('diagram-camel-task > diagram-icon-camel-task > raphael-icon-camel');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);

                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.camelTaskActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Service Camel Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-camel-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-camel-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Camel task');

                    const iconTask: any = element.querySelector('diagram-camel-task > diagram-icon-camel-task > raphael-icon-camel');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);

                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.camelTaskCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Service Mule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-mule-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-mule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Mule task');

                    const iconTask: any = element.querySelector('diagram-mule-task > diagram-icon-mule-task > raphael-icon-mule');
                    expect(iconTask).not.toBeNull();
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.muleTask] };
            ajaxReply(resp);
        });

        it('Should render the Active Service Mule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-mule-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-mule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Mule task');

                    const iconTask: any = element.querySelector('diagram-mule-task > diagram-icon-mule-task > raphael-icon-mule');
                    expect(iconTask).not.toBeNull();
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.muleTaskActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Service Mule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-mule-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-mule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Mule task');

                    const iconTask: any = element.querySelector('diagram-mule-task > diagram-icon-mule-task > raphael-icon-mule');
                    expect(iconTask).not.toBeNull();
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.muleTaskCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Service Alfresco Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Alfresco Publish task');

                    const iconTask: any = element.querySelector('adf-diagram-publish-task > diagram-icon-alfresco-publish-task >' +
                        ' raphael-icon-alfresco-publish');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.alfrescoPublishTask] };
            ajaxReply(resp);
        });

        it('Should render the Active Service Alfresco Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Alfresco Publish task');

                    const iconTask: any = element.querySelector('adf-diagram-publish-task > diagram-icon-alfresco-publish-task >' +
                        ' raphael-icon-alfresco-publish');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.alfrescoPublishTaskActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Service Alfresco Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('adf-diagram-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Alfresco Publish task');

                    const iconTask: any = element.querySelector('adf-diagram-publish-task > diagram-icon-alfresco-publish-task >' +
                        ' raphael-icon-alfresco-publish');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.alfrescoPublishTaskCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Service Google Drive Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Google Drive Publish task');

                    const iconTask: any = element.querySelector('diagram-google-drive-publish-task >' +
                        ' diagram-icon-google-drive-publish-task > raphael-icon-google-drive-publish');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.googleDrivePublishTask] };
            ajaxReply(resp);
        });

        it('Should render the Active Service Google Drive Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Google Drive Publish task');

                    const iconTask: any = element.querySelector('diagram-google-drive-publish-task >' +
                        ' diagram-icon-google-drive-publish-task > raphael-icon-google-drive-publish');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.googleDrivePublishTaskActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Service Google Drive Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-google-drive-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Google Drive Publish task');

                    const iconTask: any = element.querySelector('diagram-google-drive-publish-task >' +
                        ' diagram-icon-google-drive-publish-task > raphael-icon-google-drive-publish');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.googleDrivePublishTaskCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Rest Call Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Rest Call task');

                    const iconTask: any = element.querySelector('diagram-rest-call-task > diagram-icon-rest-call-task >' +
                        ' raphael-icon-rest-call');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.restCallTask] };
            ajaxReply(resp);
        });

        it('Should render the Active Rest Call Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Rest Call task');

                    const iconTask: any = element.querySelector('diagram-rest-call-task > diagram-icon-rest-call-task >' +
                        ' raphael-icon-rest-call');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.restCallTaskActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Rest Call Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-rest-call-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Rest Call task');

                    const iconTask: any = element.querySelector('diagram-rest-call-task > diagram-icon-rest-call-task >' +
                        ' raphael-icon-rest-call');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.restCallTaskCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Service Box Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Box Publish task');

                    const iconTask: any = element.querySelector('diagram-box-publish-task >' +
                        ' diagram-icon-box-publish-task > raphael-icon-box-publish');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.boxPublishTask] };
            ajaxReply(resp);
        });

        it('Should render the Active Service Box Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Box Publish task');

                    const iconTask: any = element.querySelector('diagram-box-publish-task >' +
                        ' diagram-icon-box-publish-task > raphael-icon-box-publish');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.boxPublishTaskActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Service Box Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-box-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Box Publish task');

                    const iconTask: any = element.querySelector('diagram-box-publish-task >' +
                        ' diagram-icon-box-publish-task > raphael-icon-box-publish');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.boxPublishTaskCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Receive Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-receive-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-receive-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Receive task');

                    const iconTask: any = element.querySelector('diagram-receive-task > diagram-icon-receive-task > raphael-icon-receive');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.receiveTask] };
            ajaxReply(resp);
        });

        it('Should render the Active Receive Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-receive-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-receive-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Receive task');

                    const iconTask: any = element.querySelector('diagram-receive-task > diagram-icon-receive-task > raphael-icon-receive');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.receiveTaskActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Receive Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-receive-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-receive-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Receive task');

                    const iconTask: any = element.querySelector('diagram-receive-task > diagram-icon-receive-task > raphael-icon-receive');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.receiveTaskCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Script Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-script-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-script-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Script task');

                    const iconTask: any = element.querySelector('diagram-script-task > diagram-icon-script-task > raphael-icon-script');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.scriptTask] };
            ajaxReply(resp);
        });

        it('Should render the Active Script Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-script-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-script-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Script task');

                    const iconTask: any = element.querySelector('diagram-script-task > diagram-icon-script-task > raphael-icon-script');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.scriptTaskActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Script Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-script-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-script-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake Script task');

                    const iconTask: any = element.querySelector('diagram-script-task > diagram-icon-script-task > raphael-icon-script');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.scriptTaskCompleted] };
            ajaxReply(resp);
        });

        it('Should render the Business Rule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake BusinessRule task');

                    const iconTask: any = element.querySelector('diagram-business-rule-task > diagram-icon-business-rule-task > raphael-icon-business-rule');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.businessRuleTask] };
            ajaxReply(resp);
        });

        it('Should render the Active Business Rule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-rect[ng-reflect-stroke="#017501"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake BusinessRule task');

                    const iconTask: any = element.querySelector('diagram-business-rule-task > diagram-icon-business-rule-task > raphael-icon-business-rule');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.businessRuleTaskActive] };
            ajaxReply(resp);
        });

        it('Should render the Completed Business Rule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-rect[ng-reflect-stroke="#2632aa"]');
                    expect(task).not.toBeNull();

                    const taskText: any = element.querySelector('diagram-business-rule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Fake BusinessRule task');

                    const iconTask: any = element.querySelector('diagram-business-rule-task > diagram-icon-business-rule-task > raphael-icon-business-rule');
                    expect(iconTask).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.elements[0].name);
                    expect(tooltip.textContent).toContain(res.elements[0].type);
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { elements: [diagramsActivitiesMock.businessRuleTaskCompleted] };
            ajaxReply(resp);
        });
   });
});
