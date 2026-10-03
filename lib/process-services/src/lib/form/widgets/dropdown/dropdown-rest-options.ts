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

import { FormFieldModel } from '@alfresco/adf-core';

const fieldsWithLoadedRestOptions = new WeakSet<FormFieldModel>();

/**
 * Records that the REST request for the options of a dropdown field has finished, with or without options.
 *
 * @param field Dropdown form field
 */
export const setDropdownRestOptionsLoaded = (field: FormFieldModel): void => {
    fieldsWithLoadedRestOptions.add(field);
};

/**
 * Checks whether the REST request for the options of a dropdown field has finished.
 *
 * @param field Dropdown form field
 * @returns `true` once the request has returned options or failed
 */
export const hasDropdownRestOptionsLoaded = (field: FormFieldModel): boolean => fieldsWithLoadedRestOptions.has(field);
