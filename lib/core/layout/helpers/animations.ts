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

import { trigger, transition, animate, style, state, AnimationTriggerMetadata } from '@angular/animations';

export const sidenavAnimation: AnimationTriggerMetadata = trigger('sidenavAnimation', [
    state('expanded', style({ width: '{{ width }}px' }), { params : { width: 0 } }),
    state('compact',  style({ width: '{{ width }}px' }), { params : { width: 0 } }),
    transition('compact <=> expanded', animate('0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'))
]);

export const contentAnimation: AnimationTriggerMetadata = trigger('contentAnimationLeft', [
    state('expanded', style({
        'margin-left': '{{ margin-left }}px',
        'margin-right': '{{ margin-right }}px'
    }), { params: { 'margin-left': 0, 'margin-right': 0 } }),
    state('compact', style({
        'margin-left': '{{ margin-left }}px',
        'margin-right': '{{ margin-right }}px'
    }), { params: { 'margin-left': 0, 'margin-right': 0 } }),
    transition('expanded <=> compact', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
]);
