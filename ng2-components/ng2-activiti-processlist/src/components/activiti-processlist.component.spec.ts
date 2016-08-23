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

import {describe, expect, it, inject, beforeEachProviders, beforeEach} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {AlfrescoSettingsService, AlfrescoTranslationService, AlfrescoAuthenticationService} from 'ng2-alfresco-core';
import {ActivitiProcesslistComponent} from '../../src/components/activiti-processlist.component';
import {TranslationMock} from './../assets/translation.service.mock';
import {ActivitiProcessService} from '../services/activiti-process.service';

describe('ActivitiProcesslistComponent', () => {

    let processlistComponentFixture, element, component;


    beforeEachProviders(() => {
        return [
            ActivitiProcessService,
            AlfrescoSettingsService,
            AlfrescoAuthenticationService,
            {provide: AlfrescoTranslationService, useClass: TranslationMock}
        ];
    });

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(ActivitiProcesslistComponent)
            .then(fixture => {
                processlistComponentFixture = fixture;
                element = processlistComponentFixture.nativeElement;
                component = processlistComponentFixture.componentInstance;
            });
    }));

    it('should have a valid title', () => {
        expect(element.querySelector('h1')).toBeDefined();
        expect(element.getElementsByTagName('h1')[0].innerHTML).toEqual('My Activiti Processes');
    });

    it('should contain a list of processes', () => {
        let componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);
        window['componentHandler'] = componentHandler;

        component.ngOnInit();
        processlistComponentFixture.detectChanges();
        expect(element.querySelector('table')).toBeDefined();
        expect(element.querySelectorAll('table tbody tr').length).toEqual(1);
    });
});
