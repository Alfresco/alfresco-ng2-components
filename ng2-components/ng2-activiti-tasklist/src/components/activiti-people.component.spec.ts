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

/*
 import {
 AlfrescoAuthenticationService,
 AlfrescoSettingsService,
 AlfrescoApiService
 } from 'ng2-alfresco-core';*/
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiPeopleService } from '../services/activiti-people.service';
import { ActivitiPeople } from './activiti-people.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

describe('Activiti People Component', () => {

    let activitiPeopleComponent: ActivitiPeople;
    let fixture: ComponentFixture<ActivitiPeople>;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ActivitiPeople],
            providers: [AlfrescoTranslationService, ActivitiPeopleService]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(ActivitiPeople);
            activitiPeopleComponent = fixture.componentInstance;
            element = fixture.nativeElement;
        });
    }));

    it('should not show any image if the user is not logged in', () => {
        expect(element.querySelector('#userinfo_container')).toBeDefined();
        expect(element.querySelector('#logged-user-img')).toBeNull();
    });
});
