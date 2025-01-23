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

import { HarnessLoader, TestElement, TestKey } from '@angular/cdk/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatOptionHarness } from '@angular/material/core/testing';
import { MatChipGridHarness, MatChipHarness, MatChipListboxHarness } from '@angular/material/chips/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatErrorHarness, MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { ComponentFixture } from '@angular/core/testing';

export class UnitTestingUtils {
    static getByCSS(debugElement: DebugElement, selector: string): DebugElement {
        return debugElement.query(By.css(selector));
    }

    static getAllByCSS(debugElement: DebugElement, selector: string): DebugElement[] {
        return debugElement.queryAll(By.css(selector));
    }

    static getInnerTextByCSS(debugElement: DebugElement, selector: string): string {
        return UnitTestingUtils.getByCSS(debugElement, selector).nativeElement.innerText;
    }

    static getByDataAutomationId(debugElement: DebugElement, dataAutomationId: string): DebugElement {
        return UnitTestingUtils.getByCSS(debugElement, `[data-automation-id="${dataAutomationId}"]`);
    }

    static getByDataAutomationClass(debugElement: DebugElement, dataAutomationClass: string): DebugElement {
        return UnitTestingUtils.getByCSS(debugElement, `[data-automation-class="${dataAutomationClass}"]`);
    }

    static getAllByDataAutomationId(debugElement: DebugElement, dataAutomationId: string): DebugElement[] {
        return UnitTestingUtils.getAllByCSS(debugElement, `[data-automation-id="${dataAutomationId}"]`);
    }

    static getInnerTextByDataAutomationId(debugElement: DebugElement, dataAutomationId: string): string {
        return UnitTestingUtils.getByDataAutomationId(debugElement, dataAutomationId).nativeElement.innerText;
    }

    static getByDirective(debugElement: DebugElement, directive: any): DebugElement {
        return debugElement.query(By.directive(directive));
    }

    /** Perform actions */

    static clickByCSS(debugElement: DebugElement, selector: string): void {
        const element = UnitTestingUtils.getByCSS(debugElement, selector);
        element.triggerEventHandler('click', new MouseEvent('click'));
    }

    static clickByDataAutomationId(debugElement: DebugElement, dataAutomationId: string): void {
        UnitTestingUtils.getByDataAutomationId(debugElement, dataAutomationId).nativeElement.click();
    }

    static doubleClickByDataAutomationId(debugElement: DebugElement, dataAutomationId: string): void {
        const element = UnitTestingUtils.getByDataAutomationId(debugElement, dataAutomationId);
        element.triggerEventHandler('dblclick', new MouseEvent('dblclick'));
    }

    static blurByCSS(debugElement: DebugElement, selector: string): void {
        const element = UnitTestingUtils.getByCSS(debugElement, selector);
        element.triggerEventHandler('blur', new FocusEvent('blur'));
    }

    static hoverOverByCSS(debugElement: DebugElement, selector: string): void {
        const element = UnitTestingUtils.getByCSS(debugElement, selector);
        element.triggerEventHandler('mouseenter', new MouseEvent('mouseenter'));
    }

    static hoverOverByDataAutomationId(debugElement: DebugElement, dataAutomationId: string): void {
        const element = UnitTestingUtils.getByDataAutomationId(debugElement, dataAutomationId);
        element.triggerEventHandler('mouseenter', new MouseEvent('mouseenter'));
    }

    static mouseLeaveByCSS(debugElement: DebugElement, selector: string): void {
        const element = UnitTestingUtils.getByCSS(debugElement, selector);
        element.triggerEventHandler('mouseleave', new MouseEvent('mouseleave'));
    }

    static mouseLeaveByDataAutomationId(debugElement: DebugElement, dataAutomationId: string): void {
        const element = UnitTestingUtils.getByDataAutomationId(debugElement, dataAutomationId);
        element.triggerEventHandler('mouseleave', new MouseEvent('mouseleave'));
    }

    static keyBoardEventByCSS(debugElement: DebugElement, selector: string, event: 'keyup' | 'keydown', code: string, key: string): void {
        const element = UnitTestingUtils.getByCSS(debugElement, selector);
        element.nativeElement.dispatchEvent(new KeyboardEvent(event, { code, key }));
    }

    static dispatchCustomEventByCSS(debugElement: DebugElement, selector: string, eventName: string): void {
        const element = UnitTestingUtils.getByCSS(debugElement, selector);
        element.nativeElement.dispatchEvent(new CustomEvent(eventName));
    }

    /** Input related methods */

    static getInputByCSS(debugElement: DebugElement, selector: string): HTMLInputElement {
        return UnitTestingUtils.getByCSS(debugElement, selector)?.nativeElement;
    }

    static getInputByDataAutomationId(debugElement: DebugElement, dataAutomationId: string): HTMLInputElement {
        return UnitTestingUtils.getByDataAutomationId(debugElement, dataAutomationId)?.nativeElement;
    }

    static fillInputByCSS(debugElement: DebugElement, selector: string, value: any): void {
        const input = UnitTestingUtils.getInputByCSS(debugElement, selector);
        input.value = value;
        input.dispatchEvent(new Event('input'));
    }

    static fillInputByDataAutomationId(debugElement: DebugElement, dataAutomationId: string, value: any): void {
        const input = UnitTestingUtils.getInputByDataAutomationId(debugElement, dataAutomationId);
        input.value = value;
        input.dispatchEvent(new Event('input'));
    }

    /** MatButton related methods */

    static async getMatButton(loader: HarnessLoader): Promise<MatButtonHarness> {
        return loader.getHarness(MatButtonHarness);
    }

    static async getMatButtonByCSS(loader: HarnessLoader, selector: string): Promise<MatButtonHarness> {
        return loader.getHarness(MatButtonHarness.with({ selector }));
    }

    static async getMatButtonByDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<MatButtonHarness> {
        return loader.getHarness(MatButtonHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    static async checkIfMatButtonExists(loader: HarnessLoader): Promise<boolean> {
        return loader.hasHarness(MatButtonHarness);
    }

    static async checkIfMatButtonExistsWithDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<boolean> {
        return loader.hasHarness(MatButtonHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    static async clickMatButton(loader: HarnessLoader): Promise<void> {
        const button = await this.getMatButton(loader);
        await button.click();
    }

    static async clickMatButtonByCSS(loader: HarnessLoader, selector: string): Promise<void> {
        const button = await this.getMatButtonByCSS(loader, selector);
        await button.click();
    }

    static async clickMatButtonByDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<void> {
        const button = await this.getMatButtonByDataAutomationId(loader, dataAutomationId);
        await button.click();
    }

    static async sendKeysToMatButton(loader: HarnessLoader, keys: string[] | TestKey[]): Promise<void> {
        const button = await this.getMatButton(loader);
        const host = await button.host();
        await host.sendKeys(...keys);
    }

    /** MatCheckbox related methods */

    static async getMatCheckbox(loader: HarnessLoader): Promise<MatCheckboxHarness> {
        return loader.getHarness(MatCheckboxHarness);
    }

    static async getMatCheckboxByDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<MatCheckboxHarness> {
        return loader.getHarness(MatCheckboxHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    static async getMatCheckboxHost(loader: HarnessLoader): Promise<TestElement> {
        const checkbox = await this.getMatCheckbox(loader);
        return checkbox.host();
    }

    static async getAllMatCheckboxes(loader: HarnessLoader): Promise<MatCheckboxHarness[]> {
        return loader.getAllHarnesses(MatCheckboxHarness);
    }

    static async checkIfMatCheckboxIsChecked(loader: HarnessLoader): Promise<boolean> {
        const checkbox = await this.getMatCheckbox(loader);
        return checkbox.isChecked();
    }

    static async checkIfMatCheckboxesHaveClass(loader: HarnessLoader, className: string): Promise<boolean> {
        const checkboxes = await this.getAllMatCheckboxes(loader);
        return checkboxes.every(async (checkbox) => (await checkbox.host()).hasClass(className));
    }

    static async hoverOverMatCheckbox(loader: HarnessLoader): Promise<void> {
        const host = await this.getMatCheckboxHost(loader);
        await host.hover();
    }

    /** MatIcon related methods */

    static async getMatIconOrNull(loader: HarnessLoader): Promise<MatIconHarness> {
        return loader.getHarnessOrNull(MatIconHarness);
    }

    static async getMatIconWithAncestorByDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<MatIconHarness> {
        return loader.getHarness(MatIconHarness.with({ ancestor: `[data-automation-id="${dataAutomationId}"]` }));
    }

    static async getMatIconWithAncestorByCSS(loader: HarnessLoader, selector: string): Promise<MatIconHarness> {
        return loader.getHarness(MatIconHarness.with({ ancestor: selector }));
    }

    static async getMatIconWithAncestorByCSSAndName(loader: HarnessLoader, selector: string, name: string): Promise<MatIconHarness> {
        return loader.getHarness(MatIconHarness.with({ ancestor: selector, name }));
    }

    static async checkIfMatIconExistsWithAncestorByDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<boolean> {
        return loader.hasHarness(MatIconHarness.with({ ancestor: `[data-automation-id="${dataAutomationId}"]` }));
    }

    static async checkIfMatIconExistsWithAncestorByCSSAndName(loader: HarnessLoader, selector: string, name: string): Promise<boolean> {
        return loader.hasHarness(MatIconHarness.with({ ancestor: selector, name }));
    }

    static async clickMatIconWithAncestorByDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<void> {
        const icon = await this.getMatIconWithAncestorByDataAutomationId(loader, dataAutomationId);
        const host = await icon.host();
        await host.click();
    }

    /** MatSelect related methods */

    static async getMatSelectOptions(loader: HarnessLoader, isOpened = false): Promise<MatOptionHarness[]> {
        const select = await loader.getHarness(MatSelectHarness);
        if (!isOpened) {
            await select.open();
        }
        return select.getOptions();
    }

    static async getMatSelectHost(loader: HarnessLoader): Promise<TestElement> {
        const select = await loader.getHarness(MatSelectHarness);
        return select.host();
    }

    static async checkIfMatSelectExists(loader: HarnessLoader): Promise<boolean> {
        return loader.hasHarness(MatSelectHarness);
    }

    static async openMatSelect(loader: HarnessLoader): Promise<void> {
        const select = await loader.getHarness(MatSelectHarness);
        await select.open();
    }

    /** MatChips related methods */

    static async getMatChipByDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<MatChipHarness> {
        return loader.getHarness(MatChipHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    static async checkIfMatChipExistsWithDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<boolean> {
        return loader.hasHarness(MatChipHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    static async clickMatChip(loader: HarnessLoader, dataAutomationId: string): Promise<void> {
        const chip = await this.getMatChipByDataAutomationId(loader, dataAutomationId);
        const host = await chip.host();
        await host.click();
    }

    static async getMatChips(loader: HarnessLoader): Promise<MatChipHarness[]> {
        return loader.getAllHarnesses(MatChipHarness);
    }

    /** MatChipListbox related methods */

    static async getMatChipListboxByDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<MatChipListboxHarness> {
        return loader.getHarness(MatChipListboxHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    static async clickMatChipListbox(loader: HarnessLoader, dataAutomationId: string): Promise<void> {
        const chipList = await this.getMatChipListboxByDataAutomationId(loader, dataAutomationId);
        const host = await chipList.host();
        await host.click();
    }

    /** MatChipGrid related methods */

    static async checkIfMatChipGridExists(loader: HarnessLoader): Promise<boolean> {
        return loader.hasHarness(MatChipGridHarness);
    }

    /** MatFromField related methods */

    static async getMatFormField(loader: HarnessLoader): Promise<MatFormFieldHarness> {
        return loader.getHarness(MatFormFieldHarness);
    }

    static async getMatFormFieldByCSS(loader: HarnessLoader, selector: string): Promise<MatFormFieldHarness> {
        return loader.getHarness(MatFormFieldHarness.with({ selector }));
    }

    /** MatInput related methods */

    static async getMatInput(loader: HarnessLoader): Promise<MatInputHarness> {
        return loader.getHarness(MatInputHarness);
    }

    static async getMatInputByCSS(loader: HarnessLoader, selector: string): Promise<MatInputHarness> {
        return loader.getHarness(MatInputHarness.with({ selector }));
    }

    static async getMatInputByDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<MatInputHarness> {
        return loader.getHarness(MatInputHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    static async getMatInputByPlaceholder(loader: HarnessLoader, placeholder: string): Promise<MatInputHarness> {
        return loader.getHarness(MatInputHarness.with({ placeholder }));
    }

    static async getMatInputHost(loader: HarnessLoader): Promise<TestElement> {
        const input = await this.getMatInput(loader);
        return input.host();
    }

    static async checkIfMatInputExists(loader: HarnessLoader): Promise<boolean> {
        return loader.hasHarness(MatInputHarness);
    }

    static async checkIfMatInputExistsWithCSS(loader: HarnessLoader, selector: string): Promise<boolean> {
        return loader.hasHarness(MatInputHarness.with({ selector }));
    }

    static async checkIfMatInputExistsWithDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<boolean> {
        return loader.hasHarness(MatInputHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    static async checkIfMatInputExistsWithPlaceholder(loader: HarnessLoader, placeholder: string): Promise<boolean> {
        return loader.hasHarness(MatInputHarness.with({ placeholder }));
    }

    static async clickMatInput(loader: HarnessLoader): Promise<void> {
        const input = await this.getMatInput(loader);
        const host = await input.host();
        await host.click();
    }

    static async fillMatInput(loader: HarnessLoader, value: string): Promise<void> {
        const input = await this.getMatInput(loader);
        await input.setValue(value);
    }

    static async fillMatInputByCSS(loader: HarnessLoader, selector: string, value: string): Promise<void> {
        const input = await this.getMatInputByCSS(loader, selector);
        await input.setValue(value);
    }

    static async fillMatInputByDataAutomationId(loader: HarnessLoader, dataAutomationId: string, value: string): Promise<void> {
        const input = await this.getMatInputByDataAutomationId(loader, dataAutomationId);
        await input.setValue(value);
        await (await input.host()).dispatchEvent('input');
    }

    static async focusMatInput(loader: HarnessLoader): Promise<void> {
        const input = await this.getMatInput(loader);
        await input.focus();
    }

    static async blurMatInput(loader: HarnessLoader): Promise<void> {
        const input = await this.getMatInput(loader);
        await input.blur();
    }

    static async getMatInputValue(loader: HarnessLoader): Promise<string> {
        const input = await this.getMatInput(loader);
        return input.getValue();
    }

    static async getMatInputValueByDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<string> {
        const input = await this.getMatInputByDataAutomationId(loader, dataAutomationId);
        return input.getValue();
    }

    static async sendKeysToMatInput(loader: HarnessLoader, keys: string[] | TestKey[]): Promise<void> {
        const input = await this.getMatInput(loader);
        const host = await input.host();
        await host.sendKeys(...keys);
    }

    /** MatAutoComplete related methods */

    static async typeAndGetOptionsForMatAutoComplete(
        loader: HarnessLoader,
        fixture: ComponentFixture<any>,
        value: string
    ): Promise<MatOptionHarness[]> {
        const autocomplete = await loader.getHarness(MatAutocompleteHarness);
        await autocomplete.enterText(value);
        fixture.detectChanges();

        return autocomplete.getOptions();
    }

    /** MatError related methods */

    static async getMatErrorByCSS(loader: HarnessLoader, selector: string): Promise<MatErrorHarness> {
        return loader.getHarness(MatErrorHarness.with({ selector }));
    }

    static async getMatErrorByDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<MatErrorHarness> {
        return loader.getHarness(MatErrorHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }
}
