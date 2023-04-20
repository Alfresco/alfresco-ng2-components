/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NotificationService } from '../notifications/services/notification.service';
import { TestBed } from '@angular/core/testing';
import { ClipboardService } from './clipboard.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { setupTestBed } from '../testing/setup-test-bed';
import { CoreTestingModule } from '../testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ClipboardService', () => {
    let clipboardService: ClipboardService;
    let notificationService: NotificationService;
    let inputElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            MatSnackBarModule
        ]
    });

    beforeEach(() => {
        clipboardService = TestBed.inject(ClipboardService);
        notificationService = TestBed.inject(NotificationService);
        inputElement = document.createElement('input');
    });

    it('should validate target when element is input', () => {
        const isValid = clipboardService.isTargetValid(inputElement);
        expect(isValid).toBe(true);
    });

    it('should invalidate target when element is input and disabled', () => {
        inputElement.disabled = true;
        const isValid = clipboardService.isTargetValid(inputElement);
        expect(isValid).toBe(false);
    });

    it('should copy text to clipboard', () => {
        spyOn(navigator.clipboard, 'writeText');
        spyOn(inputElement, 'select');
        spyOn(inputElement, 'setSelectionRange');

        inputElement.value = 'some text';

        clipboardService.copyToClipboard(inputElement);

        expect(inputElement.select).toHaveBeenCalledWith();
        expect(inputElement.setSelectionRange)
            .toHaveBeenCalledWith(0, inputElement.value.length);
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('some text');
    });

    it('should notify copy to clipboard with message', () => {
        spyOn(navigator.clipboard, 'writeText');
        spyOn(notificationService, 'openSnackMessage');

        inputElement.value = 'some text';

        clipboardService.copyToClipboard(inputElement, 'success');

        expect(notificationService.openSnackMessage).toHaveBeenCalledWith('success');
    });

    it('should copy content to clipboard', () => {
        spyOn(navigator.clipboard, 'writeText');
        spyOn(notificationService, 'openSnackMessage');

        clipboardService.copyContentToClipboard('some text', 'some message');

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('some text');
        expect(notificationService.openSnackMessage).toHaveBeenCalledWith('some message');
    });
});
