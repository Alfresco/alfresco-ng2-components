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

import { AmountWidget } from './amount.widget';
import { FormFieldModel } from './../core/form-field.model';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { FormService } from './../../../services/form.service';
import { EcmModelService } from './../../../services/ecm-model.service';
import { ActivitiAlfrescoContentService } from '../../../services/activiti-alfresco.service';

describe('AmountWidget', () => {

    let widget: AmountWidget;
    let fixture: ComponentFixture<AmountWidget>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                AmountWidget
            ],
            providers: [
                FormService,
                EcmModelService,
                ActivitiAlfrescoContentService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AmountWidget);

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
        expect(widget.currency).toBe(AmountWidget.DEFAULT_CURRENCY);
    });

});
