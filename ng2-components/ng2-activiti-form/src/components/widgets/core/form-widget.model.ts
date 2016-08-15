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

import { FormModel } from './form.model';

export class FormWidgetModel {

    private _form: FormModel;
    private _json: any;

    get form(): FormModel {
        return this._form;
    }

    get json(): any {
        return this._json;
    }

    constructor(form: FormModel, json: any) {
        this._form = form;
        this._json = json;
    }
}

export interface FormWidgetModelCache<T extends FormWidgetModel> {
    [key: string]: T;
}
