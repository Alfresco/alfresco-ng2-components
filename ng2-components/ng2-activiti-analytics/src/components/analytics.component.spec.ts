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

import { describe, expect, it, inject } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { AnalyticsComponent } from './analytics.component';

describe('Show component HTML', () => {
    it('Display component tag base-chart', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(AnalyticsComponent)
            .then((fixture) => {
                let element = fixture.nativeElement;
                expect(element.getElementsByTagName('base-chart')[0].innerHTML).toBeDefined();
            });
    }));
});
