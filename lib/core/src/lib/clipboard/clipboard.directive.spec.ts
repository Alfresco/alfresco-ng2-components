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

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ClipboardService } from './clipboard.service';
import { ClipboardDirective } from './clipboard.directive';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UnitTestingUtils } from '../testing/unit-testing-utils';
import { HarnessLoader, TestKey } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

@Component({
    selector: 'adf-test-component',
    template: `
        <button mat-button clipboard-notification="copy success" [adf-clipboard] [target]="ref">copy</button>

        <input #ref />
    `,
    standalone: false
})
class TestTargetClipboardComponent {}

describe('ClipboardDirective', () => {
    let fixture: ComponentFixture<TestTargetClipboardComponent>;
    let clipboardService: ClipboardService;
    let loader: HarnessLoader;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule, ClipboardDirective],
            declarations: [TestTargetClipboardComponent]
        });
        fixture = TestBed.createComponent(TestTargetClipboardComponent);
        clipboardService = TestBed.inject(ClipboardService);
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
        fixture.detectChanges();
    });

    it('should notify copy target value on button click event', async () => {
        spyOn(clipboardService, 'copyToClipboard');
        testingUtils.fillInputByCSS('input', 'some value');
        await testingUtils.clickMatButton();

        expect(clipboardService.copyToClipboard).toHaveBeenCalled();
    });

    it('should notify copy target value on keydown event', async () => {
        spyOn(clipboardService, 'copyToClipboard');
        testingUtils.fillInputByCSS('input', 'some value');
        await testingUtils.sendKeysToMatButton([TestKey.ENTER]);

        expect(clipboardService.copyToClipboard).toHaveBeenCalled();
    });
});

describe('CopyClipboardDirective', () => {
    @Component({
        selector: 'adf-copy-conent-test-component',
        template: `<span adf-clipboard="placeholder">{{ mockText }}</span>`,
        standalone: false
    })
    class TestCopyClipboardComponent {
        mockText = 'text to copy';
        placeholder = 'copy text';

        @ViewChild(ClipboardDirective)
        clipboardDirective: ClipboardDirective;
    }

    let fixture: ComponentFixture<TestCopyClipboardComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule, ClipboardDirective],
            declarations: [TestCopyClipboardComponent]
        });
        fixture = TestBed.createComponent(TestCopyClipboardComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        fixture.detectChanges();
    });

    it('should show tooltip when hover element', () => {
        testingUtils.hoverOverByCSS('span');
        fixture.detectChanges();
        expect(testingUtils.getByCSS('.adf-copy-tooltip')).not.toBeNull();
    });

    it('should not show tooltip when element it is not hovered', () => {
        testingUtils.hoverOverByCSS('span');
        fixture.detectChanges();
        expect(testingUtils.getByCSS('.adf-copy-tooltip')).not.toBeNull();

        testingUtils.mouseLeaveByCSS('span');
        fixture.detectChanges();
        expect(testingUtils.getByCSS('.adf-copy-tooltip')).toBeNull();
    });

    it('should copy the content of element when click it', fakeAsync(() => {
        spyOn(navigator.clipboard, 'writeText');
        testingUtils.clickByCSS('span');
        tick();
        fixture.detectChanges();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('text to copy');
    }));

    it('should copy the content of element on keydown event', fakeAsync(() => {
        spyOn(navigator.clipboard, 'writeText');
        testingUtils.keyBoardEventByCSS('span', 'keydown', 'Enter', 'Enter');
        tick();
        fixture.detectChanges();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('text to copy');
    }));

    it('should not copy the content of element when click it', fakeAsync(() => {
        spyOn(navigator.clipboard, 'writeText');
        testingUtils.mouseLeaveByCSS('span');
        tick();
        fixture.detectChanges();
        expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    }));
});
