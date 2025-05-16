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

import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CONTEXT_MENU_DIRECTIVES } from './context-menu.module';
import { CoreTestingModule } from '../testing/core.testing.module';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { UnitTestingUtils } from '../testing/unit-testing-utils';

@Component({
    selector: 'adf-test-component',
    template: ` <div id="target" [adf-context-menu]="actions" [adf-context-menu-enabled]="isEnabled"></div> `,
    imports: [CoreTestingModule, CONTEXT_MENU_DIRECTIVES]
})
class TestComponent {
    actions: any[] | (() => any[]);
    isEnabled: boolean;
}

const actions = [
    {
        model: {
            visible: false,
            title: 'Action 1'
        },
        subject: {
            next: jasmine.createSpy('next')
        }
    },
    {
        model: {
            visible: true,
            disabled: true,
            title: 'Action 2',
            icon: null
        },
        subject: {
            next: jasmine.createSpy('next')
        }
    },
    {
        model: {
            visible: true,
            disabled: false,
            title: 'Action 3',
            icon: 'action-icon-3'
        },
        subject: {
            next: jasmine.createSpy('next')
        }
    },
    {
        model: {
            visible: true,
            disabled: false,
            title: 'Action 4',
            icon: 'action-icon-4'
        },
        subject: {
            next: jasmine.createSpy('next')
        }
    },
    {
        model: {
            visible: true,
            disabled: false,
            title: 'action-5',
            icon: 'action-icon-5',
            tooltip: 'Action 5 tooltip'
        },
        subject: {
            next: jasmine.createSpy('next')
        }
    },
    {
        model: {
            visible: true,
            disabled: false,
            title: 'action-6',
            icon: 'action-icon-6'
        },
        subject: {
            next: jasmine.createSpy('next')
        }
    }
];

const testCases = [
    {
        description: 'with actions as an array',
        actions
    },
    {
        description: 'with actions as a function',
        actions: () => actions
    }
];

testCases.forEach((testCase) => {
    describe(`ContextMenuDirective ${testCase.description}`, () => {
        let fixture: ComponentFixture<TestComponent>;
        let testingUtils: UnitTestingUtils;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CoreTestingModule, CONTEXT_MENU_DIRECTIVES, TestComponent]
            });
            fixture = TestBed.createComponent(TestComponent);
            fixture.componentInstance.isEnabled = false;
            fixture.componentInstance.actions = testCase.actions;
            testingUtils = new UnitTestingUtils(fixture.debugElement);
            fixture.detectChanges();
        });

        it('should not show menu on mouse contextmenu event when context menu is disabled', () => {
            testingUtils.dispatchCustomEventByCSS('#target', 'contextmenu');
            fixture.detectChanges();

            const contextMenu = document.querySelector('.adf-context-menu');
            expect(contextMenu).toBe(null);
        });

        describe('Events', () => {
            let contextMenu: HTMLElement | null;

            beforeEach(() => {
                fixture.componentInstance.isEnabled = true;
                fixture.detectChanges();

                testingUtils.dispatchCustomEventByCSS('#target', 'contextmenu');
                fixture.detectChanges();
                contextMenu = document.querySelector('.adf-context-menu');
            });

            it('should show menu on mouse contextmenu event', () => {
                expect(contextMenu).not.toBe(null);
            });

            it('should set DOM element reference on  menu open event', () => {
                expect(contextMenu?.className).toContain('adf-context-menu');
            });

            it('should reset DOM element reference on Escape event', () => {
                const event = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Escape'
                });

                document.querySelector('.cdk-overlay-backdrop')?.dispatchEvent(event);
                fixture.detectChanges();
                expect(document.querySelector('.adf-context-menu')).toBe(null);
            });
        });

        describe('Contextmenu list', () => {
            let contextMenu: HTMLElement | null;
            let loader: HarnessLoader;

            beforeEach(() => {
                fixture.componentInstance.isEnabled = true;
                fixture.detectChanges();

                testingUtils.dispatchCustomEventByCSS('#target', 'contextmenu');
                fixture.detectChanges();
                contextMenu = document.querySelector('.adf-context-menu');
                loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
                testingUtils.setLoader(loader);
            });

            it('should not render item with visibility property set to false', () => {
                expect(contextMenu?.querySelectorAll('button').length).toBe(5);
            });

            it('should render item as disabled when `disabled` property is set to true', async () => {
                expect(contextMenu?.querySelectorAll('button')[0].disabled).toBe(true);
            });

            it('should set first not disabled item as active', async () => {
                const icon = await testingUtils.getMatIconWithAncestorByCSS('adf-context-menu');

                expect(await icon.getName()).toEqual('action-icon-3');
            });

            it('should not allow action event when item is disabled', () => {
                contextMenu?.querySelectorAll('button')[0].click();
                fixture.detectChanges();

                expect(actions[1].subject.next).not.toHaveBeenCalled();
            });

            it('should perform action when item is not disabled', () => {
                contextMenu?.querySelectorAll('button')[1].click();
                fixture.detectChanges();

                expect(actions[2].subject.next).toHaveBeenCalled();
            });

            it('should not render item icon if not set', async () => {
                expect(await testingUtils.checkIfMatIconExistsWithAncestorByCSSAndName('adf-context-menu', 'Action 1')).toBeFalse();
            });
        });
    });
});
