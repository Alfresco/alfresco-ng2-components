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

import { LocalizedRolePipe } from './localized-role.pipe';

describe('LocalizedRolePipe', () => {
    let translationService: any;
    let pipe: LocalizedRolePipe;

    beforeEach(() => {
        translationService = jasmine.createSpyObj('TranslationService', ['instant']);
        pipe = new LocalizedRolePipe(translationService);
    });

    it('should return null', () => {
        expect(pipe.transform(null)).toBeNull();
    });

    it('should translate value', () => {
        translationService.instant.and.returnValue('Consumer');
        expect(pipe.transform('ADF.ROLES.CONSUMER')).toEqual('Consumer');
    });

    it('should return the key when translation not present', () => {
        translationService.instant.and.callFake((value) => {
            if (value === 'ADF.ROLES.CONSUMER') {
                return 'Consumer';
            } else {
                return value;
            }
        });

        expect(pipe.transform('Contributor')).toBe('ADF.ROLES.CONTRIBUTOR');
        expect(pipe.transform('Consumer')).toEqual('Consumer');
    });
});
