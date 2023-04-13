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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormDefinitionSelectorCloudComponent } from './form-definition-selector-cloud.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { FormDefinitionSelectorCloudService } from '../services/form-definition-selector-cloud.service';
import { TranslateModule } from '@ngx-translate/core';

describe('FormDefinitionCloudComponent', () => {

    let fixture: ComponentFixture<FormDefinitionSelectorCloudComponent>;
    let service: FormDefinitionSelectorCloudService;
    let element: HTMLElement;
    let getFormsSpy: jasmine.Spy;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormDefinitionSelectorCloudComponent);
        element = fixture.nativeElement;
        service = TestBed.inject(FormDefinitionSelectorCloudService);
        getFormsSpy = spyOn(service, 'getStandAloneTaskForms').and.returnValue(of([{ id: 'fake-form', name: 'fakeForm' } as any]));
    });

    it('should load the forms by default', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const clickMatSelect = fixture.debugElement.query(By.css(('.mat-select-trigger')));
        clickMatSelect.triggerEventHandler('click', null);
        fixture.detectChanges();
        const options: any = fixture.debugElement.queryAll(By.css('mat-option'));
        expect(options[0].nativeElement.innerText.trim()).toBe('ADF_CLOUD_TASK_LIST.START_TASK.FORM.LABEL.NONE');
        expect(options[1].nativeElement.innerText.trim()).toBe('fakeForm');
        expect(getFormsSpy).toHaveBeenCalled();
    });

    it('should load only None option when no forms exist', async () => {
        getFormsSpy.and.returnValue(of([]));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const clickMatSelect = fixture.debugElement.query(By.css(('.mat-select-trigger')));
        clickMatSelect.triggerEventHandler('click', null);
        fixture.detectChanges();
        const options: any = fixture.debugElement.queryAll(By.css('mat-option'));
        expect((options).length).toBe(1);
    });

    it('should not preselect any form by default', () => {
        fixture.detectChanges();
        const formInput = element.querySelector('mat-select');
        expect(formInput).toBeDefined();
        expect(formInput.nodeValue).toBeNull();
    });

    it('should display the name of the form that is selected', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const clickMatSelect = fixture.debugElement.query(By.css(('.mat-select-trigger')));
        clickMatSelect.triggerEventHandler('click', null);
        fixture.detectChanges();
        const options: any = fixture.debugElement.queryAll(By.css('mat-option'));
        options[1].triggerEventHandler('click', {});
        fixture.detectChanges();
        const selected = fixture.debugElement.query(By.css('mat-select'));
        const selectedValue = ((selected).nativeElement.innerText);
        expect(selectedValue.trim()).toBe('fakeForm');
    });
});
