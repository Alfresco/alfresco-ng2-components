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

import { ButtonWidgetComponent } from './button.widget';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';

describe('ButtonWidgetComponent', () => {
    let component: ButtonWidgetComponent;
    let fixture: ComponentFixture<ButtonWidgetComponent>;
    let loader: HarnessLoader;

    const buttonSelector = '.adf-button-widget__button';
    const mockField = { id: 'button1', name: 'Click me!', type: 'button', readOnly: false, className: 'custom-button-class', tooltip: '' };

    const getButton = async () => loader.getHarness(MatButtonHarness.with({ selector: buttonSelector }));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ButtonWidgetComponent]
        });

        fixture = TestBed.createComponent(ButtonWidgetComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);

        fixture.componentRef.setInput('field', mockField);
    });

    it('should display button with the given name', async () => {
        const button = await getButton();
        const buttonText = await button.getText();

        expect(buttonText).toBe('Click me!');
    });

    it('should NOT disable button when readOnly is false', async () => {
        const button = await getButton();

        expect(await button.isDisabled()).toBe(false);
    });

    it('should disable button when readOnly is true', async () => {
        fixture.componentRef.setInput('field', { ...mockField, readOnly: true });
        const button = await getButton();

        expect(await button.isDisabled()).toBe(true);
    });

    it('should attach className to the widget host element', () => {
        fixture.detectChanges();

        const hostElement = fixture.nativeElement;

        expect(hostElement.classList).toContain('custom-button-class');
    });

    it('should NOT show tooltip when tooltip text is not defined', async () => {
        const buttonTooltip = await loader.getHarness(MatTooltipHarness.with({ selector: buttonSelector }));

        await buttonTooltip.show();

        expect(await buttonTooltip.isOpen()).toBe(false);
    });

    it('should show tooltip when tooltip text is defined', async () => {
        const expectedTooltip = 'This is a tooltip';

        fixture.componentRef.setInput('field', { ...mockField, tooltip: expectedTooltip });

        const buttonTooltip = await loader.getHarness(MatTooltipHarness.with({ selector: buttonSelector }));

        await buttonTooltip.show();

        expect(await buttonTooltip.isOpen()).toBe(true);
        expect(await buttonTooltip.getTooltipText()).toBe(expectedTooltip);
    });

    it('should call event method only once when widget is clicked', async () => {
        const eventSpy = spyOn(component, 'event');

        const button = await getButton();
        await button.click();

        expect(eventSpy).toHaveBeenCalledTimes(1);
    });
});
