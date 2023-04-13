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

import { ReportDefinitionModel } from './report-definition.model';

export class ReportParametersModel {
    id: number;
    name: string;
    definition: ReportDefinitionModel;
    created: string;
    description?: string;

    constructor(obj?: any) {
        this.id = obj && obj.id;
        this.name = obj && obj.name || null;
        this.description = obj.description;

        if (obj && obj.definition) {
            this.definition = new ReportDefinitionModel(JSON.parse(obj.definition));
        }
        this.created = obj && obj.created || null;
    }

    hasParameters() {
        return (this.definition && this.definition.parameters && this.definition.parameters.length > 0) ? true : false;
    }
}
