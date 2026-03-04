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
import { StartProcessScreenCloudComponent } from './start-process-screen-cloud.component';
import { MockedTaskScreenCloudComponent } from '../../../../testing/start-process-screen-mock.component';
import { provideScreen } from '../../../services/provide-screen';
import { By } from '@angular/platform-browser';
import { StartProcessScreenCloud, StartProcessScreenDefaultButtons } from './start-process-screen.model';
import { TaskVariableCloud } from '../../../../form/models/task-variable-cloud.model';

describe('StartProcessScreenCloudComponent', () => {
    let component: StartProcessScreenCloudComponent;
    let fixture: ComponentFixture<StartProcessScreenCloudComponent>;
    const screenId = 'screen-1234-5678-121212-123456';
    const processDefinitionId = 'definition-id';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StartProcessScreenCloudComponent],
            providers: [provideScreen(screenId, MockedTaskScreenCloudComponent)]
        }).compileComponents();

        fixture = TestBed.createComponent(StartProcessScreenCloudComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('processDefinitionId', processDefinitionId);
        fixture.componentRef.setInput('screenId', screenId);

        fixture.detectChanges();
    });

    it('should create provided screen component', () => {
        const screenDebugComponent = fixture.debugElement.query(By.directive(MockedTaskScreenCloudComponent));
        expect(screenDebugComponent).toBeTruthy();
    });

    it('should subscribe to outputs', () => {
        const screenStartProcessPayloadChangeSpy = spyOn(component.screenStartProcessPayloadChange, 'emit');
        const disableStartProcessButtonSpy = spyOn(component.disableStartProcessButton, 'emit');

        const screenInstance: StartProcessScreenCloud = fixture.debugElement.query(By.directive(MockedTaskScreenCloudComponent)).componentInstance;

        const startProcessScreenDefaultButtons: StartProcessScreenDefaultButtons = { show: true, disable: false };
        const startProcessPayload = { payload: 'TEST' };
        screenInstance.defaultStartProcessButtonsConfigurationChange.emit(startProcessScreenDefaultButtons);
        screenInstance.startProcessPayloadChanged.emit(startProcessPayload);

        expect(screenStartProcessPayloadChangeSpy).toHaveBeenCalledWith(startProcessPayload);
        expect(disableStartProcessButtonSpy).toHaveBeenCalledWith(startProcessScreenDefaultButtons.disable);
        expect(component.showStartProcessButtons()).toBe(startProcessScreenDefaultButtons.show);
    });

    it('should set process definition id', () => {
        const screenInstance: StartProcessScreenCloud = fixture.debugElement.query(By.directive(MockedTaskScreenCloudComponent)).componentInstance;
        expect(screenInstance.processDefinitionId()).toBe(processDefinitionId);
        const newId = 'new-id';
        fixture.componentRef.setInput('processDefinitionId', newId);
        fixture.detectChanges();
        expect(screenInstance.processDefinitionId()).toEqual(newId);
    });

    it('should set resolvedValues', () => {
        const screenInstance: StartProcessScreenCloud = fixture.debugElement.query(By.directive(MockedTaskScreenCloudComponent)).componentInstance;
        expect(screenInstance.resolvedValues()).toBeUndefined();
        const newValues = [new TaskVariableCloud({ id: 'new-id', name: 'new-name' })];
        fixture.componentRef.setInput('resolvedValues', newValues);
        fixture.detectChanges();
        expect(screenInstance.resolvedValues()).toEqual(newValues);
    });
});
