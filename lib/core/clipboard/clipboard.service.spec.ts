/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { LogService } from '../services/log.service';
import { NotificationService } from '../notifications/services/notification.service';
import { AppConfigService } from '../app-config/app-config.service';
import { TestBed } from '@angular/core/testing';
import { ClipboardModule } from './clipboard.module';
import { ClipboardService } from './clipboard.service';
import { TranslationService } from '../services/translation.service';
import { AppConfigServiceMock } from '../mock/app-config.service.mock';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material';
import { TranslationMock } from '@alfresco/adf-core';
import { setupTestBed } from '../testing/setupTestBed';

describe('ClipboardService', () => {
    let clipboardService: ClipboardService;
    let notificationService: NotificationService;
    let inputElement;

    setupTestBed({
        imports: [
            ClipboardModule,
            HttpClientModule,
            MatSnackBarModule
        ],
        providers: [
            LogService,
            { provide: TranslationService, useClass: TranslationMock },
            { provide: AppConfigService, useClass: AppConfigServiceMock },
            NotificationService
        ]
    });

    beforeEach(() => {
        clipboardService = TestBed.get(ClipboardService);
        notificationService = TestBed.get(NotificationService);
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
        spyOn(document, 'execCommand');
        spyOn(inputElement, 'select');
        spyOn(inputElement, 'setSelectionRange');

        inputElement.value = 'some text';

        clipboardService.copyToClipboard(inputElement);

        expect(inputElement.select).toHaveBeenCalledWith();
        expect(inputElement.setSelectionRange)
            .toHaveBeenCalledWith(0, inputElement.value.length);
        expect(document.execCommand).toHaveBeenCalledWith('copy');
    });

    it('should notify copy to clipboard with message', () => {
        spyOn(notificationService, 'openSnackMessage');
        inputElement.value = 'some text';

        clipboardService.copyToClipboard(inputElement, 'success');

        expect(notificationService.openSnackMessage).toHaveBeenCalledWith('success');
    });
});
