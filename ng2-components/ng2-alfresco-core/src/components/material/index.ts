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

import { MDL } from './mdl-upgrade-element.directive';
import { AlfrescoMdlButtonDirective } from './mdl-button.directive';
import { AlfrescoMdlMenuDirective } from './mdl-menu.directive';
import { AlfrescoMdlTextFieldDirective } from './mdl-textfield.directive';

export * from './mdl-upgrade-element.directive';
export * from './mdl-button.directive';
export * from './mdl-menu.directive';
export * from './mdl-textfield.directive';

export const MATERIAL_DESIGN_DIRECTIVES: [any] = [
    MDL,
    AlfrescoMdlButtonDirective,
    AlfrescoMdlMenuDirective,
    AlfrescoMdlTextFieldDirective
];
