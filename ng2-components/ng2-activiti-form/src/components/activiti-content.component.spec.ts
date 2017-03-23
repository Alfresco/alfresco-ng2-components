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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CoreModule } from 'ng2-alfresco-core';

import { ActivitiContent } from './activiti-content.component';
import { FormService } from './../services/form.service';
import { EcmModelService } from './../services/ecm-model.service';
import { ContentLinkModel } from './widgets/index';

describe('ActivitiContent', () => {

    let fixture: ComponentFixture<ActivitiContent>;
    let component: ActivitiContent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                ActivitiContent
            ],
            providers: [
                FormService,
                EcmModelService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivitiContent);
        component = fixture.componentInstance;
    });

    it('should display content thumbnail', () => {
        component.showDocumentContent = true;
        component.content = new ContentLinkModel();
        fixture.detectChanges();

        let content = fixture.debugElement.query(By.css('div.upload-widget__content-thumbnail'));
        expect(content).toBeDefined();
    });

    it('should not display content thumbnail', () => {
        component.showDocumentContent = false;
        component.content = new ContentLinkModel();
        fixture.detectChanges();

        let content = fixture.debugElement.query(By.css('div.upload-widget__content-thumbnail'));
        expect(content).toBeNull();
    });

});
