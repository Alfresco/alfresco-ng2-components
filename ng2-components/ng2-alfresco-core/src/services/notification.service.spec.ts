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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { NotificationService } from './notification.service';
import { MdSnackBarModule, MdSnackBar, OverlayModule, OVERLAY_PROVIDERS, LiveAnnouncer } from '@angular/material';

describe('NotificationService', () => {
    let fixture: ComponentFixture<ComponentThatProvidesNotificationService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                OverlayModule,
                MdSnackBarModule
            ],
            declarations: [ComponentThatProvidesNotificationService],
            providers: [
                NotificationService,
                MdSnackBar,
                OVERLAY_PROVIDERS,
                LiveAnnouncer
            ]
        });

        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComponentThatProvidesNotificationService);
        fixture.detectChanges();
    });


    it('should open a message notification bar', (done) => {
        let promise = fixture.componentInstance.sendMessage();
        promise.afterDismissed().subscribe(() => {
            done();
        });

        fixture.detectChanges();

        expect(document.querySelector('snack-bar-container')).not.toBeNull();
    });


    it('should open a message notification bar with action', (done) => {
        let promise = fixture.componentInstance.sendMessageAction();
        promise.afterDismissed().subscribe(() => {
            done();
        });

        fixture.detectChanges();

        expect(document.querySelector('snack-bar-container')).not.toBeNull();
    });

});

@Component({
    template: '',
    providers: [NotificationService]
})
class ComponentThatProvidesNotificationService {
    constructor(public notificationService: NotificationService) {

    }

    sendMessage() {
        let promise = this.notificationService.openSnackMessage('Test notification', 5000);
        return promise;
    }

    sendMessageAction() {
        let promise = this.notificationService.openSnackMessageAction('Test notification', 'TestWarn', 5000);
        return promise;
    }

}
