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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreModule } from '../core.module';
import { ClipboardService } from './clipboard.service';

@Component({
     selector: 'adf-test-component',
     template: `
        <button
            clipboard-notification="copy success"
            [adf-clipboard]="ref">
            copy
        </button>

        <input #ref />
     `
})
class TestComponent {}

describe('ClipboardDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let clipboardService: ClipboardService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        declarations: [
            TestComponent
        ],
        providers: [
            ClipboardService
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        clipboardService = TestBed.get(ClipboardService);
        fixture.detectChanges();
    });

    it('should notify copy target value on button click event', () => {
        spyOn(clipboardService, 'copyToClipboard');
        fixture.nativeElement.querySelector('input').value = 'some value';
        fixture.nativeElement.querySelector('button').dispatchEvent(new MouseEvent('click'));

        expect(clipboardService.copyToClipboard).toHaveBeenCalled();
    });
});
