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

import { Directive } from '@angular/core';

/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0.
 * The empty-folder-content selector will be deprecated as it has been replace by
 * adf-custom-empty-content-template.
 */
@Directive({
    selector: 'adf-custom-empty-content-template, empty-folder-content'
})
export class CustomEmptyContentTemplateDirective {}
