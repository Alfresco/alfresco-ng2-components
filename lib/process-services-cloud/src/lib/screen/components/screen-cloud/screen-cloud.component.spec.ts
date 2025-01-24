/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ScreenRenderingService } from '../../../services/public-api';
import { TaskScreenCloudComponent } from './screen-cloud.component';

@Component({
    selector: 'adf-cloud-test-component',
    template: `
        <div class="adf-cloud-test-container">
            test component
            <div class="adf-cloud-test-container-taskId">{{ taskId }}</div>
            <button class="adf-cloud-test-container-complete-btn" (click)="onComplete()">complete</button>
        </div>
    `,
    imports: [CommonModule]
})
class TestComponent {
    @Input() taskId = '';
    @Output() taskCompleted = new EventEmitter();
    onComplete() {
        this.taskCompleted.emit();
    }
}

@Component({
    selector: 'adf-cloud-test-actions-component',
    template: `
        <adf-cloud-task-screen [taskId]="'1'" [appName]="'app-name-test'" [screenId]="'test'" (taskCompleted)="onTaskCompleted()">
            <div buttons class="adf-cloud-test-buttons">
                <button>Test</button>
            </div>
        </adf-cloud-task-screen>
    `,
    imports: [CommonModule, TaskScreenCloudComponent]
})
class TestWrapperComponent {
    onTaskCompleted() {}
}

describe('TaskScreenCloudComponent', () => {
    let fixture: ComponentFixture<TestWrapperComponent>;
    let screenRenderingService: ScreenRenderingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TaskScreenCloudComponent, TestComponent, TestWrapperComponent]
        });
        fixture = TestBed.createComponent(TestWrapperComponent);
        screenRenderingService = TestBed.inject(ScreenRenderingService);
        screenRenderingService.register({ ['test']: () => TestComponent });
        fixture.componentRef.setInput('screenId', 'test');
        fixture.detectChanges();
    });

    it('should create custom component instance', () => {
        const dynamicComponent = fixture.debugElement.query(By.css('.adf-cloud-test-container'));
        expect(dynamicComponent).toBeTruthy();
    });

    it('should project content into component', async () => {
        const projectedContent = fixture.debugElement.query(By.css('.adf-cloud-test-buttons'));
        expect(projectedContent).toBeTruthy();
    });

    it('should set input property for dynamic component', () => {
        const inputValueFromDynamicComponent = fixture.debugElement.query(By.css('.adf-cloud-test-container-taskId'));
        expect((inputValueFromDynamicComponent.nativeElement as HTMLElement).textContent).toBe('1');
    });

    it('should subscribe to the output of dynamic component', () => {
        const onTaskCompletedSpy = spyOn(fixture.componentInstance, 'onTaskCompleted');
        const btnComplete = fixture.debugElement.query(By.css('.adf-cloud-test-container-complete-btn'));

        expect(btnComplete).toBeDefined();

        (btnComplete.nativeElement as HTMLButtonElement).click();
        expect(onTaskCompletedSpy).toHaveBeenCalled();
    });
});
