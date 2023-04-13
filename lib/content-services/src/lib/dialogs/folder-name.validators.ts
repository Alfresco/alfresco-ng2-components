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

import { UntypedFormControl } from '@angular/forms';

const I18N_ERRORS_PATH = 'CORE.FOLDER_DIALOG.FOLDER_NAME.ERRORS';

export const forbidSpecialCharacters = ({ value }: UntypedFormControl) => {
    const specialCharacters: RegExp = /([\*\"\<\>\\\/\?\:\|])/;
    const isValid: boolean = !specialCharacters.test(value);

    return (isValid) ? null : {
        message: `${I18N_ERRORS_PATH}.SPECIAL_CHARACTERS`
    };
};

export const forbidEndingDot = ({ value }: UntypedFormControl) => {
    const isValid: boolean = ((value || '').trim().split('').pop() !== '.');

    return isValid ? null : {
        message: `${I18N_ERRORS_PATH}.ENDING_DOT`
    };
};

export const forbidOnlySpaces = ({ value }: UntypedFormControl) => {
    const isValid: boolean = !!((value || '')).trim();

    return isValid ? null : {
        message: `${I18N_ERRORS_PATH}.ONLY_SPACES`
    };
};
