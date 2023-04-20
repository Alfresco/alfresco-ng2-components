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

export const ANCHOR_TYPE = {
    main: 'main',
    middle: 'middle',
    first: 'first',
    last: 'last'
};

export class Anchor {
    uuid: any = null;
    x: any = 0;
    y: any = 0;
    isFirst: any = false;
    isLast: any = false;
    typeIndex: any = 0;
    type: any = ANCHOR_TYPE.main;

    constructor(uuid: any, type: any, x: any, y: any) {
        this.uuid = uuid;
        this.x = x;
        this.y = y;
        this.type = (type === ANCHOR_TYPE.middle) ? ANCHOR_TYPE.middle : ANCHOR_TYPE.main;
    }
}
