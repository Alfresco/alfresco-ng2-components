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

 /* eslint-disable @angular-eslint/component-selector */

export abstract class FormWidgetModel {

    readonly fieldType: string;
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly tab: string;

    readonly form: any;
    readonly json: any;
    readonly field: any;

    protected constructor(form: any, json: any) {
        this.form = form;
        this.json = json;

        if (json) {
            this.fieldType = json.fieldType;
            this.id = json.id;
            this.name = json.name;
            this.type = json.type;
            this.tab = json.tab;
            this.field = json.field;
        }
    }
}

export interface FormWidgetModelCache<T extends FormWidgetModel> {
    [key: string]: T;
}
