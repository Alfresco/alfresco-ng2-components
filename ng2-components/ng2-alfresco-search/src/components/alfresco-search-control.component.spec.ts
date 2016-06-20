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

import { it, describe } from '@angular/core/testing';
import { AlfrescoSearchControlComponent } from './alfresco-search-control.component';

describe('AlfrescoSearchControlComponent', () => {

    it('should setup i18n folder', () => {

        let translation = jasmine.createSpyObj('AlfrescoTranslationService', [
            'addTranslationFolder'
        ]);

        let alfrescoSearchControlComponent = new AlfrescoSearchControlComponent(translation);
        expect(alfrescoSearchControlComponent).toBeDefined();

    });
});
