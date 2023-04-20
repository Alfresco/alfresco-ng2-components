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

import { NameColumnComponent } from './name-column.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { skip } from 'rxjs/operators';

describe('NameColumnComponent', () => {
    let fixture: ComponentFixture<NameColumnComponent>;
    let context: any;
    let component: NameColumnComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ]
        });

        fixture = TestBed.createComponent(NameColumnComponent);

        context = {
            row: {
                node: {entry: {}},
                getValue: (key) => key
            }
        };

        component = fixture.componentInstance;
        component.context = context;
    });

    it('should set the display value based on default key', (done) => {
        component.displayText$
            .pipe(skip(1))
            .subscribe(value => {
                expect(value).toBe('name');
                done();
            });

        component.ngOnInit();
    });

    it('should set the display value based on the custom key', (done) => {
        component.key = 'title';
        component.displayText$
            .pipe(skip(1))
            .subscribe(value => {
                expect(value).toBe('title');
                done();
            });

        component.ngOnInit();
    });
});
