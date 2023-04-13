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

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';
import { TranslationService } from '../../translation/translation.service';
import { setupTestBed } from '../../testing/setup-test-bed';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    template: '',
    providers: [NotificationService]
})
class ProvidesNotificationServiceComponent {

    constructor(public notificationService: NotificationService) {

    }

    sendMessageWithoutConfig() {
        return this.notificationService.openSnackMessage('Test notification', 1000);
    }

    sendMessage() {
        return this.notificationService.openSnackMessage('Test notification', 1000);
    }

    sendMessageWithArgs() {
        return this.notificationService.openSnackMessage('Test notification {{ arg }}', 1000, {arg: 'arg'});
    }

    sendCustomMessage() {
        const matSnackBarConfig = new MatSnackBarConfig();
        matSnackBarConfig.duration = 1000;

        return this.notificationService.openSnackMessage('Test notification', matSnackBarConfig);
    }

    sendMessageActionWithoutConfig() {
        return this.notificationService.openSnackMessageAction('Test notification', 'TestWarn', 1000);
    }

    sendMessageAction() {
        return this.notificationService.openSnackMessageAction('Test notification', 'TestWarn', 1000);
    }

    sendCustomMessageAction() {
        const matSnackBarConfig = new MatSnackBarConfig();
        matSnackBarConfig.duration = 1000;

        return this.notificationService.openSnackMessageAction('Test notification', 'TestWarn', matSnackBarConfig);
    }

    sendMessageWithDecorativeIcon() {
        const notificationConfig = new MatSnackBarConfig();
        notificationConfig.duration = 1000;
        notificationConfig.data = {decorativeIcon: 'info'};

        return this.notificationService.openSnackMessage('with decorative icon', notificationConfig);
    }

    sendMessageWithDecorativeIconAndAction() {
        const notificationConfig = new MatSnackBarConfig();
        notificationConfig.duration = 1000;
        notificationConfig.data = { decorativeIcon: 'folder' };

        return this.notificationService.openSnackMessageAction('with decorative icon', 'TestWarn', notificationConfig);
    }

}

describe('NotificationService', () => {
    let fixture: ComponentFixture<ProvidesNotificationServiceComponent>;
    let translationService: TranslationService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            OverlayModule,
            MatSnackBarModule
        ],
        declarations: [ProvidesNotificationServiceComponent],
        providers: [
            MatSnackBar,
            LiveAnnouncer
        ]
    });

    beforeEach(() => {
        translationService = TestBed.inject(TranslationService);
        fixture = TestBed.createComponent(ProvidesNotificationServiceComponent);
        fixture.detectChanges();
    });

    it('should translate messages', (done) => {
        spyOn(translationService, 'instant').and.callThrough();

        const promise = fixture.componentInstance.sendMessage();
        promise.afterDismissed().subscribe(() => {
            expect(translationService.instant).toHaveBeenCalled();
            done();
        });

        fixture.detectChanges();
    });

    it('should translate messages with args', (done) => {
        spyOn(translationService, 'instant').and.callThrough();

        const promise = fixture.componentInstance.sendMessageWithArgs();
        promise.afterDismissed().subscribe(() => {
            expect(translationService.instant).toHaveBeenCalledWith('Test notification {{ arg }}', {arg: 'arg'});
            done();
        });

        fixture.detectChanges();
    });

    it('should translate the action', (done) => {
        spyOn(translationService, 'instant').and.callThrough();

        const promise = fixture.componentInstance.sendMessageAction();
        promise.afterDismissed().subscribe(() => {
            expect(translationService.instant).toHaveBeenCalledTimes(2);
            done();
        });

        fixture.detectChanges();
    });

    it('should open a message notification bar', (done) => {
        const promise = fixture.componentInstance.sendMessage();
        promise.afterDismissed().subscribe(() => {
            done();
        });

        fixture.detectChanges();

        expect(document.querySelector('snack-bar-container')).not.toBeNull();
    });

    it('should open a message notification bar without custom configuration', (done) => {
        const promise = fixture.componentInstance.sendMessageWithoutConfig();
        promise.afterDismissed().subscribe(() => {
            done();
        });

        fixture.detectChanges();

        expect(document.querySelector('snack-bar-container')).not.toBeNull();
    });

    it('should open a message notification bar with custom configuration', (done) => {
        const promise = fixture.componentInstance.sendCustomMessage();
        promise.afterDismissed().subscribe(() => {
            done();
        });

        fixture.detectChanges();

        expect(document.querySelector('snack-bar-container')).not.toBeNull();
    });

    it('should open a message notification bar with action', (done) => {
        const promise = fixture.componentInstance.sendMessageAction();
        promise.afterDismissed().subscribe(() => {
            done();
        });

        fixture.detectChanges();

        expect(document.querySelector('snack-bar-container')).not.toBeNull();
    });

    it('should open a message notification bar with action and custom configuration', (done) => {
        const promise = fixture.componentInstance.sendCustomMessageAction();
        promise.afterDismissed().subscribe(() => {
            done();
        });

        fixture.detectChanges();

        expect(document.querySelector('snack-bar-container')).not.toBeNull();
    });

    it('should open a message notification bar with action and no custom configuration', (done) => {
        const promise = fixture.componentInstance.sendMessageActionWithoutConfig();
        promise.afterDismissed().subscribe(() => {
            done();
        });

        fixture.detectChanges();

        expect(document.querySelector('snack-bar-container')).not.toBeNull();
    });

    it('should open a message notification bar with a decorative icon', (done) => {
        const promise = fixture.componentInstance.sendMessageWithDecorativeIcon();
        promise.afterDismissed().subscribe(() => {
            done();
        });

        fixture.detectChanges();

        expect(document.querySelector('[data-automation-id="adf-snackbar-message-content"] mat-icon')).not.toBeNull();
    });

    it('should open a message notification bar with action and a decorative icon', (done) => {
        const promise = fixture.componentInstance.sendMessageWithDecorativeIconAndAction();
        promise.afterDismissed().subscribe(() => {
            done();
        });

        fixture.detectChanges();

        expect(document.querySelector('[data-automation-id="adf-snackbar-message-content"] mat-icon')).not.toBeNull();
     });

});
