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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fakeApplicationInstance } from '../../mock/app-model.mock';
import { AppDetailsCloudComponent } from './app-details-cloud.component';
import { DEFAULT_APP_INSTANCE_THEME } from '../../models/application-instance.model';
import { NoopTranslateModule } from '@alfresco/adf-core';

describe('AppDetailsCloudComponent', () => {
    let component: AppDetailsCloudComponent;
    let fixture: ComponentFixture<AppDetailsCloudComponent>;
    let host: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, AppDetailsCloudComponent]
        });
        fixture = TestBed.createComponent(AppDetailsCloudComponent);
        component = fixture.componentInstance;
        host = fixture.nativeElement as HTMLElement;
        component.applicationInstance = fakeApplicationInstance[0];
    });

    const getAppCard = () => host.querySelector<HTMLElement>('.adf-app-listgrid-item-card');

    it('should display application name', () => {
        fixture.detectChanges();
        const appName = host.querySelector<HTMLDivElement>('.adf-app-listgrid-item-card-title');
        expect(appName.innerText.trim()).toEqual(fakeApplicationInstance[0].name);
    });

    it('should emit a click event when app selected', () => {
        spyOn(component.selectedApp, 'emit');
        fixture.detectChanges();
        const app = getAppCard();
        app.click();
        expect(component.selectedApp.emit).toHaveBeenCalledWith(fakeApplicationInstance[0]);
    });

    it('should render card with default icon and theme when are not provided', () => {
        component.applicationInstance = fakeApplicationInstance[2];
        fixture.detectChanges();

        const card = getAppCard();
        expect(card.classList.contains(DEFAULT_APP_INSTANCE_THEME));

        const icon = host.querySelector('.adf-app-listgrid-item-card-logo-icon');
        expect(icon).toBeTruthy();
    });

    it('should render card with a non ApplicationInstanceModel input object', () => {
        component.applicationInstance = { name: 'application-new-3', createdAt: '2018-09-21T12:31:39.000Z', status: 'Pending' };
        fixture.detectChanges();
        const app = getAppCard();
        expect(app).toBeTruthy();
    });
});
