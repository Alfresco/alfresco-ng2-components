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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';
import { TranslationService } from '../../translation/translation.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { UnitTestingUtils } from '../../testing/unit-testing-utils';
import { NoopTranslateModule } from '../../testing/noop-translate.module';

@Component({
    template: '<div>Test div</div>',
    providers: [NotificationService]
})
class ProvidesNotificationServiceComponent {
    constructor(public notificationService: NotificationService) {}

    sendMessageWithoutConfig() {
        return this.notificationService.openSnackMessage('Test notification');
    }

    sendMessage() {
        return this.notificationService.openSnackMessage('Test notification');
    }

    sendMessageWithArgs() {
        return this.notificationService.openSnackMessage('Test notification {{ arg }}', undefined, { arg: 'arg' });
    }

    sendCustomMessage() {
        const matSnackBarConfig = new MatSnackBarConfig();

        return this.notificationService.openSnackMessage('Test notification', matSnackBarConfig);
    }

    sendMessageActionWithoutConfig() {
        return this.notificationService.openSnackMessageAction('Test notification', 'TestWarn');
    }

    sendMessageAction() {
        return this.notificationService.openSnackMessageAction('Test notification', 'TestWarn');
    }

    sendCustomMessageAction() {
        const matSnackBarConfig = new MatSnackBarConfig();

        return this.notificationService.openSnackMessageAction('Test notification', 'TestWarn', matSnackBarConfig);
    }

    sendMessageWithDecorativeIcon() {
        const notificationConfig = new MatSnackBarConfig();
        notificationConfig.data = { decorativeIcon: 'info' };

        return this.notificationService.openSnackMessage('with decorative icon', notificationConfig);
    }

    sendMessageWithDecorativeIconAndAction() {
        const notificationConfig = new MatSnackBarConfig();
        notificationConfig.data = { decorativeIcon: 'folder' };

        return this.notificationService.openSnackMessageAction('with decorative icon', 'TestWarn', notificationConfig);
    }
}

describe('NotificationService', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<ProvidesNotificationServiceComponent>;
    let translationService: TranslationService;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ProvidesNotificationServiceComponent, NoopTranslateModule],
            providers: [provideNoopAnimations()]
        }).compileComponents();
        translationService = TestBed.inject(TranslationService);
        fixture = TestBed.createComponent(ProvidesNotificationServiceComponent);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    });

    it('should translate messages', () => {
        spyOn(translationService, 'instant').and.callThrough();

        fixture.componentInstance.sendMessage();
        fixture.detectChanges();

        expect(translationService.instant).toHaveBeenCalled();
    });

    it('should translate messages with args', () => {
        spyOn(translationService, 'instant').and.callThrough();

        fixture.componentInstance.sendMessageWithArgs();
        fixture.detectChanges();

        expect(translationService.instant).toHaveBeenCalledWith('Test notification {{ arg }}', { arg: 'arg' });
    });

    it('should translate the action', () => {
        spyOn(translationService, 'instant').and.callThrough();

        fixture.componentInstance.sendMessageAction();
        fixture.detectChanges();
        expect(translationService.instant).toHaveBeenCalledTimes(2);
    });

    it('should open a message notification bar', async () => {
        fixture.componentInstance.sendMessage();
        fixture.detectChanges();

        const isLoaded = await testingUtils.checkIfMatSnackbarExists();
        expect(isLoaded).toBe(true);
    });

    it('should open a message notification bar without custom configuration', async () => {
        fixture.componentInstance.sendMessageWithoutConfig();
        fixture.detectChanges();
        const isLoaded = await testingUtils.checkIfMatSnackbarExists();
        expect(isLoaded).toBe(true);
    });

    it('should open a message notification bar with custom configuration', async () => {
        fixture.componentInstance.sendCustomMessage();
        fixture.detectChanges();

        expect(await testingUtils.checkIfMatSnackbarExists()).toBe(true);
    });

    it('should open a message notification bar with action', async () => {
        fixture.componentInstance.sendMessageAction();
        expect(await testingUtils.checkIfMatSnackbarExists()).toBe(true);
    });

    it('should open a message notification bar with action and custom configuration', async () => {
        fixture.componentInstance.sendCustomMessageAction();
        fixture.detectChanges();

        expect(await testingUtils.checkIfMatSnackbarExists()).toBe(true);
    });

    it('should open a message notification bar with action and no custom configuration', async () => {
        fixture.componentInstance.sendMessageActionWithoutConfig();
        fixture.detectChanges();

        expect(await testingUtils.checkIfMatSnackbarExists()).toBe(true);
    });

    it('should open a message notification bar with a decorative icon', async () => {
        fixture.componentInstance.sendMessageWithDecorativeIcon();
        expect(await testingUtils.checkIfMatIconExistsWithAncestorByDataAutomationId('adf-snackbar-message-content')).toBe(true);
    });

    it('should open a message notification bar with action and a decorative icon', async () => {
        fixture.componentInstance.sendMessageWithDecorativeIconAndAction();
        expect(await testingUtils.checkIfMatIconExistsWithAncestorByDataAutomationId('adf-snackbar-message-content')).toBe(true);
    });
});
