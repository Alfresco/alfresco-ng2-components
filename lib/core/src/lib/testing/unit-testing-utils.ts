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

import { HarnessLoader } from '@angular/cdk/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatOptionHarness } from '@angular/material/core/testing';
import { MatChipHarness, MatChipListboxHarness } from '@angular/material/chips/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';

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

    static getInnerTextByDataAutomationId(debugElement: DebugElement, dataAutomationId: string): string {
        return UnitTestingUtils.getByDataAutomationId(debugElement, dataAutomationId).nativeElement.innerText;
    }

    static getByDirective(debugElement: DebugElement, directive: any): DebugElement {
        return debugElement.query(By.directive(directive));
    }

    /** Perform actions */

    static performClickWithCSS(debugElement: DebugElement, selector: string): void {
        const element = UnitTestingUtils.getByCSS(debugElement, selector);
        element.triggerEventHandler('click', new MouseEvent('click'));
    }

    static performClickWithDataAutomationId(debugElement: DebugElement, dataAutomationId: string): void {
        UnitTestingUtils.getByDataAutomationId(debugElement, dataAutomationId).nativeElement.click();
    }

    static performDoubleClickWithDataAutomationId(debugElement: DebugElement, dataAutomationId: string): void {
        const element = UnitTestingUtils.getByDataAutomationId(debugElement, dataAutomationId);
        element.triggerEventHandler('dblclick', new MouseEvent('dblclick'));
    }

    /** MatButton related methods */

    static async getMatButtonByCSS(loader: HarnessLoader, selector: string): Promise<MatButtonHarness> {
        return loader.getHarness(MatButtonHarness.with({ selector }));
    }

    static async getMatButtonByDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<MatButtonHarness> {
        return loader.getHarness(MatButtonHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    static async checkIfMatButtonExistsWithDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<boolean> {
        return loader.hasHarness(MatButtonHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    static async clickMatButtonByCSS(loader: HarnessLoader, selector: string): Promise<void> {
        const button = await this.getMatButtonByCSS(loader, selector);
        await button.click();
    }

    static async clickMatButtonByDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<void> {
        const button = await this.getMatButtonByDataAutomationId(loader, dataAutomationId);
        await button.click();
    }

    /** MatCheckbox related methods */

    static async getMatCheckboxByDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<MatCheckboxHarness> {
        return loader.getHarness(MatCheckboxHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    }

    /** MatIcon related methods */

    static async getMatIconWithAncestorByDataAutomationId(loader: HarnessLoader, dataAutomationId: string): Promise<MatIconHarness> {
        return loader.getHarness(MatIconHarness.with({ ancestor: `[data-automation-id="${dataAutomationId}"]` }));
    }

    /** MatSelect related methods */

    static async getMatSelectOptions(loader: HarnessLoader): Promise<MatOptionHarness[]> {
        const select = await loader.getHarness(MatSelectHarness);
        await select.open();
        return select.getOptions();
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
}
