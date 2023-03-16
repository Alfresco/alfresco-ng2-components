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

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';
import { TranslationService } from '../../translation/translation.service';
import { setupTestBed } from '../../testing/setup-test-bed';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    template: `<ng-template #customTemplate let-message>
           <p class="custom-template-class">Custom content {{message}}</p>
        </ng-template>`,
    providers: [NotificationService]
})
class ProvidesNotificationServiceComponent {

    @ViewChild('customTemplate', { read: TemplateRef }) customTemplate: TemplateRef<any>;

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

    sendMessageWithTemplateRef() {
        const notificationConfig = new MatSnackBarConfig();
        notificationConfig.duration = 1000;
        notificationConfig.data = {templateRef: this.customTemplate};

        return this.notificationService.openSnackMessage('with templateRef', notificationConfig);
    }

    sendMessageWithTemplateRefWithAction() {
        const notificationConfig = new MatSnackBarConfig();
        notificationConfig.duration = 1000;
        notificationConfig.data = { templateRef: this.customTemplate };

        return this.notificationService.openSnackMessageAction('with templateRef', 'TestWarn', notificationConfig);
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

    it('should open a message notification bar with a custom templateRef configuration', (done) => {
        const promise = fixture.componentInstance.sendMessageWithTemplateRef();
        promise.afterDismissed().subscribe(() => {
            done();
        });

        fixture.detectChanges();

        expect(document.querySelector('.custom-template-class')).not.toBeNull();
        expect(document.querySelector('.custom-template-class')?.innerHTML).toEqual('Custom content with templateRef');
    });

    it('should open a message notification bar with action and custom templateRef configuration', (done) => {
        const promise = fixture.componentInstance.sendMessageWithTemplateRefWithAction();
        promise.afterDismissed().subscribe(() => {
            done();
        });

        fixture.detectChanges();

        expect(document.querySelector('.custom-template-class')).not.toBeNull();
        expect(document.querySelector('.custom-template-class')?.innerHTML).toEqual('Custom content with templateRef');
    });

});
