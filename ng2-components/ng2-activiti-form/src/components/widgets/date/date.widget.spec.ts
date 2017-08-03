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

import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as moment from 'moment';
import { CoreModule } from 'ng2-alfresco-core';
import { MATERIAL_MODULE } from '../../../../index';
import { ActivitiAlfrescoContentService } from '../../../services/activiti-alfresco.service';
import { ErrorWidgetComponent } from '../error/error.component';
import { EcmModelService } from './../../../services/ecm-model.service';
import { FormService } from './../../../services/form.service';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { DateWidgetComponent } from './date.widget';

describe('DateWidgetComponent', () => {

    let widget: DateWidgetComponent;
    let fixture: ComponentFixture<DateWidgetComponent>;
    let nativeElement: any;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                ...MATERIAL_MODULE
            ],
            declarations: [
                DateWidgetComponent,
                ErrorWidgetComponent
            ],
            providers: [
                FormService,
                ActivitiAlfrescoContentService,
                EcmModelService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        nativeElement = {
            querySelector: function () {
                return null;
            }
        };

        fixture = TestBed.createComponent(DateWidgetComponent);

        element = fixture.nativeElement;
        widget = fixture.componentInstance;
    });

});
