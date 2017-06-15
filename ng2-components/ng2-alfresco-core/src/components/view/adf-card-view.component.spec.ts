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
import { CardView } from './adf-card-view.component';
import { CardViewModel } from '../../models/card-view.model';
import { By } from '@angular/platform-browser';

describe('AdfCardView', () => {

    let fixture: ComponentFixture<CardView>;
    let component: CardView;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CardView
            ],
            providers: [
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardView);
        component = fixture.componentInstance;
    });

    it('should render the label and value', async(() => {
        component.properties = [new CardViewModel({label: 'My label', value: 'My value'});
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

    }));

    it('should render the date in the correct format', async(() => {
        component.properties = [new CardViewModel({
            label: 'My date label', value: '2017-06-14',
            format: 'MMM DD YYYY'
        })];
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

    }));

    it('should render the default value if the value is empty', async(() => {
        component.properties = [new CardViewModel({
            label: 'My default label',
            default: 'default value'
        })];
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

    }));
});
