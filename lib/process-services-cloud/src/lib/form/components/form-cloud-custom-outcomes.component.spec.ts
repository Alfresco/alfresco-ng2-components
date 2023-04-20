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

import {
    FormModel, setupTestBed
} from '@alfresco/adf-core';
import {
    Component,
    DebugElement, ViewChild
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { FormCloudComponent } from './form-cloud.component';

@Component({
    selector: 'adf-cloud-form-with-custom-outcomes',
    template: `
        <adf-cloud-form #adfCloudForm>
            <adf-cloud-form-custom-outcomes>
                <button mat-button id="adf-custom-outcome-1" (click)="onCustomButtonOneClick()">
                    CUSTOM-BUTTON-1
                </button>
                <button mat-button id="adf-custom-outcome-2" (click)="onCustomButtonTwoClick()">
                    CUSTOM-BUTTON-2
                </button>
            </adf-cloud-form-custom-outcomes>
        </adf-cloud-form>`
})
class FormCloudWithCustomOutComesComponent {

    @ViewChild('adfCloudForm', { static: true })
    adfCloudForm: FormCloudComponent;

    onCustomButtonOneClick() {
    }

    onCustomButtonTwoClick() {
    }
}

describe('FormCloudWithCustomOutComesComponent', () => {

    let fixture: ComponentFixture<FormCloudWithCustomOutComesComponent>;
    let customComponent: FormCloudWithCustomOutComesComponent;
    let debugElement: DebugElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ],
        declarations: [FormCloudWithCustomOutComesComponent]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormCloudWithCustomOutComesComponent);
        customComponent = fixture.componentInstance;
        debugElement = fixture.debugElement;
        const formRepresentation = {
            fields: [
                { id: 'container1' }
            ],
            outcomes: [
                { id: 'outcome-1', name: 'outcome 1' }
            ]
        };

        const form = new FormModel(formRepresentation);
        customComponent.adfCloudForm.form = form;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should be able to inject custom outcomes and click on custom outcomes', async () => {
        fixture.detectChanges();

        const onCustomButtonOneSpy = spyOn(customComponent, 'onCustomButtonOneClick').and.callThrough();
        const buttonOneBtn = debugElement.query(By.css('#adf-custom-outcome-1'));
        const buttonTwoBtn = debugElement.query(By.css('#adf-custom-outcome-2'));
        expect(buttonOneBtn).not.toBeNull();
        expect(buttonTwoBtn).not.toBeNull();

        buttonOneBtn.nativeElement.click();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(onCustomButtonOneSpy).toHaveBeenCalled();
        expect(buttonOneBtn.nativeElement.innerText).toBe('CUSTOM-BUTTON-1');
        expect(buttonTwoBtn.nativeElement.innerText).toBe('CUSTOM-BUTTON-2');
    });
});
