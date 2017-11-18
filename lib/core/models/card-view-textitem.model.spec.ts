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

import { PipeTransform } from '@angular/core';
import { CardViewTextItemModel, CardViewTextItemProperties } from './card-view-textitem.model';

class TestPipe implements PipeTransform {
    transform(value: string, pipeParam: string): string {
        const paramPostFix = pipeParam ? `-${pipeParam}` : '';
        return `testpiped-${value}${paramPostFix}`;
    }
}

describe('CardViewTextItemModel', () => {

    let properties: CardViewTextItemProperties;

    beforeEach(() => {
        properties = {
            label: 'Tribe',
            value: 'Banuk',
            key: 'tribe'
        };
    });

    describe('displayValue', () => {

        it('should return the extension if file has it', () => {
            const file = new CardViewTextItemModel(properties);

            expect(file.displayValue).toBe('Banuk');
        });

        it('should apply a pipe on the value if it is present', () => {
            properties.pipes = [
                { pipe: new TestPipe() }
            ];
            const file = new CardViewTextItemModel(properties);

            expect(file.displayValue).toBe('testpiped-Banuk');
        });

        it('should apply a pipe on the value with parameters if those are present', () => {
            properties.pipes = [
                { pipe: new TestPipe(), params: ['withParams'] }
            ];
            const file = new CardViewTextItemModel(properties);

            expect(file.displayValue).toBe('testpiped-Banuk-withParams');
        });

        it('should apply more pipes on the value with parameters if those are present', () => {
            const pipe: PipeTransform = new TestPipe();
            properties.pipes = [
                { pipe, params: ['1'] },
                { pipe, params: ['2'] },
                { pipe, params: ['3'] }
            ];
            const file = new CardViewTextItemModel(properties);

            expect(file.displayValue).toBe('testpiped-testpiped-testpiped-Banuk-1-2-3');
        });
    });
});
