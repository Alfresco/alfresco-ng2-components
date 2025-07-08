/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { TruncatePipe } from './truncate.pipe';
import { TestBed } from '@angular/core/testing';
import { Injector, runInInjectionContext } from '@angular/core';

describe('TruncatePipe', () => {
    let pipe: TruncatePipe;

    beforeEach(() => {
        const injector = TestBed.inject(Injector);
        runInInjectionContext(injector, () => {
            pipe = new TruncatePipe();
        });
    });

    it('should truncate texts longer than maxTextLength value', () => {
        const text = 'This is a long text';
        expect(pipe.transform(text, 10)).toBe('This is a ...');
    });

    it('should not truncate texts shorter than maxTextLength value', () => {
        const text = 'Short text';
        expect(pipe.transform(text, 20)).toBe('Short text');
    });

    it('should truncate texts longer than 250 chars and append "..." by default', () => {
        let text =
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes,';
        text += ' nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.';
        let truncatedString =
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, ';
        truncatedString += 'nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium ...';
        expect(pipe.transform(text)).toBe(truncatedString);
    });

    it('should append custom ellipsis when ellipsis param is provided', () => {
        const text = 'This is a long text';
        expect(pipe.transform(text, 10, '***')).toBe('This is a ***');
    });
});
