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
import { CoreModule, AlfrescoTranslationService } from 'ng2-alfresco-core';
import { CustomView } from './adf-custom-view.component';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

describe('AdfCustomView', () => {

    let componentHandler: any;
    let component: CustomView;
    let fixture: ComponentFixture<CustomView>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                CustomView
            ],
            providers: [
            ]
        }).compileComponents();

        let translateService = TestBed.get(AlfrescoTranslationService);
        spyOn(translateService, 'addTranslationFolder').and.stub();
        spyOn(translateService, 'get').and.callFake((key) => { return Observable.of(key); });
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(CustomView);
        component = fixture.componentInstance;

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should render the label and value', () => {
        component.properties = [{label: 'My label', value: 'My value'}];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();

            let labelValue = fixture.debugElement.query(By.css('.adf-header__label'));
            expect(labelValue).not.toBeNull();
            expect(labelValue.nativeElement.innerText).toBe('My label');

            let value = fixture.debugElement.query(By.css('.adf-header__value'));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText).toBe('My value');
        });

    });

    it('should render the date in the correct format', () => {
        component.properties = [{label: 'My date label', value: '2017-06-14' , format: 'MMM DD YYYY'}];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();

            let labelValue = fixture.debugElement.query(By.css('.adf-header__label'));
            expect(labelValue).not.toBeNull();
            expect(labelValue.nativeElement.innerText).toBe('My date label');

            let value = fixture.debugElement.query(By.css('.adf-header__value'));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText).toBe('Jun 14 2017');
        });

    });

    it('should render the default value if the value is empty', () => {
        component.properties = [{label: 'My default label', default: 'default value'}];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();

            let labelValue = fixture.debugElement.query(By.css('.adf-header__label'));
            expect(labelValue).not.toBeNull();
            expect(labelValue.nativeElement.innerText).toBe('My default label');

            let value = fixture.debugElement.query(By.css('.adf-header__value'));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText).toBe('default value');
        });

    });
});
