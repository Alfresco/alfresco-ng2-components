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

import { DiagramWayPointModel } from './diagram-way-point.model';

export class DiagramFlowElementModel {
    completed: boolean;
    current: boolean;
    id: string;
    properties: any[] = [];
    sourceRef: string;
    targetRef: string;
    type: string;
    waypoints: DiagramWayPointModel[] = [];

    constructor(obj?: any) {
        if (obj) {
            this.completed = !!obj.completed;
            this.current = !!obj.current;
            this.id = obj.id;
            this.properties = obj.properties;
            this.sourceRef = obj.sourceRef;
            this.targetRef = obj.targetRef;
            this.type = obj.type;
            if (obj.waypoints) {
                obj.waypoints.forEach((waypoint: DiagramWayPointModel) => {
                    this.waypoints.push(new DiagramWayPointModel(waypoint));
                });
            }
        }
    }
}
