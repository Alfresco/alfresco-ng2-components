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

import { TestBed } from '@angular/core/testing';
import { SignalLeftLabelComponent } from './left-label.component';

describe('SignalLeftLabelComponent', () => {
    const render = (required: boolean) => {
        const fixture = TestBed.createComponent(SignalLeftLabelComponent);
        fixture.componentRef.setInput('target', 'name');
        fixture.componentRef.setInput('text', 'Name');
        fixture.componentRef.setInput('required', required);
        fixture.detectChanges();
        return fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    };

    it('should label its field, with an id for controls that point at it', () => {
        const label = render(false);

        expect(label.htmlFor).toBe('name');
        expect(label.id).toBe('name-label');
        expect(label.textContent.trim()).toBe('Name');
        expect(label.querySelector('.adf-asterisk')).toBeNull();
    });

    it('should mark a required field', () => {
        expect(render(true).querySelector('.adf-asterisk')?.textContent).toBe('*');
    });
});
