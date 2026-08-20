/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ScreenRenderingService } from '../../../services/screen-rendering.service';
import { TaskScreenCloudComponent } from './screen-cloud.component';

@Component({
    selector: 'adf-cloud-test-component',
    template: `
        <div class="adf-cloud-test-container">
            test component
            <div class="adf-cloud-test-container-taskId">{{ taskId }}</div>
            <div class="adf-cloud-test-container-rootProcessInstanceId">{{ rootProcessInstanceId }}</div>
            <button class="adf-cloud-test-container-complete-btn" (click)="onComplete()">complete</button>
        </div>
    `
})
class TestComponent implements OnDestroy {
    @Input() taskId = '';
    @Input() screenId = '';
    @Input() rootProcessInstanceId = '';
    @Output() taskCompleted = new EventEmitter();
    displayMode: string | undefined;
    destroyed = false;
    onComplete() {
        this.taskCompleted.emit();
    }
    switchToDisplayMode(newDisplayMode?: string) {
        this.displayMode = newDisplayMode;
    }
    ngOnDestroy(): void {
        this.destroyed = true;
    }
}

@Component({
    selector: 'adf-cloud-test-actions-component',
    template: `
        <adf-cloud-task-screen
            [taskId]="'1'"
            [appName]="'app-name-test'"
            [screenId]="'test'"
            [rootProcessInstanceId]="'abcd-1234'"
            (taskCompleted)="onTaskCompleted()"
        />
    `,
    imports: [TaskScreenCloudComponent]
})
class TestWrapperComponent {
    @Input() screenId = '';
    @ViewChild('adfCloudTaskScreen') adfCloudTaskScreen: TaskScreenCloudComponent | undefined;
    onTaskCompleted() {}
    switchToDisplayMode(newDisplayMode?: string): void {
        if (this.adfCloudTaskScreen) {
            this.adfCloudTaskScreen.switchToDisplayMode(newDisplayMode);
        }
    }
}

describe('TaskScreenCloudComponent', () => {
    let fixture: ComponentFixture<TestWrapperComponent>;
    let screenRenderingService: ScreenRenderingService;
    let component: TestWrapperComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TaskScreenCloudComponent, TestComponent, TestWrapperComponent]
        });
        fixture = TestBed.createComponent(TestWrapperComponent);
        component = fixture.componentInstance;
        screenRenderingService = TestBed.inject(ScreenRenderingService);
        screenRenderingService.register({ ['test']: () => TestComponent });
        fixture.componentRef.setInput('screenId', 'test');
        fixture.detectChanges();
    });

    it('should create custom component instance', () => {
        const dynamicComponent = fixture.debugElement.query(By.css('.adf-cloud-test-container'));
        expect(dynamicComponent).toBeTruthy();
    });

    it('should set input property for dynamic component', () => {
        const inputValueFromDynamicComponent = fixture.debugElement.query(By.css('.adf-cloud-test-container-taskId'));
        expect((inputValueFromDynamicComponent.nativeElement as HTMLElement).textContent).toBe('1');
    });

    it('should set input property rootProcessInstanceId for dynamic component', () => {
        const inputValueFromDynamicComponent = fixture.debugElement.query(By.css('.adf-cloud-test-container-rootProcessInstanceId'));
        expect((inputValueFromDynamicComponent.nativeElement as HTMLElement).textContent).toBe('abcd-1234');
    });

    it('should subscribe to the output of dynamic component', () => {
        const onTaskCompletedSpy = spyOn(fixture.componentInstance, 'onTaskCompleted');
        const btnComplete = fixture.debugElement.query(By.css('.adf-cloud-test-container-complete-btn'));

        expect(btnComplete).toBeDefined();

        (btnComplete.nativeElement as HTMLButtonElement).click();
        expect(onTaskCompletedSpy).toHaveBeenCalled();
    });

    it('should call switchToDisplayMode on dynamic component', () => {
        const taskScreenCloudComponentSpy = jasmine.createSpyObj('TaskScreenCloudComponent', ['switchToDisplayMode']);
        component.adfCloudTaskScreen = taskScreenCloudComponentSpy;
        component.switchToDisplayMode();
        fixture.detectChanges();

        expect(component.adfCloudTaskScreen?.switchToDisplayMode).toHaveBeenCalled();
    });
});

@Component({
    selector: 'adf-cloud-test-conditional-component',
    template: `
        @if (showTaskScreen) {
            <adf-cloud-task-screen [taskId]="'1'" [appName]="'app-name-test'" [screenId]="'test'" (taskCompleted)="onTaskCompleted()" />
        }
    `,
    imports: [TaskScreenCloudComponent]
})
class TestConditionalWrapperComponent {
    showTaskScreen = true;
    onTaskCompleted() {}
}

describe('TaskScreenCloudComponent - destroy', () => {
    let fixture: ComponentFixture<TestConditionalWrapperComponent>;
    let component: TestConditionalWrapperComponent;

    const getDynamicComponentInstance = (): TestComponent => fixture.debugElement.query(By.directive(TestComponent)).componentInstance;

    const getTaskScreen = (): TaskScreenCloudComponent => fixture.debugElement.query(By.directive(TaskScreenCloudComponent)).componentInstance;

    const destroyTaskScreen = () => {
        component.showTaskScreen = false;
        fixture.detectChanges();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TaskScreenCloudComponent, TestComponent, TestConditionalWrapperComponent]
        });
        TestBed.inject(ScreenRenderingService).register({ ['test']: () => TestComponent });

        fixture = TestBed.createComponent(TestConditionalWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should destroy the dynamic component when the task screen is destroyed', () => {
        const dynamicComponentInstance = getDynamicComponentInstance();
        expect(dynamicComponentInstance.destroyed).toBeFalse();

        destroyTaskScreen();

        expect(dynamicComponentInstance.destroyed).toBeTrue();
    });

    it('should remove the dynamic component from the DOM when the task screen is destroyed', () => {
        expect(fixture.debugElement.query(By.css('.adf-cloud-test-container'))).toBeTruthy();

        destroyTaskScreen();

        expect(fixture.debugElement.query(By.css('.adf-cloud-test-container'))).toBeNull();
    });

    it('should not emit outputs of the dynamic component after the task screen is destroyed', () => {
        const onTaskCompletedSpy = spyOn(component, 'onTaskCompleted');
        const dynamicComponentInstance = getDynamicComponentInstance();

        destroyTaskScreen();
        dynamicComponentInstance.taskCompleted.emit();

        expect(onTaskCompletedSpy).not.toHaveBeenCalled();
    });

    it('should not call the dynamic component when switching display mode after destroy', () => {
        const taskScreen = getTaskScreen();
        const switchToDisplayModeSpy = spyOn(getDynamicComponentInstance(), 'switchToDisplayMode');

        destroyTaskScreen();

        expect(() => taskScreen.switchToDisplayMode('mode')).not.toThrow();
        expect(switchToDisplayModeSpy).not.toHaveBeenCalled();
    });

    it('should create a new dynamic component instance when the task screen is re-created', () => {
        const firstInstance = getDynamicComponentInstance();

        destroyTaskScreen();
        component.showTaskScreen = true;
        fixture.detectChanges();

        const secondInstance = getDynamicComponentInstance();
        expect(secondInstance).not.toBe(firstInstance);
        expect(secondInstance.destroyed).toBeFalse();
        expect(secondInstance.taskId).toBe('1');
    });
});

describe('TaskScreenCloudComponent - without screenId', () => {
    let fixture: ComponentFixture<TaskScreenCloudComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TaskScreenCloudComponent]
        });
        fixture = TestBed.createComponent(TaskScreenCloudComponent);
    });

    it('should not create any dynamic component and should not throw', () => {
        expect(() => fixture.detectChanges()).not.toThrow();
        expect(fixture.debugElement.query(By.directive(TestComponent))).toBeNull();
    });

    it('should not throw when switching display mode or destroying', () => {
        fixture.detectChanges();

        expect(() => fixture.componentInstance.switchToDisplayMode('mode')).not.toThrow();
        expect(() => fixture.destroy()).not.toThrow();
    });
});
