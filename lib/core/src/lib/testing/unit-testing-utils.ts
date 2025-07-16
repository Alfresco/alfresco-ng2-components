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

import { HarnessLoader, TestElement, TestKey } from '@angular/cdk/testing';
import { DebugElement, Type } from '@angular/core';
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
import { MatTabGroupHarness, MatTabHarness } from '@angular/material/tabs/testing';
import { MatToolbarHarness } from '@angular/material/toolbar/testing';
import { MatSnackBarHarness } from '@angular/material/snack-bar/testing';
import { MatProgressBarHarness } from '@angular/material/progress-bar/testing';

export class UnitTestingUtils {
    constructor(private debugElement?: DebugElement, private loader?: HarnessLoader) {
        this.debugElement = debugElement;
        this.loader = loader;
    }

    setDebugElement(debugElement: DebugElement): void {
        this.debugElement = debugElement;
    }

    setLoader(loader: HarnessLoader): void {
        this.loader = loader;
    }

    getByCSS(selector: string): DebugElement {
        return this.debugElement.query(By.css(selector));
    }

    getAllByCSS(selector: string): DebugElement[] {
        return this.debugElement.queryAll(By.css(selector));
    }

    getInnerTextByCSS(selector: string): string {
        return this.getByCSS(selector).nativeElement.innerText;
    }

    getByDataAutomationId(dataAutomationId: string): DebugElement {
        return this.getByCSS(`[data-automation-id="${dataAutomationId}"]`);
    }

    getByDataAutomationClass(dataAutomationClass: string): DebugElement {
        return this.getByCSS(`[data-automation-class="${dataAutomationClass}"]`);
    }

    getInnerTextByDataAutomationId(dataAutomationId: string): string {
        return this.getByDataAutomationId(dataAutomationId).nativeElement.innerText;
    }

    getByDirective(directive: Type<any>): DebugElement {
        return this.debugElement.query(By.directive(directive));
    }

    getAllByDirective(directive: Type<any>): DebugElement[] {
        return this.debugElement.queryAll(By.directive(directive));
    }

    /** Perform actions */

    clickByCSS(selector: string): void {
        const element = this.getByCSS(selector);
        element.triggerEventHandler('click', new MouseEvent('click'));
    }

    clickByDataAutomationId(dataAutomationId: string): void {
        this.getByDataAutomationId(dataAutomationId).nativeElement.click();
    }

    doubleClickByDataAutomationId(dataAutomationId: string): void {
        const element = this.getByDataAutomationId(dataAutomationId);
        element.triggerEventHandler('dblclick', new MouseEvent('dblclick'));
    }

    blurByCSS(selector: string): void {
        const element = this.getByCSS(selector);
        element.triggerEventHandler('blur', new FocusEvent('blur'));
    }

    hoverOverByCSS(selector: string): void {
        const element = this.getByCSS(selector);
        element.triggerEventHandler('mouseenter', new MouseEvent('mouseenter'));
    }

    hoverOverByDataAutomationId(dataAutomationId: string): void {
        const element = this.getByDataAutomationId(dataAutomationId);
        element.triggerEventHandler('mouseenter', new MouseEvent('mouseenter'));
    }

    mouseLeaveByCSS(selector: string): void {
        const element = this.getByCSS(selector);
        element.triggerEventHandler('mouseleave', new MouseEvent('mouseleave'));
    }

    mouseLeaveByDataAutomationId(dataAutomationId: string): void {
        const element = this.getByDataAutomationId(dataAutomationId);
        element.triggerEventHandler('mouseleave', new MouseEvent('mouseleave'));
    }

    keyBoardEventByCSS(selector: string, event: 'keyup' | 'keydown', code: string, key: string): void {
        const element = this.getByCSS(selector);
        element.nativeElement.dispatchEvent(new KeyboardEvent(event, { code, key }));
    }

    dispatchCustomEventByCSS(selector: string, eventName: string): void {
        const element = this.getByCSS(selector);
        element.nativeElement.dispatchEvent(new CustomEvent(eventName));
    }

    /** Input related methods */

    getInputByCSS(selector: string): HTMLInputElement {
        return this.getByCSS(selector)?.nativeElement;
    }

    getInputByDataAutomationId(dataAutomationId: string): HTMLInputElement {
        return this.getByDataAutomationId(dataAutomationId)?.nativeElement;
    }

    fillInputByCSS(selector: string, value: string): void {
        const input = this.getInputByCSS(selector);
        input.value = value;
        input.dispatchEvent(new Event('input'));
    }

    fillInputByDataAutomationId(dataAutomationId: string, value: any): void {
        const input = this.getInputByDataAutomationId(dataAutomationId);
        input.value = value;
        input.dispatchEvent(new Event('input'));
    }

    /** MatButton related methods */

    async getMatButton(): Promise<MatButtonHarness> {
        return this.loader.getHarness(MatButtonHarness);
    }

    async getMatButtonByCSS(selector: string): Promise<MatButtonHarness> {
        return this.loader.getHarness(MatButtonHarness.with({ selector }));
    }

    async getMatButtonByDataAutomationId(dataAutomationId: string): Promise<MatButtonHarness> {
        return this.loader.getHarness(MatButtonHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async checkIfMatButtonExists(): Promise<boolean> {
        return this.loader.hasHarness(MatButtonHarness);
    }

    async checkIfMatButtonExistsWithDataAutomationId(dataAutomationId: string): Promise<boolean> {
        return this.loader.hasHarness(MatButtonHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async clickMatButton(): Promise<void> {
        const button = await this.getMatButton();
        await button.click();
    }

    async clickMatButtonByCSS(selector: string): Promise<void> {
        const button = await this.getMatButtonByCSS(selector);
        await button.click();
    }

    async clickMatButtonByDataAutomationId(dataAutomationId: string): Promise<void> {
        const button = await this.getMatButtonByDataAutomationId(dataAutomationId);
        await button.click();
    }

    async sendKeysToMatButton(keys: (string | TestKey)[]): Promise<void> {
        const button = await this.getMatButton();
        const host = await button.host();
        await host.sendKeys(...keys);
    }

    /** MatCheckbox related methods */

    async getMatCheckbox(): Promise<MatCheckboxHarness> {
        return this.loader.getHarness(MatCheckboxHarness);
    }

    async getMatCheckboxByDataAutomationId(dataAutomationId: string): Promise<MatCheckboxHarness> {
        return this.loader.getHarness(MatCheckboxHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async getMatCheckboxHost(): Promise<TestElement> {
        const checkbox = await this.getMatCheckbox();
        return checkbox.host();
    }

    async getAllMatCheckboxes(): Promise<MatCheckboxHarness[]> {
        return this.loader.getAllHarnesses(MatCheckboxHarness);
    }

    async checkIfMatCheckboxIsChecked(): Promise<boolean> {
        const checkbox = await this.getMatCheckbox();
        return checkbox.isChecked();
    }

    async checkIfMatCheckboxesHaveClass(className: string): Promise<boolean> {
        const checkboxes = await this.getAllMatCheckboxes();
        return checkboxes.every(async (checkbox) => (await checkbox.host()).hasClass(className));
    }

    async hoverOverMatCheckbox(): Promise<void> {
        const host = await this.getMatCheckboxHost();
        await host.hover();
    }

    /** MatIcon related methods */

    async getMatIconOrNull(): Promise<MatIconHarness> {
        return this.loader.getHarnessOrNull(MatIconHarness);
    }

    async getMatIconWithAncestorByDataAutomationId(dataAutomationId: string): Promise<MatIconHarness> {
        return this.loader.getHarness(MatIconHarness.with({ ancestor: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async getMatIconWithAncestorByCSS(selector: string): Promise<MatIconHarness> {
        return this.loader.getHarness(MatIconHarness.with({ ancestor: selector }));
    }

    async getMatIconWithAncestorByCSSAndName(selector: string, name: string): Promise<MatIconHarness> {
        return this.loader.getHarness(MatIconHarness.with({ ancestor: selector, name }));
    }

    async checkIfMatIconExistsWithAncestorByDataAutomationId(dataAutomationId: string): Promise<boolean> {
        return this.loader.hasHarness(MatIconHarness.with({ ancestor: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async checkIfMatIconExistsWithAncestorByCSSAndName(selector: string, name: string): Promise<boolean> {
        return this.loader.hasHarness(MatIconHarness.with({ ancestor: selector, name }));
    }

    async clickMatIconWithAncestorByDataAutomationId(dataAutomationId: string): Promise<void> {
        const icon = await this.getMatIconWithAncestorByDataAutomationId(dataAutomationId);
        const host = await icon.host();
        await host.click();
    }

    /** MatSelect related methods */

    async getMatSelectOptions(isOpened = false): Promise<MatOptionHarness[]> {
        const select = await this.loader.getHarness(MatSelectHarness);
        if (!isOpened) {
            await select.open();
        }
        return select.getOptions();
    }

    async getMatSelectHost(): Promise<TestElement> {
        const select = await this.loader.getHarness(MatSelectHarness);
        return select.host();
    }

    async checkIfMatSelectExists(): Promise<boolean> {
        return this.loader.hasHarness(MatSelectHarness);
    }

    async openMatSelect(): Promise<void> {
        const select = await this.loader.getHarness(MatSelectHarness);
        await select.open();
    }

    /** MatChips related methods */

    async getMatChipByDataAutomationId(dataAutomationId: string): Promise<MatChipHarness> {
        return this.loader.getHarness(MatChipHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async checkIfMatChipExistsWithDataAutomationId(dataAutomationId: string): Promise<boolean> {
        return this.loader.hasHarness(MatChipHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async clickMatChip(dataAutomationId: string): Promise<void> {
        const chip = await this.getMatChipByDataAutomationId(dataAutomationId);
        const host = await chip.host();
        await host.click();
    }

    async getMatChips(): Promise<MatChipHarness[]> {
        return this.loader.getAllHarnesses(MatChipHarness);
    }

    /** MatChipListbox related methods */

    async getMatChipListboxByDataAutomationId(dataAutomationId: string): Promise<MatChipListboxHarness> {
        return this.loader.getHarness(MatChipListboxHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async clickMatChipListbox(dataAutomationId: string): Promise<void> {
        const chipList = await this.getMatChipListboxByDataAutomationId(dataAutomationId);
        const host = await chipList.host();
        await host.click();
    }

    /** MatChipGrid related methods */

    async checkIfMatChipGridExists(): Promise<boolean> {
        return this.loader.hasHarness(MatChipGridHarness);
    }

    /** MatFromField related methods */

    async getMatFormField(): Promise<MatFormFieldHarness> {
        return this.loader.getHarness(MatFormFieldHarness);
    }

    async getMatFormFieldByCSS(selector: string): Promise<MatFormFieldHarness> {
        return this.loader.getHarness(MatFormFieldHarness.with({ selector }));
    }

    /** MatInput related methods */

    async getMatInput(): Promise<MatInputHarness> {
        return this.loader.getHarness(MatInputHarness);
    }

    async getMatInputByCSS(selector: string): Promise<MatInputHarness> {
        return this.loader.getHarness(MatInputHarness.with({ selector }));
    }

    async getMatInputByDataAutomationId(dataAutomationId: string): Promise<MatInputHarness> {
        return this.loader.getHarness(MatInputHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async getMatInputByPlaceholder(placeholder: string): Promise<MatInputHarness> {
        return this.loader.getHarness(MatInputHarness.with({ placeholder }));
    }

    async getMatInputHost(): Promise<TestElement> {
        const input = await this.getMatInput();
        return input.host();
    }

    async checkIfMatInputExists(): Promise<boolean> {
        return this.loader.hasHarness(MatInputHarness);
    }

    async checkIfMatInputExistsWithCSS(selector: string): Promise<boolean> {
        return this.loader.hasHarness(MatInputHarness.with({ selector }));
    }

    async checkIfMatInputExistsWithDataAutomationId(dataAutomationId: string): Promise<boolean> {
        return this.loader.hasHarness(MatInputHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async checkIfMatInputExistsWithPlaceholder(placeholder: string): Promise<boolean> {
        return this.loader.hasHarness(MatInputHarness.with({ placeholder }));
    }

    async clickMatInput(): Promise<void> {
        const input = await this.getMatInput();
        const host = await input.host();
        await host.click();
    }

    async fillMatInput(value: string): Promise<void> {
        const input = await this.getMatInput();
        await input.setValue(value);
    }

    async fillMatInputByCSS(selector: string, value: string): Promise<void> {
        const input = await this.getMatInputByCSS(selector);
        await input.setValue(value);
    }

    async fillMatInputByDataAutomationId(dataAutomationId: string, value: string): Promise<void> {
        const input = await this.getMatInputByDataAutomationId(dataAutomationId);
        await input.setValue(value);
        await (await input.host()).dispatchEvent('input');
    }

    async focusMatInput(): Promise<void> {
        const input = await this.getMatInput();
        await input.focus();
    }

    async blurMatInput(): Promise<void> {
        const input = await this.getMatInput();
        await input.blur();
    }

    async getMatInputValue(): Promise<string> {
        const input = await this.getMatInput();
        return input.getValue();
    }

    async getMatInputValueByDataAutomationId(dataAutomationId: string): Promise<string> {
        const input = await this.getMatInputByDataAutomationId(dataAutomationId);
        return input.getValue();
    }

    async sendKeysToMatInput(keys: (string | TestKey)[]): Promise<void> {
        const input = await this.getMatInput();
        const host = await input.host();
        await host.sendKeys(...keys);
    }

    /** MatAutoComplete related methods */

    async typeAndGetOptionsForMatAutoComplete(fixture: ComponentFixture<any>, value: string): Promise<MatOptionHarness[]> {
        const autocomplete = await this.loader.getHarness(MatAutocompleteHarness);
        await autocomplete.enterText(value);
        fixture.detectChanges();

        return autocomplete.getOptions();
    }

    /** MatError related methods */

    async getMatErrorByCSS(selector: string): Promise<MatErrorHarness> {
        return this.loader.getHarness(MatErrorHarness.with({ selector }));
    }

    async getMatErrorByDataAutomationId(dataAutomationId: string): Promise<MatErrorHarness> {
        return this.loader.getHarness(MatErrorHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    /** MatTabGroup related methods */

    async getSelectedTabFromMatTabGroup(): Promise<MatTabHarness> {
        const tabs = await this.loader.getHarness(MatTabGroupHarness);
        return tabs.getSelectedTab();
    }

    async getSelectedTabLabelFromMatTabGroup(): Promise<string> {
        const tab = await this.getSelectedTabFromMatTabGroup();
        return tab.getLabel();
    }

    /** MatToolbar related methods */

    async getMatToolbarHost(): Promise<TestElement> {
        const toolbar = await this.loader.getHarness(MatToolbarHarness);
        return toolbar.host();
    }

    /** MatSnackbar related methods */

    async checkIfMatSnackbarExists(): Promise<boolean> {
        return this.loader.hasHarness(MatSnackBarHarness);
    }

    /** MatProgressBar related methods */

    async getMatProgressBarHost(): Promise<TestElement> {
        const progress = await this.loader.getHarness(MatProgressBarHarness);
        return progress.host();
    }
}
