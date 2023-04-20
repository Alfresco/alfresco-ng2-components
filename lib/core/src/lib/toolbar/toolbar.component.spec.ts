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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CoreTestingModule } from '../testing/core.testing.module';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarModule } from './toolbar.module';

describe('ToolbarComponent', () => {
    let fixture: ComponentFixture<ToolbarComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule,
                ToolbarModule
            ]
        });

        fixture = TestBed.createComponent(ToolbarComponent);
    });

    it('should render title span', async () => {
        fixture.componentInstance.title = 'test-title';

        fixture.detectChanges();
        await fixture.whenStable();

        const title: HTMLSpanElement = fixture.nativeElement.querySelector('.adf-toolbar-title');
        expect(title.innerHTML).toBe('test-title');
    });
});
