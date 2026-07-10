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
import { MatChipGridHarness, MatChipHarness, MatChipInputHarness, MatChipListboxHarness } from '@angular/material/chips/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { ComponentFixture } from '@angular/core/testing';
import { MatTabGroupHarness, MatTabHarness } from '@angular/material/tabs/testing';
import { MatToolbarHarness } from '@angular/material/toolbar/testing';
import { MatSnackBarHarness } from '@angular/material/snack-bar/testing';
import { MatProgressBarHarness } from '@angular/material/progress-bar/testing';
import { MatListOptionHarness } from '@angular/material/list/testing';
import { MatCellHarness } from '@angular/material/table/testing';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatSidenavHarness } from '@angular/material/sidenav/testing';

class HarnessBase {
    constructor(readonly loader: HarnessLoader) {}
}

class ButtonUtils extends HarnessBase {
    async get(): Promise<MatButtonHarness> {
        return this.loader.getHarness(MatButtonHarness);
    }

    async getByCSS(selector: string): Promise<MatButtonHarness> {
        return this.loader.getHarness(MatButtonHarness.with({ selector }));
    }

    async getByDataAutomationId(dataAutomationId: string): Promise<MatButtonHarness> {
        return this.loader.getHarness(MatButtonHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async exists(): Promise<boolean> {
        return this.loader.hasHarness(MatButtonHarness);
    }

    async existsByDataAutomationId(dataAutomationId: string): Promise<boolean> {
        return this.loader.hasHarness(MatButtonHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async click(): Promise<void> {
        const button = await this.get();
        await button.click();
    }

    async clickByCSS(selector: string): Promise<void> {
        const button = await this.getByCSS(selector);
        await button.click();
    }

    async clickByDataAutomationId(dataAutomationId: string): Promise<void> {
        const button = await this.getByDataAutomationId(dataAutomationId);
        await button.click();
    }

    async sendKeys(keys: (string | TestKey)[]): Promise<void> {
        const button = await this.get();
        const host = await button.host();
        await host.sendKeys(...keys);
    }
}

class CheckboxUtils extends HarnessBase {
    async get(): Promise<MatCheckboxHarness> {
        return this.loader.getHarness(MatCheckboxHarness);
    }

    async getByDataAutomationId(dataAutomationId: string): Promise<MatCheckboxHarness> {
        return this.loader.getHarness(MatCheckboxHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async getHost(): Promise<TestElement> {
        const checkbox = await this.get();
        return checkbox.host();
    }

    async getAll(): Promise<MatCheckboxHarness[]> {
        return this.loader.getAllHarnesses(MatCheckboxHarness);
    }

    async isChecked(): Promise<boolean> {
        const checkbox = await this.get();
        return checkbox.isChecked();
    }

    async allHaveClass(className: string): Promise<boolean> {
        const checkboxes = await this.getAll();
        return checkboxes.every(async (checkbox) => (await checkbox.host()).hasClass(className));
    }

    async hover(): Promise<void> {
        const host = await this.getHost();
        await host.hover();
    }
}

class IconUtils extends HarnessBase {
    async getOrNull(): Promise<MatIconHarness> {
        return this.loader.getHarnessOrNull(MatIconHarness);
    }

    async getWithAncestorByDataAutomationId(dataAutomationId: string): Promise<MatIconHarness> {
        return this.loader.getHarness(MatIconHarness.with({ ancestor: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async getWithAncestorByCSS(selector: string): Promise<MatIconHarness> {
        return this.loader.getHarness(MatIconHarness.with({ ancestor: selector }));
    }

    async existsWithAncestorByDataAutomationId(dataAutomationId: string): Promise<boolean> {
        return this.loader.hasHarness(MatIconHarness.with({ ancestor: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async existsWithAncestorByCSSAndName(selector: string, name: string): Promise<boolean> {
        return this.loader.hasHarness(MatIconHarness.with({ ancestor: selector, name }));
    }

    async clickWithAncestorByDataAutomationId(dataAutomationId: string): Promise<void> {
        const icon = await this.getWithAncestorByDataAutomationId(dataAutomationId);
        const host = await icon.host();
        await host.click();
    }
}

class SelectUtils extends HarnessBase {
    async get(): Promise<MatSelectHarness> {
        return this.loader.getHarness(MatSelectHarness);
    }

    async getByDataAutomationId(dataAutomationId: string): Promise<MatSelectHarness> {
        return this.loader.getHarness(MatSelectHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async getHost(): Promise<TestElement> {
        const select = await this.get();
        return select.host();
    }

    async getOptions(isOpened = false): Promise<MatOptionHarness[]> {
        const select = await this.get();
        if (!isOpened) {
            await select.open();
        }
        return select.getOptions();
    }

    async exists(): Promise<boolean> {
        return this.loader.hasHarness(MatSelectHarness);
    }

    async open(): Promise<void> {
        const select = await this.get();
        await select.open();
    }
}

class ChipUtils extends HarnessBase {
    async getByDataAutomationId(dataAutomationId: string): Promise<MatChipHarness> {
        return this.loader.getHarness(MatChipHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async existsByDataAutomationId(dataAutomationId: string): Promise<boolean> {
        return this.loader.hasHarness(MatChipHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async click(dataAutomationId: string): Promise<void> {
        const chip = await this.getByDataAutomationId(dataAutomationId);
        const host = await chip.host();
        await host.click();
    }

    async getAll(): Promise<MatChipHarness[]> {
        return this.loader.getAllHarnesses(MatChipHarness);
    }
}

class ChipListboxUtils extends HarnessBase {
    async getByDataAutomationId(dataAutomationId: string): Promise<MatChipListboxHarness> {
        return this.loader.getHarness(MatChipListboxHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async click(dataAutomationId: string): Promise<void> {
        const chipList = await this.getByDataAutomationId(dataAutomationId);
        const host = await chipList.host();
        await host.click();
    }
}

class ChipGridUtils extends HarnessBase {
    async exists(): Promise<boolean> {
        return this.loader.hasHarness(MatChipGridHarness);
    }
}

class ChipInputUtils extends HarnessBase {
    async get(): Promise<MatChipInputHarness> {
        return this.loader.getHarness(MatChipInputHarness);
    }

    async getByDataAutomationId(dataAutomationId: string): Promise<MatChipInputHarness> {
        return this.loader.getHarness(MatChipInputHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async getByCSS(selector: string): Promise<MatChipInputHarness> {
        return this.loader.getHarness(MatChipInputHarness.with({ selector }));
    }
}

class FormFieldUtils extends HarnessBase {
    async get(): Promise<MatFormFieldHarness> {
        return this.loader.getHarness(MatFormFieldHarness);
    }

    async getByCSS(selector: string): Promise<MatFormFieldHarness> {
        return this.loader.getHarness(MatFormFieldHarness.with({ selector }));
    }
}

class InputUtils extends HarnessBase {
    async get(): Promise<MatInputHarness> {
        return this.loader.getHarness(MatInputHarness);
    }

    async getByDataAutomationId(dataAutomationId: string): Promise<MatInputHarness> {
        return this.loader.getHarness(MatInputHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    async getByPlaceholder(placeholder: string): Promise<MatInputHarness> {
        return this.loader.getHarness(MatInputHarness.with({ placeholder }));
    }

    async getHost(): Promise<TestElement> {
        const input = await this.get();
        return input.host();
    }

    async exists(): Promise<boolean> {
        return this.loader.hasHarness(MatInputHarness);
    }

    async existsByPlaceholder(placeholder: string): Promise<boolean> {
        return this.loader.hasHarness(MatInputHarness.with({ placeholder }));
    }

    async click(): Promise<void> {
        const input = await this.get();
        const host = await input.host();
        await host.click();
    }

    async fill(value: string): Promise<void> {
        const input = await this.get();
        await input.setValue(value);
    }

    async fillByDataAutomationId(dataAutomationId: string, value: string): Promise<void> {
        const input = await this.getByDataAutomationId(dataAutomationId);
        await input.setValue(value);
        await (await input.host()).dispatchEvent('input');
    }

    async focus(): Promise<void> {
        const input = await this.get();
        await input.focus();
    }

    async blur(): Promise<void> {
        const input = await this.get();
        await input.blur();
    }

    async getValue(): Promise<string> {
        const input = await this.get();
        return input.getValue();
    }

    async getValueByDataAutomationId(dataAutomationId: string): Promise<string> {
        const input = await this.getByDataAutomationId(dataAutomationId);
        return input.getValue();
    }

    async sendKeys(keys: (string | TestKey)[]): Promise<void> {
        const input = await this.get();
        const host = await input.host();
        await host.sendKeys(...keys);
    }
}

class AutocompleteUtils extends HarnessBase {
    async typeAndGetOptions(fixture: ComponentFixture<any>, value: string): Promise<MatOptionHarness[]> {
        const autocomplete = await this.loader.getHarness(MatAutocompleteHarness);
        await autocomplete.enterText(value);
        fixture.detectChanges();
        return autocomplete.getOptions();
    }
}

class TabGroupUtils extends HarnessBase {
    async getSelectedTab(): Promise<MatTabHarness> {
        const tabs = await this.loader.getHarness(MatTabGroupHarness);
        return tabs.getSelectedTab();
    }

    async getSelectedTabLabel(): Promise<string> {
        const tab = await this.getSelectedTab();
        return tab.getLabel();
    }
}

class ToolbarUtils extends HarnessBase {
    async getHost(): Promise<TestElement> {
        const toolbar = await this.loader.getHarness(MatToolbarHarness);
        return toolbar.host();
    }
}

class SnackbarUtils extends HarnessBase {
    async exists(): Promise<boolean> {
        return this.loader.hasHarness(MatSnackBarHarness);
    }
}

class ProgressBarUtils extends HarnessBase {
    async getHost(): Promise<TestElement> {
        const progress = await this.loader.getHarness(MatProgressBarHarness);
        return progress.host();
    }
}

class ListOptionUtils extends HarnessBase {
    async get(): Promise<MatListOptionHarness> {
        return this.loader.getHarness(MatListOptionHarness);
    }

    async getAll(): Promise<MatListOptionHarness[]> {
        return this.loader.getAllHarnesses(MatListOptionHarness);
    }
}

class CellUtils extends HarnessBase {
    async getByColumnName(columnName: string): Promise<MatCellHarness> {
        return this.loader.getHarness(MatCellHarness.with({ columnName }));
    }
}

class ProgressSpinnerUtils extends HarnessBase {
    async getWithAncestorByCSS(selector: string): Promise<MatProgressSpinnerHarness> {
        return this.loader.getHarness(MatProgressSpinnerHarness.with({ ancestor: selector }));
    }

    async getWithAncestorByDataAutomationId(dataAutomationId: string): Promise<MatProgressSpinnerHarness> {
        return this.loader.getHarness(MatProgressSpinnerHarness.with({ ancestor: `[data-automation-id="${dataAutomationId}"]` }));
    }
}

class MenuUtils extends HarnessBase {
    async get(): Promise<MatMenuHarness> {
        return this.loader.getHarness(MatMenuHarness);
    }

    async getByCSS(selector: string): Promise<MatMenuHarness> {
        return this.loader.getHarness(MatMenuHarness.with({ selector }));
    }
}

class SidenavUtils extends HarnessBase {
    async get(): Promise<MatSidenavHarness> {
        return this.loader.getHarness(MatSidenavHarness);
    }
}

export class UnitTestingUtils {
    readonly button: ButtonUtils;
    readonly checkbox: CheckboxUtils;
    readonly icon: IconUtils;
    readonly select: SelectUtils;
    readonly chip: ChipUtils;
    readonly chipListbox: ChipListboxUtils;
    readonly chipGrid: ChipGridUtils;
    readonly chipInput: ChipInputUtils;
    readonly formField: FormFieldUtils;
    readonly input: InputUtils;
    readonly autocomplete: AutocompleteUtils;
    readonly tabGroup: TabGroupUtils;
    readonly toolbar: ToolbarUtils;
    readonly snackbar: SnackbarUtils;
    readonly progressBar: ProgressBarUtils;
    readonly listOption: ListOptionUtils;
    readonly cell: CellUtils;
    readonly progressSpinner: ProgressSpinnerUtils;
    readonly menu: MenuUtils;
    readonly sidenav: SidenavUtils;

    private _debugElement?: DebugElement;

    constructor(debugElement?: DebugElement, loader?: HarnessLoader) {
        this._debugElement = debugElement;
        this.button = new ButtonUtils(loader);
        this.checkbox = new CheckboxUtils(loader);
        this.icon = new IconUtils(loader);
        this.select = new SelectUtils(loader);
        this.chip = new ChipUtils(loader);
        this.chipListbox = new ChipListboxUtils(loader);
        this.chipGrid = new ChipGridUtils(loader);
        this.chipInput = new ChipInputUtils(loader);
        this.formField = new FormFieldUtils(loader);
        this.input = new InputUtils(loader);
        this.autocomplete = new AutocompleteUtils(loader);
        this.tabGroup = new TabGroupUtils(loader);
        this.toolbar = new ToolbarUtils(loader);
        this.snackbar = new SnackbarUtils(loader);
        this.progressBar = new ProgressBarUtils(loader);
        this.listOption = new ListOptionUtils(loader);
        this.cell = new CellUtils(loader);
        this.progressSpinner = new ProgressSpinnerUtils(loader);
        this.menu = new MenuUtils(loader);
        this.sidenav = new SidenavUtils(loader);
    }

    setDebugElement(debugElement: DebugElement): void {
        this._debugElement = debugElement;
    }

    getByCSS(selector: string): DebugElement {
        return this._debugElement.query(By.css(selector));
    }

    getAllByCSS(selector: string): DebugElement[] {
        return this._debugElement.queryAll(By.css(selector));
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

    getAllByDataAutomationId(dataAutomationId: string): DebugElement[] {
        return this._debugElement.queryAll(By.css(`[data-automation-id="${dataAutomationId}"]`));
    }

    getInnerTextByDataAutomationId(dataAutomationId: string): string {
        return this.getByDataAutomationId(dataAutomationId).nativeElement.innerText;
    }

    getByDirective(directive: Type<any>): DebugElement {
        return this._debugElement.query(By.directive(directive));
    }

    getAllByDirective(directive: Type<any>): DebugElement[] {
        return this._debugElement.queryAll(By.directive(directive));
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

    doubleClickByCSS(selector: string): void {
        const element = this.getByCSS(selector);
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
}
