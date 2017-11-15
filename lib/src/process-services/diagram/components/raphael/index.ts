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

import { RaphaelCircleDirective } from './raphael-circle.component';
import { RaphaelCrossDirective } from './raphael-cross.component';
import { RaphaelFlowArrowDirective } from './raphael-flow-arrow.component';
import { RaphaelMultilineTextDirective } from './raphael-multiline-text.component';
import { RaphaelPentagonDirective } from './raphael-pentagon.component';
import { RaphaelPlusDirective } from './raphael-plus.component';
import { RaphaelRectDirective } from './raphael-rect.component';
import { RaphaelRhombusDirective } from './raphael-rhombus.component';
import { RaphaelTextDirective } from './raphael-text.component';

// services
import { RaphaelService } from './raphael.service';

// icons
import { RAPHAEL_ICONS_DIRECTIVES } from './icons/index';

// primitives
export * from './raphael-circle.component';
export * from './raphael-rect.component';
export * from './raphael-text.component';
export * from './raphael-multiline-text.component';
export * from './raphael-flow-arrow.component';
export * from './raphael-cross.component';
export * from './raphael-plus.component';
export * from './raphael-rhombus.component';
export * from './raphael-pentagon.component';
export * from './icons/index';

export const RAPHAEL_DIRECTIVES: any[] = [
    RaphaelCircleDirective,
    RaphaelRectDirective,
    RaphaelTextDirective,
    RaphaelMultilineTextDirective,
    RaphaelFlowArrowDirective,
    RaphaelCrossDirective,
    RaphaelPlusDirective,
    RaphaelRhombusDirective,
    RaphaelPentagonDirective,
    RAPHAEL_ICONS_DIRECTIVES
];

export const RAPHAEL_PROVIDERS: any[] = [
    RaphaelService
];
