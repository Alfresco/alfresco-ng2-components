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

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatDatepickerModule, MatIconModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppConfigService, providers } from '../../../index';

import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { CardViewTextItemModel } from '../../models/card-view-textitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';

import { AlfrescoTranslateLoader } from '../../services/translate-loader.service';
import { CardViewContentProxyDirective } from './card-view-content-proxy.directive';
import { CardViewDateItemComponent } from './card-view-dateitem.component';
import { CardViewItemDispatcherComponent } from './card-view-item-dispatcher.component';
import { CardViewTextItemComponent } from './card-view-textitem.component';
import { CardViewComponent } from './card-view.component';

describe('AdfCardView', () => {

    let fixture: ComponentFixture<CardViewComponent>;
    let component: CardViewComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule,
                MatDatepickerModule,
                MatIconModule,
                MatInputModule,
                MatNativeDateModule,
                FormsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: AlfrescoTranslateLoader
                    }
                })
            ],
            declarations: [
                CardViewComponent,
                CardViewItemDispatcherComponent,
                CardViewContentProxyDirective,
                CardViewTextItemComponent,
                CardViewDateItemComponent
            ],
            providers: [
                CardViewUpdateService,
                AppConfigService,
                ...providers()
            ]
        });

        // entryComponents are not supported yet on TestBed, that is why this ugly workaround:
        // https://github.com/angular/angular/issues/10760
        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: { entryComponents: [ CardViewTextItemComponent, CardViewDateItemComponent ] }
        });

        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewComponent);
        component = fixture.componentInstance;
    });

    it('should render the label and value', async(() => {
        component.properties = [new CardViewTextItemModel({label: 'My label', value: 'My value', key: 'some key'})];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();

            let labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
            expect(labelValue).not.toBeNull();
            expect(labelValue.nativeElement.innerText).toBe('My label');

            let value = fixture.debugElement.query(By.css('.adf-property-value'));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText).toBe('My value');
        });
    }));

    it('should pass through editable property to the items', () => {
        component.editable = true;
        component.properties = [new CardViewDateItemModel({
            label: 'My date label',
            value: '2017-06-14',
            key: 'some-key',
            editable: true
        })];

        fixture.detectChanges();

        let datePicker = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-some-key"]`));
        expect(datePicker).not.toBeNull('Datepicker should be in DOM');
    });

    it('should render the date in the correct format', async(() => {
        component.properties = [new CardViewDateItemModel({
            label: 'My date label', value: '2017-06-14', key: 'some key',
            format: 'MMM DD YYYY'
        })];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();

            let labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
            expect(labelValue).not.toBeNull();
            expect(labelValue.nativeElement.innerText).toBe('My date label');

            let value = fixture.debugElement.query(By.css('.adf-property-value'));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText).toBe('Jun 14 2017');
        });
    }));

    it('should render the default value if the value is empty', async(() => {
        component.properties = [new CardViewTextItemModel({
            label: 'My default label',
            value: null,
            default: 'default value',
            key: 'some key'
        })];
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();

            let labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
            expect(labelValue).not.toBeNull();
            expect(labelValue.nativeElement.innerText).toBe('My default label');

            let value = fixture.debugElement.query(By.css('.adf-property-value'));
            expect(value).not.toBeNull();
            expect(value.nativeElement.innerText).toBe('default value');
        });
    }));
});
