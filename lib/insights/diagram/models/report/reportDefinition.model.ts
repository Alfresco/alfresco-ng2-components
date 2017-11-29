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

import { ReportParameterDetailsModel } from './reportParameterDetails.model';

export class ReportDefinitionModel {
    parameters: ReportParameterDetailsModel[] = [];

    constructor(obj?: any) {
        obj.parameters.forEach((params: any) => {
            let reportParamsModel = new ReportParameterDetailsModel(params);
            this.parameters.push(reportParamsModel);
        });
    }

    findParam(name: string): ReportParameterDetailsModel {
        this.parameters.forEach((param) => {
            return param.type === name ? param : null;
        });
        return null;
    }
}
