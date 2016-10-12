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

/**
 *
 * This object represent the report definition.
 *
 *
 * @returns {ReportModel} .
 */
export class ReportModel {
    id: number;
    name: string;
    definition: ReportParametersModel;
    created: string;

    constructor(obj?: any) {
        this.id = obj && obj.id;
        this.name = obj && obj.name || null;
        if (obj && obj.definition) {
            this.definition = new ReportParametersModel(JSON.parse(obj.definition));
        }
        this.created = obj && obj.created || null;
    }
}

export class ReportParametersModel {
    parameters: ReportParameterModel[] = [];

    constructor(obj?: any) {
        obj.parameters.forEach((params: any) => {
            let reportParamsModel = new ReportParameterModel(params);
            this.parameters.push(reportParamsModel);
        });
    }

    findParam(name: string): ReportParameterModel {
        this.parameters.forEach((param) => {
            return param.type === name ? param : null;
        });
        return null;
    }
}

/**
 *
 * This object represent the report parameter definition.
 *
 *
 * @returns {ReportParameterModel} .
 */
export class ReportParameterModel {
    id: string;
    name: string;
    nameKey: string;
    type: string;
    value: string;
    options: ParameterValueModel[];
    dependsOn: string;

    constructor(obj?: any) {
        this.id = obj && obj.id;
        this.name = obj && obj.name || null;
        this.nameKey = obj && obj.nameKey || null;
        this.type = obj && obj.type || null;
        this.value = obj && obj.value || null;
        this.options = obj && obj.options || null;
        this.dependsOn = obj && obj.dependsOn || null;
    }
}

export class ParameterValueModel {
    id: string;
    name: string;
    version: string;
    value: string;

    constructor(obj?: any) {
        this.id = obj && obj.id;
        this.name = obj && obj.name || null;
        this.value = obj && obj.value || null;
        this.version = obj && obj.version || null;
    }

    get label () {
        return this.version ? `${this.name} (v ${this.version}) ` : this.name;
    }
}

export class ReportQuery {
    processDefinitionId: string;
    status: string;
    taskName: string;
    typeFiltering: boolean;
    dateRange: ReportDateRange;
    dateRangeInterval: string;
    slowProcessInstanceInteger: number;
    duration: number;

    constructor(obj?: any) {
        this.processDefinitionId = obj && obj.processDefinitionId || null;
        this.status = obj && obj.status || null;
        this.taskName = obj && obj.taskName || null;
        this.dateRangeInterval = obj && obj.dateRangeInterval || null;
        this.typeFiltering = obj && obj.typeFiltering || false;
        this.slowProcessInstanceInteger = obj && obj.slowProcessInstanceInteger || 0;
        this.duration = obj && obj.duration || 0;
        this.dateRange = new ReportDateRange(obj);
    }
}

export class ReportDateRange {
    startDate: string;
    endDate: string;

    constructor(obj?: any) {
        this.startDate = obj && obj.startDate || null;
        this.endDate = obj && obj.endDate || null;
    }

}
