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

export class DiagramElementModel {
    completed: boolean;
    current: boolean;
    height: string;
    id: string;
    name: string;
    type: string;
    width: string;
    value: string;
    x: string;
    y: string;
    properties: DiagramElementPropertyModel[] = [];
    dataType: string = '';
    eventDefinition: DiagramEventDefinitionModel;
    taskType: string = '';

    constructor(obj?: any) {
        if (obj) {
            this.completed = !!obj.completed;
            this.current = !!obj.current;
            this.height = obj.height || '';
            this.id = obj.id || '';
            this.name = obj.name || '';
            this.type = obj.type || '';
            this.width = obj.width || '';
            this.value = obj.value || '';
            this.x = obj.x || '';
            this.y = obj.y || '';
            this.taskType = obj.taskType || '';
            if (obj.properties) {
                obj.properties.forEach((property: DiagramElementPropertyModel) => {
                    this.properties.push(new DiagramElementPropertyModel(property));
                });
            }
            this.dataType = obj.dataType || '';
            if (obj.eventDefinition) {
                this.eventDefinition = new DiagramEventDefinitionModel(obj.eventDefinition);
            }
        }
    }
}

export class DiagramElementPropertyModel {
    name: string;
    type: string;
    value: any;

    constructor(obj?: any) {
        if (obj) {
            this.name = obj.name;
            this.type = obj.type;
            this.value = obj.value;
        }
    }
}

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

export class DiagramWayPointModel {
    x: number;
    y: number;

    constructor(obj?: any) {
        if (obj) {
            this.x = obj.x;
            this.y = obj.y;
        }
    }
}

export class DiagramEventDefinitionModel {
    timeCycle: string;
    type: string;

    constructor(obj?: any) {
        if (obj) {
            this.timeCycle = obj.timeCycle;
            this.type = obj.type;
        }
    }
}

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

export class DiagramLaneElementModel {
    height: number;
    id: string;
    name: string;
    width: number;
    x: number;
    y: number;

    constructor(obj?: any) {
        if (obj) {
            this.height = obj.height;
            this.id = obj.id;
            this.name = obj.name;
            this.width = obj.width;
            this.x = obj.x;
            this.y = obj.y;
        }
    }
}
