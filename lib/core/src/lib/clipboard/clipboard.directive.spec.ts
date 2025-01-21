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

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ClipboardService } from './clipboard.service';
import { ClipboardDirective } from './clipboard.directive';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopTranslateModule } from '../testing/noop-translate.module';
import { UnitTestingUtils } from '../testing/unit-testing-utils';
import { HarnessLoader, TestKey } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

@Component({
    selector: 'adf-test-component',
    template: `
        <button mat-button clipboard-notification="copy success" [adf-clipboard] [target]="ref">copy</button>

        <input #ref />
    `
})
class TestTargetClipboardComponent {}

describe('ClipboardDirective', () => {
    let fixture: ComponentFixture<TestTargetClipboardComponent>;
    let clipboardService: ClipboardService;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, MatSnackBarModule, ClipboardDirective],
            declarations: [TestTargetClipboardComponent]
        });
        fixture = TestBed.createComponent(TestTargetClipboardComponent);
        clipboardService = TestBed.inject(ClipboardService);
        loader = TestbedHarnessEnvironment.loader(fixture);
        fixture.detectChanges();
    });

    it('should notify copy target value on button click event', async () => {
        spyOn(clipboardService, 'copyToClipboard');
        UnitTestingUtils.fillInputByCSS(fixture.debugElement, 'input', 'some value');
        await UnitTestingUtils.clickMatButton(loader);

        expect(clipboardService.copyToClipboard).toHaveBeenCalled();
    });

    it('should notify copy target value on keydown event', async () => {
        spyOn(clipboardService, 'copyToClipboard');
        UnitTestingUtils.fillInputByCSS(fixture.debugElement, 'input', 'some value');
        await UnitTestingUtils.sendKeysToMatButton(loader, [TestKey.ENTER]);

        expect(clipboardService.copyToClipboard).toHaveBeenCalled();
    });
});

describe('CopyClipboardDirective', () => {
    @Component({
        selector: 'adf-copy-conent-test-component',
        template: `<span adf-clipboard="placeholder">{{ mockText }}</span>`
    })
    class TestCopyClipboardComponent {
        mockText = 'text to copy';
        placeholder = 'copy text';

        @ViewChild(ClipboardDirective)
        clipboardDirective: ClipboardDirective;
    }

    let fixture: ComponentFixture<TestCopyClipboardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, MatSnackBarModule, ClipboardDirective],
            declarations: [TestCopyClipboardComponent]
        });
        fixture = TestBed.createComponent(TestCopyClipboardComponent);
        fixture.detectChanges();
    });

    it('should show tooltip when hover element', () => {
        UnitTestingUtils.hoverOverByCSS(fixture.debugElement, 'span');
        fixture.detectChanges();
        expect(UnitTestingUtils.getByCSS(fixture.debugElement, '.adf-copy-tooltip')).not.toBeNull();
    });

    it('should not show tooltip when element it is not hovered', () => {
        UnitTestingUtils.hoverOverByCSS(fixture.debugElement, 'span');
        fixture.detectChanges();
        expect(UnitTestingUtils.getByCSS(fixture.debugElement, '.adf-copy-tooltip')).not.toBeNull();

        UnitTestingUtils.mouseLeaveByCSS(fixture.debugElement, 'span');
        fixture.detectChanges();
        expect(UnitTestingUtils.getByCSS(fixture.debugElement, '.adf-copy-tooltip')).toBeNull();
    });

    it('should copy the content of element when click it', fakeAsync(() => {
        spyOn(navigator.clipboard, 'writeText');
        UnitTestingUtils.clickByCSS(fixture.debugElement, 'span');
        tick();
        fixture.detectChanges();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('text to copy');
    }));

    it('should copy the content of element on keydown event', fakeAsync(() => {
        spyOn(navigator.clipboard, 'writeText');
        UnitTestingUtils.keyBoardEventByCSS(fixture.debugElement, 'span', 'keydown', 'Enter', 'Enter');
        tick();
        fixture.detectChanges();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('text to copy');
    }));

    it('should not copy the content of element when click it', fakeAsync(() => {
        spyOn(navigator.clipboard, 'writeText');
        UnitTestingUtils.mouseLeaveByCSS(fixture.debugElement, 'span');
        tick();
        fixture.detectChanges();
        expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    }));
});
