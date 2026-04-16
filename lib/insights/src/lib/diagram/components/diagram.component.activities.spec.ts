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

import * as diagramsActivitiesMock from '../../mock/diagram/diagram-activities.mock';
import { DiagramComponent } from './diagram.component';
import { InsightsTestingModule } from '../../testing/insights.testing.module';
import { UnitTestingUtils } from '@alfresco/adf-core';
import { RaphaelMultilineTextDirective, RaphaelRectDirective } from '@alfresco/adf-insights';
import { DiagramsService } from '../services/diagrams.service';
import { of } from 'rxjs';

describe('Diagrams activities', () => {
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
        unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
        diagramsService = TestBed.inject(DiagramsService);
        fixture.detectChanges();
    });

    beforeEach(() => {
        component.processInstanceId = '38399';
        // cspell: disable-next
        component.processDefinitionId = 'fakeprocess:24:38399';
        component.metricPercentages = { startEvent: 0 };
    });

    afterEach(() => {
        component.success.unsubscribe();
        fixture.destroy();
    });

    describe('Diagrams component Activities: ', () => {
        it('Should render the User Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-user-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-user-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake User task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-user-task > diagram-icon-user-task > raphael-icon-user');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.userTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Manual Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-manual-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-manual-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Manual task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-manual-task > diagram-icon-manual-task > raphael-icon-manual');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.manualTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Service Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const task = unitTestingUtils.getByCSS('diagram-service-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-service-task > diagram-task > raphael-multiline-text');
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Service task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-service-task > diagram-icon-service-task > raphael-icon-service');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.serviceTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Service Camel Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-camel-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-camel-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Camel task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-camel-task > diagram-icon-camel-task > raphael-icon-camel');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.camelTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Service Mule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-mule-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-mule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Mule task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-mule-task > diagram-icon-mule-task > raphael-icon-mule');
                    expect(iconTask).not.toBeNull();
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.muleTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Service Alfresco Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('adf-diagram-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('adf-diagram-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Alfresco Publish task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'adf-diagram-publish-task > diagram-icon-alfresco-publish-task >' + ' raphael-icon-alfresco-publish'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.alfrescoPublishTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Service Google Drive Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-google-drive-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-google-drive-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Google Drive Publish task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'diagram-google-drive-publish-task >' + ' diagram-icon-google-drive-publish-task > raphael-icon-google-drive-publish'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.googleDrivePublishTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Rest Call Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-rest-call-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-rest-call-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Rest Call task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-rest-call-task > diagram-icon-rest-call-task >' + ' raphael-icon-rest-call');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.restCallTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Service Box Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-box-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-box-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Box Publish task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'diagram-box-publish-task >' + ' diagram-icon-box-publish-task > raphael-icon-box-publish'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.boxPublishTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Receive Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-receive-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-receive-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Receive task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-receive-task > diagram-icon-receive-task > raphael-icon-receive');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.receiveTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Script Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-script-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-script-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Script task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-script-task > diagram-icon-script-task > raphael-icon-script');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.scriptTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Business Rule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-business-rule-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-business-rule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake BusinessRule task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'diagram-business-rule-task > diagram-icon-business-rule-task > raphael-icon-business-rule'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.businessRuleTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });
    });

    describe('Diagrams component Activities with process instance id: ', () => {
        it('Should render the User Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-user-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-user-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake User task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-user-task > diagram-icon-user-task > raphael-icon-user');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.userTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active User Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-user-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#017501');

                    const taskText = unitTestingUtils.getByCSS('diagram-user-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake User task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-user-task > diagram-icon-user-task > raphael-icon-user');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.userTaskActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed User Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-user-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#2632aa');

                    const taskText = unitTestingUtils.getByCSS('diagram-user-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake User task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-user-task > diagram-icon-user-task > raphael-icon-user');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.userTaskCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Manual Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-manual-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-manual-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Manual task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-manual-task > diagram-icon-manual-task > raphael-icon-manual');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.manualTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Manual Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-manual-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#017501');

                    const taskText = unitTestingUtils.getByCSS('diagram-manual-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Manual task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-manual-task > diagram-icon-manual-task > raphael-icon-manual');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.manualTaskActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Manual Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-manual-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#2632aa');

                    const taskText = unitTestingUtils.getByCSS('diagram-manual-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Manual task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-manual-task > diagram-icon-manual-task > raphael-icon-manual');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.manualTaskCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Service Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-service-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-service-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Service task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-service-task > diagram-icon-service-task > raphael-icon-service');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.serviceTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Service Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-service-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#017501');

                    const taskText = unitTestingUtils.getByCSS('diagram-service-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Service task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-service-task > diagram-icon-service-task > raphael-icon-service');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.serviceTaskActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Service Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-service-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#2632aa');

                    const taskText = unitTestingUtils.getByCSS('diagram-service-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Service task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-service-task > diagram-icon-service-task > raphael-icon-service');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.serviceTaskCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Service Camel Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-camel-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-camel-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Camel task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-camel-task > diagram-icon-camel-task > raphael-icon-camel');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.camelTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Service Camel Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-camel-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#017501');

                    const taskText = unitTestingUtils.getByCSS('diagram-camel-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Camel task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-camel-task > diagram-icon-camel-task > raphael-icon-camel');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);

                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.camelTaskActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Service Camel Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-camel-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#2632aa');

                    const taskText = unitTestingUtils.getByCSS('diagram-camel-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Camel task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-camel-task > diagram-icon-camel-task > raphael-icon-camel');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);

                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.camelTaskCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Service Mule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-mule-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-mule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Mule task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-mule-task > diagram-icon-mule-task > raphael-icon-mule');
                    expect(iconTask).not.toBeNull();
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.muleTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Service Mule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-mule-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#017501');

                    const taskText = unitTestingUtils.getByCSS('diagram-mule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Mule task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-mule-task > diagram-icon-mule-task > raphael-icon-mule');
                    expect(iconTask).not.toBeNull();
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.muleTaskActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Service Mule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-mule-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#2632aa');

                    const taskText = unitTestingUtils.getByCSS('diagram-mule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Mule task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-mule-task > diagram-icon-mule-task > raphael-icon-mule');
                    expect(iconTask).not.toBeNull();
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.muleTaskCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Service Alfresco Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('adf-diagram-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('adf-diagram-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Alfresco Publish task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'adf-diagram-publish-task > diagram-icon-alfresco-publish-task >' + ' raphael-icon-alfresco-publish'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.alfrescoPublishTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Service Alfresco Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('adf-diagram-publish-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#017501');

                    const taskText = unitTestingUtils.getByCSS('adf-diagram-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Alfresco Publish task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'adf-diagram-publish-task > diagram-icon-alfresco-publish-task >' + ' raphael-icon-alfresco-publish'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.alfrescoPublishTaskActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Service Alfresco Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('adf-diagram-publish-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#2632aa');

                    const taskText = unitTestingUtils.getByCSS('adf-diagram-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Alfresco Publish task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'adf-diagram-publish-task > diagram-icon-alfresco-publish-task >' + ' raphael-icon-alfresco-publish'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.alfrescoPublishTaskCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Service Google Drive Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-google-drive-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-google-drive-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Google Drive Publish task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'diagram-google-drive-publish-task >' + ' diagram-icon-google-drive-publish-task > raphael-icon-google-drive-publish'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.googleDrivePublishTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Service Google Drive Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-google-drive-publish-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#017501');

                    const taskText = unitTestingUtils.getByCSS('diagram-google-drive-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Google Drive Publish task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'diagram-google-drive-publish-task >' + ' diagram-icon-google-drive-publish-task > raphael-icon-google-drive-publish'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.googleDrivePublishTaskActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Service Google Drive Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-google-drive-publish-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#2632aa');

                    const taskText = unitTestingUtils.getByCSS('diagram-google-drive-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Google Drive Publish task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'diagram-google-drive-publish-task >' + ' diagram-icon-google-drive-publish-task > raphael-icon-google-drive-publish'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.googleDrivePublishTaskCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Rest Call Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-rest-call-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-rest-call-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Rest Call task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-rest-call-task > diagram-icon-rest-call-task >' + ' raphael-icon-rest-call');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.restCallTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Rest Call Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-rest-call-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#017501');

                    const taskText = unitTestingUtils.getByCSS('diagram-rest-call-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Rest Call task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-rest-call-task > diagram-icon-rest-call-task >' + ' raphael-icon-rest-call');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.restCallTaskActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Rest Call Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-rest-call-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#2632aa');

                    const taskText = unitTestingUtils.getByCSS('diagram-rest-call-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Rest Call task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-rest-call-task > diagram-icon-rest-call-task >' + ' raphael-icon-rest-call');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.restCallTaskCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Service Box Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-box-publish-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-box-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Box Publish task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'diagram-box-publish-task >' + ' diagram-icon-box-publish-task > raphael-icon-box-publish'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.boxPublishTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Service Box Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-box-publish-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#017501');

                    const taskText = unitTestingUtils.getByCSS('diagram-box-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Box Publish task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'diagram-box-publish-task >' + ' diagram-icon-box-publish-task > raphael-icon-box-publish'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.boxPublishTaskActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Service Box Publish Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-box-publish-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#2632aa');

                    const taskText = unitTestingUtils.getByCSS('diagram-box-publish-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Box Publish task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'diagram-box-publish-task >' + ' diagram-icon-box-publish-task > raphael-icon-box-publish'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.boxPublishTaskCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Receive Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-receive-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-receive-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Receive task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-receive-task > diagram-icon-receive-task > raphael-icon-receive');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.receiveTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Receive Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-receive-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#017501');

                    const taskText = unitTestingUtils.getByCSS('diagram-receive-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Receive task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-receive-task > diagram-icon-receive-task > raphael-icon-receive');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.receiveTaskActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Receive Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-receive-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#2632aa');

                    const taskText = unitTestingUtils.getByCSS('diagram-receive-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Receive task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-receive-task > diagram-icon-receive-task > raphael-icon-receive');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.receiveTaskCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Script Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-script-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-script-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Script task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-script-task > diagram-icon-script-task > raphael-icon-script');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.scriptTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Script Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-script-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#017501');

                    const taskText = unitTestingUtils.getByCSS('diagram-script-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Script task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-script-task > diagram-icon-script-task > raphael-icon-script');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.scriptTaskActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Script Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-script-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#2632aa');

                    const taskText = unitTestingUtils.getByCSS('diagram-script-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake Script task');

                    const iconTask = unitTestingUtils.getByCSS('diagram-script-task > diagram-icon-script-task > raphael-icon-script');
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.scriptTaskCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Business Rule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-business-rule-task > diagram-task > raphael-rect');
                    expect(task).not.toBeNull();

                    const taskText = unitTestingUtils.getByCSS('diagram-business-rule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake BusinessRule task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'diagram-business-rule-task > diagram-icon-business-rule-task > raphael-icon-business-rule'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.businessRuleTask] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Active Business Rule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-business-rule-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#017501');

                    const taskText = unitTestingUtils.getByCSS('diagram-business-rule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake BusinessRule task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'diagram-business-rule-task > diagram-icon-business-rule-task > raphael-icon-business-rule'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.businessRuleTaskActive] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });

        it('Should render the Completed Business Rule Task', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const task = unitTestingUtils.getByCSS('diagram-business-rule-task > diagram-task > raphael-rect');
                    expect(task?.injector.get(RaphaelRectDirective).stroke).toBe('#2632aa');

                    const taskText = unitTestingUtils.getByCSS('diagram-business-rule-task > diagram-task > raphael-multiline-text');
                    expect(taskText).not.toBeNull();
                    expect(taskText.injector.get(RaphaelMultilineTextDirective).text).toEqual('Fake BusinessRule task');

                    const iconTask = unitTestingUtils.getByCSS(
                        'diagram-business-rule-task > diagram-icon-business-rule-task > raphael-icon-business-rule'
                    );
                    expect(iconTask).not.toBeNull();

                    const tooltip = unitTestingUtils.getInnerTextByCSS('diagram-tooltip > div');
                    expect(tooltip).toContain(res.elements[0].name);
                    expect(tooltip).toContain(res.elements[0].type);
                    done();
                });
            });
            const resp = { elements: [diagramsActivitiesMock.businessRuleTaskCompleted] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });
    });
});
