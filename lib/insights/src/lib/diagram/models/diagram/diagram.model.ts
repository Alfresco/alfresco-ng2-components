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

import { DiagramElementModel } from './diagram-element.model';
import { DiagramFlowElementModel } from './diagram-flow-element.model';
import { DiagramPoolElementModel } from './diagram-pool-element.model';

export class DiagramModel {
    diagramBeginX: number;
    diagramBeginY: number;
    diagramHeight: number;
    diagramWidth: number;
    elements: DiagramElementModel[] = [];
    flows: DiagramFlowElementModel[] = [];
    pools: DiagramPoolElementModel[] = [];

    constructor(obj?: any) {
        if (obj) {
            this.diagramBeginX = obj.diagramBeginX;
            this.diagramBeginY = obj.diagramBeginY;
            this.diagramHeight = obj.diagramHeight;
            this.diagramWidth = obj.diagramWidth;
            if (obj.elements) {
                obj.elements.forEach((element: DiagramElementModel) => {
                    this.elements.push(new DiagramElementModel(element));
                });
            }
            if (obj.flows) {
                obj.flows.forEach((flow: DiagramFlowElementModel) => {
                    this.flows.push(new DiagramFlowElementModel(flow));
                });
            }
            if (obj.pools) {
                obj.pools.forEach((pool: DiagramPoolElementModel) => {
                    this.pools.push(new DiagramPoolElementModel(pool));
                });
            }
        }
    }
}
