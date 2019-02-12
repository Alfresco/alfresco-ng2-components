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

/* tslint:disable:component-selector  */

import { DynamicTableColumnOption } from './dynamic-table-column-option.model';

// maps to: com.activiti.model.editor.form.ColumnDefinitionRepresentation
export interface DynamicTableColumn {

    id: string;
    name: string;
    type: string;
    value: any;
    optionType: string;
    options: DynamicTableColumnOption[];
    restResponsePath: string;
    restUrl: string;
    restIdProperty: string;
    restLabelProperty: string;
    amountCurrency: string;
    amountEnableFractions: boolean;
    required: boolean;
    editable: boolean;
    sortable: boolean;
    visible: boolean;

    // TODO: com.activiti.domain.idm.EndpointConfiguration.EndpointConfigurationRepresentation
    endpoint: any;
    // TODO: com.activiti.model.editor.form.RequestHeaderRepresentation
    requestHeaders: any;
}
