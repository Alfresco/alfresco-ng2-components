/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FormStylePipe } from './form-style.pipe';
import { ThemeModel } from '../components/widgets/core/theme.model';

describe('FormStylePipe', () => {
    let pipe: FormStylePipe;

    beforeEach(() => {
        pipe = new FormStylePipe();
    });

    it('should transform form theme into styles', () => {
        const formTheme: ThemeModel = {
            form: {
                '--adf-form-label-font-size': '16px',
                '--adf-form-label-color': 'black',
                '--adf-form-label-font-weight': 'bold'
            }
        };

        const result = pipe.transform(formTheme);

        expect(result).toEqual('--adf-form-label-font-size: 16px;--adf-form-label-color: black;--adf-form-label-font-weight: bold');
    });

    it('should return an empty string if form theme is undefined', () => {
        const result = pipe.transform(undefined);

        expect(result).toEqual('');
    });
});
