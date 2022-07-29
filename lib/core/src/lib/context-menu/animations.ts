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

import {
    state,
    style,
    animate,
    transition,
    query,
    group,
    sequence,
    AnimationStateMetadata,
    AnimationTransitionMetadata
} from '@angular/animations';

export const contextMenuAnimation: ( AnimationStateMetadata | AnimationTransitionMetadata)[] = [
    state('void', style({
        opacity: 0,
        transform: 'scale(0.01, 0.01)'
    })),
    transition('void => *', sequence([
        query('.mat-menu-content', style({ opacity: 0 })),
        animate('100ms linear', style({ opacity: 1, transform: 'scale(1, 0.5)' })),
        group([
            query('.mat-menu-content', animate('400ms cubic-bezier(0.55, 0, 0.55, 0.2)',
                style({ opacity: 1 })
            )),
            animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'scale(1, 1)' }))
        ])
    ])),
    transition('* => void', animate('150ms 50ms linear', style({ opacity: 0 })))
];
