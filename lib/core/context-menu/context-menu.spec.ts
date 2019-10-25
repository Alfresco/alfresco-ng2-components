/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { ContextMenuModule } from './context-menu.module';
import { CoreModule } from '../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { setupTestBed } from '../testing/setupTestBed';

@Component({
    selector: 'adf-test-component',
    template: `
        <div id="target" [adf-context-menu]="actions" [adf-context-menu-enabled]="true"></div>
    `
})
class TestComponent {
    actions;
}

describe('ContextMenuDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
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
        }
    ];

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            ContextMenuModule,
            NoopAnimationsModule
        ],
        declarations: [
            TestComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        fixture.componentInstance.actions = actions;
        fixture.detectChanges();
    });

    it('should not render contextmenu when action was not performed', () => {
        const  containerElement = fixture.debugElement.nativeElement.parentElement;
        expect(containerElement.querySelector('.adf-context-menu button')).toBe(null);
    });

    describe('Events', () => {
        let targetElement: HTMLElement;
        let contextMenu: HTMLElement;

        beforeEach(() => {
            targetElement = fixture.debugElement.nativeElement.querySelector('#target');
            targetElement.dispatchEvent(new CustomEvent('contextmenu'));
            fixture.detectChanges();
            contextMenu = document.querySelector('.adf-context-menu');
        });

        it('should show menu on mouse contextmenu event', () => {
            expect(contextMenu).not.toBe(null);
        });

        it('should set DOM element reference on  menu open event', () => {
            expect(contextMenu.className).toContain('adf-context-menu');
        });

        it('should reset DOM element reference on Escape event', () => {
            const event = new KeyboardEvent('keydown', {
                bubbles : true, cancelable : true, key : 'Escape'
            });

            document.querySelector('.cdk-overlay-backdrop').dispatchEvent(event);
            fixture.detectChanges();
            expect(document.querySelector('.adf-context-menu')).toBe(null);
        });
    });

    describe('Contextmenu list', () => {
        let targetElement: HTMLElement;
        let contextMenu: HTMLElement;

        beforeEach(() => {
            targetElement = fixture.debugElement.nativeElement.querySelector('#target');
            targetElement.dispatchEvent(new CustomEvent('contextmenu'));
            fixture.detectChanges();
            contextMenu = document.querySelector('.adf-context-menu');
        });

        it('should not render item with visibility property set to false', () => {
            expect(contextMenu.querySelectorAll('button').length).toBe(3);
        });

        it('should render item as disabled when `disabled` property is set to true', () => {
            expect(contextMenu.querySelectorAll('button')[0].disabled).toBe(true);
        });

        it('should set first not disabled item as active', () => {
            expect(document.activeElement.querySelector('mat-icon').innerHTML).toContain('action-icon-3');
        });

        it('should not allow action event when item is disabled', () => {
            contextMenu.querySelectorAll('button')[0].click();
            fixture.detectChanges();

            expect(fixture.componentInstance.actions[1].subject.next).not.toHaveBeenCalled();
        });

        it('should perform action when item is not disabled', () => {
            contextMenu.querySelectorAll('button')[1].click();
            fixture.detectChanges();

            expect(fixture.componentInstance.actions[2].subject.next).toHaveBeenCalled();
        });

        it('should not render item icon if not set', () => {
            expect(contextMenu.querySelectorAll('button')[0].querySelector('mat-icon')).toBe(null);
        });
    });
});
