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
exports.sidenavAnimation = animations_1.trigger('sidenavAnimation', [
    animations_1.state('expanded', animations_1.style({ width: '{{ width }}px' }), { params: { width: 0 } }),
    animations_1.state('compact', animations_1.style({ width: '{{ width }}px' }), { params: { width: 0 } }),
    animations_1.transition('compact <=> expanded', animations_1.animate('0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'))
]);
exports.contentAnimation = animations_1.trigger('contentAnimationLeft', [
    animations_1.state('expanded', animations_1.style({
        'margin-left': '{{ margin-left }}px',
        'margin-right': '{{ margin-right }}px'
    }), { params: { 'margin-left': 0, 'margin-right': 0 } }),
    animations_1.state('compact', animations_1.style({
        'margin-left': '{{ margin-left }}px',
        'margin-right': '{{ margin-right }}px'
    }), { params: { 'margin-left': 0, 'margin-right': 0 } }),
    animations_1.transition('expanded <=> compact', animations_1.animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
]);
//# sourceMappingURL=animations.js.map