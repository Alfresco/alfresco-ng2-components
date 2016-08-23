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

import { Injectable, ChangeDetectorRef, Pipe } from '@angular/core';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { AlfrescoTranslationService } from './AlfrescoTranslation.service';

@Injectable()
@Pipe({
    name: 'translate',
    pure: false // required to update the value when the promise is resolved
})
export class AlfrescoPipeTranslate extends TranslatePipe {

    constructor(translate: AlfrescoTranslationService, _ref: ChangeDetectorRef) {
        super(translate, _ref);
    }
}
