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

/**
 * This object represent of the StartTaskModel.
 */
import { UserProcessModel } from '../../common/models/user-process.model';

export class StartTaskModel {
    name: string;
    description: string;
    assignee: UserProcessModel;
    dueDate: any;
    formKey: any;
    category: string;

    constructor(obj?: any) {
        this.name = obj?.name;
        this.description = obj?.description;
        this.assignee = obj?.assignee ? new UserProcessModel(obj.assignee) : null;
        this.dueDate = obj?.dueDate;
        this.formKey = obj?.formKey;
        this.category = obj?.category;
    }
}
