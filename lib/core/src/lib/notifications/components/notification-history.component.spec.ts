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

import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { setupTestBed } from '../../testing/setupTestBed';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { NotificationHistoryComponent } from './notification-history.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NotificationService } from '../services/notification.service';

describe('Notification History Component', () => {

    let fixture: ComponentFixture<NotificationHistoryComponent>;
    let element: HTMLElement;
    let notificationService: NotificationService;
    let overlayContainerElement: HTMLElement;

    function openNotification() {
        fixture.detectChanges();
        const button: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#adf-notification-history-open-button');
        button.click();
        fixture.detectChanges();
    }

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(NotificationHistoryComponent);
        element = fixture.nativeElement;

        notificationService = TestBed.get(NotificationService);
    }));

    beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
        overlayContainerElement = oc.getContainerElement();
    }));

    afterEach(() => {
        fixture.destroy();
    });

    describe('ui ', () => {

        it('should empty message be present when there are no notifications in the history', (done) => {
            openNotification();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(overlayContainerElement.querySelector('#adf-notification-history-component-no-message')).toBeDefined();
                done();
            });
        });

        it('should  message be present and empty message not be present when there are notifications in the history', (done) => {
            notificationService.showInfo('Example Message');
            openNotification();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(overlayContainerElement.querySelector('#adf-notification-history-component-no-message')).toBeNull();
                expect(overlayContainerElement.querySelector('#adf-notification-history-list').innerHTML).toContain('Example Message');
                done();
            });
        });
    });
});
