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

import { FormFieldValidator } from '@alfresco/adf-core';
import { DropdownCloudFieldValidator } from './widgets/dropdown/dropdown-cloud.field-validator';

/**
 * Field validators for the rules of the cloud widgets, added to the core `FORM_FIELD_VALIDATORS` by the cloud form builders.
 * Pass them to a `FormModel` you build yourself to validate cloud forms the same way.
 */
export const CLOUD_FORM_FIELD_VALIDATORS: FormFieldValidator[] = [new DropdownCloudFieldValidator()];
