/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SignalInputControl } from './signal-input-control';

@Component({
    selector: 'adf-signal-probe-input-control',
    template: `<mat-form-field>
        <input matInput [id]="inputId()" [disabled]="locked()" [errorStateMatcher]="errorStateMatcher" (blur)="markTouched()" />
    </mat-form-field>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatFormFieldModule, MatInputModule]
})
class SignalProbeInputControlComponent extends SignalInputControl<string> {}

describe('SignalInputControl', () => {
    const render = () => {
        const fixture = TestBed.createComponent(SignalProbeInputControlComponent);
        fixture.componentRef.setInput('value', '');
        fixture.componentRef.setInput('inputId', 'probe');
        fixture.detectChanges();
        return { fixture, control: fixture.componentInstance, element: fixture.nativeElement as HTMLElement };
    };

    it('should lock the input when the field is disabled or read-only', () => {
        const { fixture, element } = render();
        expect(element.querySelector('input').disabled).toBeFalse();

        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();
        expect(element.querySelector('input').disabled).toBeTrue();

        fixture.componentRef.setInput('readonly', false);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        expect(element.querySelector('input').disabled).toBeTrue();
    });

    it('should mark the field touched when the input loses focus', () => {
        const { control, element } = render();

        element.querySelector('input').dispatchEvent(new Event('blur'));

        expect(control.touched()).toBeTrue();
    });

    it('should show the input in error while it has an error to show', async () => {
        const { fixture, element } = render();
        fixture.autoDetectChanges();
        expect(element.querySelector('input').getAttribute('aria-invalid')).toBe('false');

        fixture.componentRef.setInput('error', { key: 'FORM.FIELD.REQUIRED' });
        await fixture.whenStable();

        expect(element.querySelector('input').getAttribute('aria-invalid')).toBe('true');
    });
});
