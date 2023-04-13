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

import { Injectable } from '@angular/core';
import { DataColumn, DataColumnType } from '@alfresco/adf-core';
import { ProcessListDataColumnCustomData } from '../models/data-column-custom-data';
import { ProcessInstanceVariable, WithVariablesMap } from '../models/process-instance-variable.model';

@Injectable({ providedIn: 'root' })
export class VariableMapperService {
    mapVariablesByColumnTitle <T extends { variables?: ProcessInstanceVariable[] }>(
        instancesList: T[] = [],
        columnsSchema: DataColumn<ProcessListDataColumnCustomData>[] = []
    ): Array<WithVariablesMap<T>> {
        const columnsByVariables = this.mapColumnKeysByVariable(columnsSchema);

        const rowsViewModel = instancesList.map<WithVariablesMap<T>>((instance) => {
            if (!instance.variables?.length) {
                return instance;
            }

            const variablesMap = (instance.variables ?? []).reduce<{[columnTitle: string]: ProcessInstanceVariable}>((variableAccumulator, variable) => {
                const processVariableDefinitionPayload =  `${variable.processDefinitionKey}/${variable.name}`;

                const column = columnsByVariables[processVariableDefinitionPayload];
                if (column) {
                    variableAccumulator[column] = {
                        ...variable,
                        type: this.mapProcessVariableTypes(variable.type)
                    };
                }

                return variableAccumulator;
            }, {});

            return {
                ...instance,
                variablesMap
            };
        });

        return rowsViewModel;
    }

    private mapColumnKeysByVariable(
        columnsSchema: DataColumn<ProcessListDataColumnCustomData>[]
    ): { [key: string]: string } {
        const columnsByVariables = columnsSchema
            .filter(column => !!column.customData)
            .reduce<{ [key: string]: string }>((columnsByVariable, column) => {
                const columnTitle = column.title;
                const variables = column.customData.variableDefinitionsPayload;

                variables.forEach((key) => {
                    columnsByVariable[key] = columnTitle;
                });
                return columnsByVariable;

            }, {});

        return columnsByVariables;
    }

    private mapProcessVariableTypes(variableType: string): DataColumnType {
        switch (variableType) {
            case 'boolean':
            case 'integer':
            case 'string':
                return 'text';
            case 'date':
            case 'datetime':
                return 'date';
            default:
                return 'text';
        }
    }
}
