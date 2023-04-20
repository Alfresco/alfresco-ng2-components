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

import { DiagramLaneElementModel } from './diagram-lane-element.model';

export class DiagramPoolElementModel {
    height: string;
    id: string;
    name: string;
    properties: any;
    lanes: DiagramLaneElementModel[] = [];
    width: string;
    x: number;
    y: number;

    constructor(obj?: any) {
        if (obj) {
            this.height = obj.height;
            this.id = obj.id;
            this.name = obj.name;
            this.properties = obj.properties;
            this.width = obj.width;
            this.x = obj.x;
            this.y = obj.y;
            if (obj.lanes) {
                obj.lanes.forEach((lane: DiagramLaneElementModel) => {
                    this.lanes.push(new DiagramLaneElementModel(lane));
                });
            }
        }
    }
}
