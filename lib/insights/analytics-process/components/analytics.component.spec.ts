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
import { DiagramsModule } from '../../diagram/diagram.module';
import { ChartsModule } from 'ng2-charts';

import { AnalyticsComponent } from '../components/analytics.component';

declare let jasmine: any;

describe('AnalyticsComponent', () => {

    let fixture: ComponentFixture<AnalyticsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ChartsModule,
                DiagramsModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AnalyticsComponent);
        fixture.detectChanges();
    });

    describe('Rendering tests', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

    });
});
