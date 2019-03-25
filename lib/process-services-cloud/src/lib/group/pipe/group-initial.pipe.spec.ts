/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { InitialGroupNamePipe } from './group-initial.pipe';
import { GroupModel } from '../models/group.model';

describe('InitialGroupNamePipe', () => {

    let pipe: InitialGroupNamePipe;
    let fakeGroup: GroupModel;

    beforeEach(() => {
        pipe = new InitialGroupNamePipe();
        fakeGroup = new GroupModel({name: 'mock'});
    });

    it('should return with the group initial', () => {
        fakeGroup.name = 'FAKE-GROUP-NAME';
        const result = pipe.transform(fakeGroup);
        expect(result).toBe('F');
    });

    it('should return an empty string when group is null', () => {
        const result = pipe.transform(null);
        expect(result).toBe('');
    });
});
