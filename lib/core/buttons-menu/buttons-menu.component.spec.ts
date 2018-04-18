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

import { TestBed, async } from '@angular/core/testing';
import { ButtonsMenuComponent } from './buttons-menu.component';
import { MenuButton } from './menu-button.model';

describe('ButtonsMenuComponent', () => {

    let fixture;
    let buttonsMenuComponent: ButtonsMenuComponent;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ButtonsMenuComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ButtonsMenuComponent);
        element = fixture.nativeElement;
        buttonsMenuComponent = <ButtonsMenuComponent> fixture.debugElement.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should create buttons menu component', async(() => {
        expect(buttonsMenuComponent).toBeDefined();
    }));

    it('should hide buttons menu div when array is empty', async(() => {
        buttonsMenuComponent.buttons = [];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const buttonsMenuElement = element.querySelector('#adf-buttons-menu');
            expect(buttonsMenuElement).toBeNull();
        });
    }));

    it('should render buttons menu when there is at least one button declared in the buttons array', async(() => {
        const button = new MenuButton({
            label: 'button',
            icon: 'button',
            id: 'clickMe'
        });
        buttonsMenuComponent.buttons = [button];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const buttonsMenuElement = element.querySelector('#adf-buttons-menu');
            expect(buttonsMenuElement).not.toBeNull();
            expect(buttonsMenuElement).toBeDefined();
        });
    }));

    it('should call the handler function when button is clicked', async(() => {
        const button = new MenuButton({
            label: 'button',
            icon: 'button',
            id: 'clickMe'
        });
        button.handler = jasmine.createSpy('handler');
        buttonsMenuComponent.buttons = [button];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const buttonsMenuElement: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#clickMe');
            expect(buttonsMenuElement).not.toBeNull();
            expect(buttonsMenuElement).toBeDefined();
            buttonsMenuElement.click();
            fixture.detectChanges();
            expect(button.handler).toHaveBeenCalled();
        });
    }));
});
