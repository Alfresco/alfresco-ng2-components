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
import { FormDefinitionSelectorCloudComponent } from './form-definition-selector-cloud.component';
import { of } from 'rxjs';
import { FormDefinitionSelectorCloudService } from '../services/form-definition-selector-cloud.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { NoopTranslateModule } from '@alfresco/adf-core';

describe('FormDefinitionCloudComponent', () => {
    let fixture: ComponentFixture<FormDefinitionSelectorCloudComponent>;
    let service: FormDefinitionSelectorCloudService;
    let getFormsSpy: jasmine.Spy;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, FormDefinitionSelectorCloudComponent]
        });
        fixture = TestBed.createComponent(FormDefinitionSelectorCloudComponent);
        service = TestBed.inject(FormDefinitionSelectorCloudService);
        getFormsSpy = spyOn(service, 'getStandAloneTaskForms').and.returnValue(of([{ id: 'fake-form', name: 'fakeForm' } as any]));
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should load the forms by default', async () => {
        const selectElement = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-form-selector-dropdown' }));
        await selectElement.open();
        const options = await selectElement.getOptions();

        expect(options.length).toBe(2);
        expect(await options[0].getText()).toBe('ADF_CLOUD_TASK_LIST.START_TASK.FORM.LABEL.NONE');
        expect(await options[1].getText()).toBe('fakeForm');
        expect(getFormsSpy).toHaveBeenCalled();
    });

    it('should load only None option when no forms exist', async () => {
        getFormsSpy.and.returnValue(of([]));
        const selectElement = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-form-selector-dropdown' }));
        await selectElement.open();

        const options = await selectElement.getOptions();

        expect(options.length).toBe(1);
    });

    it('should not preselect any form by default', async () => {
        const selectElement = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-form-selector-dropdown' }));

        expect(await selectElement.getValueText()).toBe('');
    });

    it('should display the name of the form that is selected', async () => {
        const selectElement = await loader.getHarness(MatSelectHarness.with({ selector: '.adf-form-selector-dropdown' }));
        await selectElement.open();
        const options = await selectElement.getOptions();

        await options[1].click();

        expect(await selectElement.getValueText()).toBe('fakeForm');
    });
});
