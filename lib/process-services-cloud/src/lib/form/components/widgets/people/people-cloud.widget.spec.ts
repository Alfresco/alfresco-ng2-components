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

import { CoreTestingModule, FormFieldModel, FormModel, IdentityUserService, setupTestBed } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeopleCloudWidgetComponent } from './people-cloud.widget';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PeopleCloudWidgetComponent', () => {
    let fixture: ComponentFixture<PeopleCloudWidgetComponent>;
    let widget: PeopleCloudWidgetComponent;
    let identityUserService: IdentityUserService;
    const currentUser = { id: 'id', username: 'user' };
    const fakeUser = { id: 'fake-id', username: 'fake' };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ],
        declarations: [
            PeopleCloudWidgetComponent
        ],
        schemas: [
            CUSTOM_ELEMENTS_SCHEMA
        ]
    });

    beforeEach(() => {
        identityUserService = TestBed.inject(IdentityUserService);
        fixture = TestBed.createComponent(PeopleCloudWidgetComponent);
        widget = fixture.componentInstance;
        spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(fakeUser);
    });

    it('should preselect the current user', () => {
        widget.field = new FormFieldModel(new FormModel(), { value: null, selectLoggedUser: true });
        fixture.detectChanges();
        expect(widget.preSelectUsers).toEqual([fakeUser]);
        expect(identityUserService.getCurrentUserInfo).toHaveBeenCalled();
    });

    it('should not preselect the current user if value exist', () => {
        widget.field = new FormFieldModel(new FormModel(), { value: [currentUser], selectLoggedUser: true });
        fixture.detectChanges();
        expect(widget.preSelectUsers).toEqual([currentUser]);
        expect(identityUserService.getCurrentUserInfo).not.toHaveBeenCalled();
    });
});
