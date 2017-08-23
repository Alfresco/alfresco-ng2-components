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
import { MdInputModule } from '@angular/material';
import { CoreModule } from 'ng2-alfresco-core';
import { ActivitiAlfrescoContentService } from '../../../services/activiti-alfresco.service';
import { ErrorWidgetComponent } from '../error/error.component';
import { EcmModelService } from './../../../services/ecm-model.service';
import { FormService } from './../../../services/form.service';
import { FormFieldModel } from './../core/form-field.model';
import { AmountWidgetComponent } from './amount.widget';

describe('AmountWidgetComponent', () => {

    let widget: AmountWidgetComponent;
    let fixture: ComponentFixture<AmountWidgetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                MdInputModule
            ],
            declarations: [
                AmountWidgetComponent,
                ErrorWidgetComponent
            ],
            providers: [
                FormService,
                EcmModelService,
                ActivitiAlfrescoContentService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AmountWidgetComponent);

        widget = fixture.componentInstance;
    });

    it('should setup currentcy from field', () => {
        const currency = 'UAH';
        widget.field = new FormFieldModel(null, {
            currency: currency
        });

        widget.ngOnInit();
        expect(widget.currency).toBe(currency);
    });

    it('should setup default currency', () => {
        widget.field = null;
        widget.ngOnInit();
        expect(widget.currency).toBe(AmountWidgetComponent.DEFAULT_CURRENCY);
    });

});
