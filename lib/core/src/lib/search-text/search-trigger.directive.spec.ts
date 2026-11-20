/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, ElementRef, provideZonelessChangeDetection, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { SearchTriggerDirective } from './search-trigger.directive';

@Component({
    selector: 'adf-search-trigger-test',
    imports: [SearchTriggerDirective],
    template: `<input [searchAutocomplete]="panel()" />`
})
class SearchTriggerTestComponent {
    panel = signal<any>(null);
    input = viewChild.required(SearchTriggerDirective);
    host = viewChild.required(SearchTriggerDirective, { read: ElementRef });
}

describe('SearchTriggerDirective without zone.js', () => {
    it('should set panel visibility after the next render when panel is opened', async () => {
        const setVisibility = jasmine.createSpy('setVisibility');
        const panel = {
            keyPressedStream: new Subject<string>(),
            setVisibility,
            resetResults: () => {},
            hidePanel: () => {},
            showPanel: true,
            isOpen: false
        };

        TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
        const fixture = TestBed.createComponent(SearchTriggerTestComponent);
        fixture.componentInstance.panel.set(panel);
        await fixture.whenStable();

        fixture.componentInstance.input().openPanel();
        expect(setVisibility).not.toHaveBeenCalled();

        fixture.componentRef.changeDetectorRef.markForCheck();
        await fixture.whenStable();

        expect(setVisibility).toHaveBeenCalledTimes(1);
    });
});
