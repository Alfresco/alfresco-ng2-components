"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var animations_1 = require("@angular/animations");
exports.contextMenuAnimation = [
    animations_1.state('void', animations_1.style({
        opacity: 0,
        transform: 'scale(0.01, 0.01)'
    })),
    animations_1.transition('void => *', animations_1.sequence([
        animations_1.query('.mat-menu-content', animations_1.style({ opacity: 0 })),
        animations_1.animate('100ms linear', animations_1.style({ opacity: 1, transform: 'scale(1, 0.5)' })),
        animations_1.group([
            animations_1.query('.mat-menu-content', animations_1.animate('400ms cubic-bezier(0.55, 0, 0.55, 0.2)', animations_1.style({ opacity: 1 }))),
            animations_1.animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', animations_1.style({ transform: 'scale(1, 1)' }))
        ])
    ])),
    animations_1.transition('* => void', animations_1.animate('150ms 50ms linear', animations_1.style({ opacity: 0 })))
];
//# sourceMappingURL=animations.js.map